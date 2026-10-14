/*
Live stream player. A port of the website's player (wxdnew/components/AudioContext.js)
onto expo-audio, keeping its rules for when to recover a stream and when to let it go.

The website plays through an <audio> element and reads its DOM events. Here a single
long-lived native player (AVPlayer on iOS, ExoPlayer on Android) reports through
'playbackStatusUpdate', and a JS watchdog polls it for the failures that report nothing.
The notes below cover where the two differ; the reasoning behind each constant is the
website's, and lives with it there.
*/

import React, { createContext, useContext, useEffect, useState } from 'react'
import { isRunningInExpoGo } from 'expo'
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio'

// The app only plays the 320 kbps mount, so there's no quality switching to manage.
const STREAM_URL = 'https://stream.wxdu.art/wxdu320.mp3'
const supportsBackgroundPlayback = !isRunningInExpoGo()

const LOCK_SCREEN_METADATA = { title: 'WXDU 88.7 FM', artist: 'Live Radio' }

// How often the native player reports while audio is flowing. The watchdog polls on
// its own schedule, so this only needs to be frequent enough to clear status promptly.
const STATUS_UPDATE_INTERVAL_MS = 1000

// Watchdog: if we want to play but currentTime hasn't advanced for STALL_TIMEOUT_MS,
// the stream has silently died — rejoin. Neither native player reliably reports a
// dropped connection: AVPlayer can sit in 'waitingToPlayAtSpecifiedRate' forever, and
// ExoPlayer stays in STATE_BUFFERING (which expo-audio doesn't emit as a pause at all).
const WATCHDOG_INTERVAL_MS = 2000
const STALL_TIMEOUT_MS = 6000

// How long a play attempt may produce no audio at all before we retry it. Unlike the
// website, reconnect attempts are policed by this too (not by STALL_TIMEOUT_MS): the
// 320 mount takes ~5s to first audio on a good connection, so a 6s budget would retry
// a weak-signal connect that was about to succeed, over and over.
const STARTUP_TIMEOUT_MS = 15000

// Retry backoff: 2s, 4s, 8s ... capped at 30s.
const RECONNECT_DEBOUNCE_MS = 2000
const RECONNECT_MAX_DELAY_MS = 30000

// How long after a drop we'll still bring the stream back on our own. Past this we
// stop trying and leave a paused player, so audio never starts up in a pocket twenty
// minutes later. Measured against wall-clock at event time, never with a timer.
const RECOVERY_WINDOW_MS = 180000 // 3 minutes

// Our own play()/pause()/replace() calls make the native player report 'not playing'
// for a moment. Anything within this long of one of ours is treated as ours.
const INTERNAL_PAUSE_WINDOW_MS = 1000

// A pause we didn't ask for is the OS stopping us (headphones/Bluetooth/CarPlay gone,
// a phone call, another app taking audio), and ends the session. But on iOS a stream
// the server closed also first reports a plain pause, with the 'didJustFinish' or
// 'error' that explains it arriving just after. So wait this long before deciding.
const ROUTE_CHANGE_SETTLE_MS = 300

// A live stream has no resumable position. If we've been paused longer than this,
// resuming would play stale buffered audio, so reload the source to rejoin live.
const RESUME_REJOIN_THRESHOLD_MS = 5000

const log = (...args: unknown[]) => {
    if (__DEV__) console.log('[audio]', ...args)
}

type StreamState = {
    // The listener wants audio (set on play, cleared on pause or when the session
    // ends). Drives the play/pause button.
    isPlaying: boolean
    // A play attempt is under way and no audio has flowed yet.
    isLoading: boolean
    // We want audio but it stopped flowing, and we're trying to rejoin.
    isStalled: boolean
}

const INITIAL_STATE: StreamState = { isPlaying: false, isLoading: false, isStalled: false }

// All of the player logic lives outside React: it's driven by native events and
// timers, and keeps its bookkeeping in plain variables rather than refs. The provider
// creates one for the life of the app and mirrors its state into React.
function createStreamController(onChange: (state: StreamState) => void) {
    let state = INITIAL_STATE
    const update = (patch: Partial<StreamState>) => {
        state = { ...state, ...patch }
        onChange(state)
    }

    let player: AudioPlayer | null = null
    let statusSubscription: { remove: () => void } | null = null
    // First play awaits setAudioModeAsync; ignore taps until the player exists.
    let settingUp = false

    // What the listener wants — the gate on every automatic reconnect.
    let wantsToPlay = false
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    // Pending "was that pause the OS stopping us?" decision.
    let pendingStopTimer: ReturnType<typeof setTimeout> | null = null
    // Wall-clock time audio last advanced. 0 means it hasn't since the current attempt
    // began, so playAttemptAt bounds the wait instead.
    let lastProgressAt = 0
    // Last observed currentTime. -1 means (re)loaded, awaiting a fresh baseline: a
    // reload resets currentTime, which must not be mistaken for progress.
    let lastTime = -1
    // When the current play/reconnect attempt began (0 = none outstanding).
    let playAttemptAt = 0
    let reconnectAttempts = 0
    // When the stream dropped, starting the recovery window (0 = healthy).
    let droppedAt = 0
    let internalPauseUntil = 0
    // When playback last stopped, to tell if resuming would play stale audio.
    let pausedAt = 0

    const markInternalPause = () => {
        internalPauseUntil = Date.now() + INTERNAL_PAUSE_WINDOW_MS
    }

    const clearReconnect = () => {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer)
            reconnectTimer = null
        }
    }

    const clearPendingStop = () => {
        if (pendingStopTimer) {
            clearTimeout(pendingStopTimer)
            pendingStopTimer = null
        }
    }

    // Reset the per-session bookkeeping, for a fresh attempt or a deliberate stop.
    const resetSession = () => {
        clearReconnect()
        clearPendingStop()
        lastProgressAt = 0
        lastTime = -1
        playAttemptAt = 0
        reconnectAttempts = 0
        droppedAt = 0
    }

    // Point the player at the live edge again and start it. replace() opens a fresh
    // connection on both platforms; play() is called explicitly because on Android
    // replace() only resumes if the player was playing at that instant, which a
    // buffering player isn't.
    const loadLive = () => {
        if (!player) return
        markInternalPause()
        player.replace(STREAM_URL)
        player.play()
        lastTime = -1
        lastProgressAt = 0
        playAttemptAt = Date.now()
    }

    // End the listening session: stop recovering and leave a paused player. Called when
    // the recovery window lapses and when the OS pauses us. Clearing wantsToPlay is what
    // makes this stick — nothing automatic restarts audio after it, only a deliberate
    // play (in the app, or from the lock screen / headset / car).
    const stopSession = () => {
        log('session ended')
        wantsToPlay = false
        resetSession()
        pausedAt = Date.now()
        update({ isPlaying: false, isLoading: false, isStalled: false })
        // Unconditionally: a player still trying to connect reports playing === false,
        // but would start audio by itself if the connection came good.
        if (player) {
            markInternalPause()
            player.pause()
        }
    }

    const recoveryExpired = () => droppedAt > 0 && Date.now() - droppedAt > RECOVERY_WINDOW_MS

    // Rejoin the live edge after a drop. `immediate` skips the debounce; everything
    // else backs off exponentially so a downed server isn't hammered.
    const reconnect = ({ immediate = false } = {}) => {
        if (!wantsToPlay) return
        if (droppedAt === 0) droppedAt = Date.now()
        // Checked here and again inside attempt(): a debounced attempt can come due
        // well after it was scheduled, and on a suspended app the gap between the two
        // is exactly where the window tends to lapse.
        if (recoveryExpired()) {
            stopSession()
            return
        }
        if (reconnectTimer) {
            if (!immediate) return
            clearReconnect()
        }
        update({ isStalled: true })

        const attempt = () => {
            reconnectTimer = null
            if (!wantsToPlay) return
            if (recoveryExpired()) {
                stopSession()
                return
            }
            reconnectAttempts += 1
            log('reconnect attempt', reconnectAttempts)
            loadLive()
        }

        if (immediate) {
            attempt()
            return
        }
        const delay = Math.min(RECONNECT_DEBOUNCE_MS * 2 ** reconnectAttempts, RECONNECT_MAX_DELAY_MS)
        reconnectTimer = setTimeout(attempt, delay)
    }

    // Only currentTime actually advancing proves audio is flowing again. A reload's
    // reset to 0 (or a premature 'playing') must not clear the stalled state.
    const markProgress = (t: number) => {
        if (!wantsToPlay || !Number.isFinite(t)) return
        if (lastTime < 0) {
            lastTime = t
            return
        }
        if (t > lastTime) {
            lastTime = t
            lastProgressAt = Date.now()
            playAttemptAt = 0
            clearReconnect()
            reconnectAttempts = 0
            droppedAt = 0
            if (state.isLoading || state.isStalled) update({ isLoading: false, isStalled: false })
        }
    }

    // Something outside the app started playback: the lock screen, a headset or car
    // button, or the OS resuming us after a phone call. Adopt it as the listener's
    // intent, and if we've been stopped a while, swap the stale buffer for live.
    const adoptExternalPlay = () => {
        log('playback started outside the app')
        const pausedFor = pausedAt ? Date.now() - pausedAt : Infinity
        wantsToPlay = true
        resetSession()
        pausedAt = 0
        playAttemptAt = Date.now()
        update({ isPlaying: true, isLoading: true, isStalled: false })
        if (pausedFor > RESUME_REJOIN_THRESHOLD_MS) loadLive()
    }

    const handleStatus = (status: AudioStatus) => {
        // A failed connection, or the server closing a stream that has no natural end.
        // Both are drops, squarely what the recovery window exists to ride out.
        if (status.error || status.didJustFinish) {
            log(status.error ? `error: ${status.error}` : 'stream ended')
            if (!wantsToPlay) return
            clearPendingStop()
            reconnect()
            return
        }

        if (status.playing) {
            if (wantsToPlay) {
                markProgress(status.currentTime)
            } else if (Date.now() >= internalPauseUntil && player?.playing) {
                // Re-read player.playing: a status emitted just before the listener
                // paused can arrive just after, and must not undo their pause.
                adoptExternalPlay()
            }
            return
        }

        if (!wantsToPlay || Date.now() < internalPauseUntil) return

        // ExoPlayer goes 'idle' after a playback error; treat it like the error itself.
        if (status.playbackState === 'idle' || status.playbackState === 'failed') {
            reconnect()
            return
        }

        // 'waitingToPlayAtSpecifiedRate' (iOS) is a stall, not a pause — the watchdog's
        // job. And only a loaded player can have been paused: Android reports 'paused'
        // for a connection that's still buffering, before it registers play() at all.
        if (status.timeControlStatus !== 'paused') return
        if (status.playbackState !== 'ready' && status.playbackState !== 'readyToPlay') return

        // A plain pause nobody asked for. Settle it a beat later in case an 'error' or
        // 'didJustFinish' is on its way to say the connection closed instead.
        clearPendingStop()
        pendingStopTimer = setTimeout(() => {
            pendingStopTimer = null
            if (!wantsToPlay || player?.playing) return
            log('paused by the system')
            stopSession()
        }, ROUTE_CHANGE_SETTLE_MS)
    }

    // Polls instead of waiting for status events, which stop arriving exactly when the
    // stream does. Runs for as long as the player exists.
    const runWatchdog = () => {
        if (!wantsToPlay || !player) return
        markProgress(player.currentTime)
        if (lastProgressAt === 0) {
            // No audio yet in this attempt — a connection that hangs here reports
            // nothing at all, so the attempt itself needs a deadline.
            if (playAttemptAt > 0 && Date.now() - playAttemptAt > STARTUP_TIMEOUT_MS) {
                log('no audio within startup timeout')
                reconnect()
            }
            return
        }
        if (Date.now() - lastProgressAt > STALL_TIMEOUT_MS) {
            log('stalled')
            reconnect()
        }
    }
    let watchdog: ReturnType<typeof setInterval> | null = null

    const createPlayer = async () => {
        await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: supportsBackgroundPlayback,
            // lock screen controls require doNotMix
            interruptionMode: 'doNotMix',
            allowsRecording: false,
            shouldRouteThroughEarpiece: false,
        })
        const created = createAudioPlayer(STREAM_URL, {
            updateInterval: STATUS_UPDATE_INTERVAL_MS,
            // iOS otherwise deactivates the audio session when a stream ends, and a
            // backgrounded app can't always reactivate it to reconnect.
            keepAudioSessionActive: true,
        })
        statusSubscription = created.addListener('playbackStatusUpdate', handleStatus)
        watchdog = setInterval(runWatchdog, WATCHDOG_INTERVAL_MS)
        if (supportsBackgroundPlayback) {
            // Stays active while paused, so the lock screen can restart the stream.
            created.setActiveForLockScreen(true, LOCK_SCREEN_METADATA, { isLiveStream: true })
        }
        return created
    }

    const play = async () => {
        const pausedFor = pausedAt ? Date.now() - pausedAt : Infinity
        wantsToPlay = true
        resetSession()
        pausedAt = 0
        playAttemptAt = Date.now()
        update({ isPlaying: true, isLoading: true, isStalled: false })

        if (!player) {
            settingUp = true
            try {
                player = await createPlayer()
            } catch (error) {
                log('player setup failed', error)
                wantsToPlay = false
                resetSession()
                update(INITIAL_STATE)
                return
            } finally {
                settingUp = false
            }
            // Fresh player, already pointed at live. Re-check intent: setup awaited.
            if (!wantsToPlay) return
            markInternalPause()
            player.play()
            return
        }

        if (pausedFor > RESUME_REJOIN_THRESHOLD_MS) {
            loadLive()
        } else {
            markInternalPause()
            player.play()
        }
    }

    const pause = () => {
        wantsToPlay = false
        resetSession()
        pausedAt = Date.now()
        update({ isPlaying: false, isLoading: false, isStalled: false })
        if (player) {
            markInternalPause()
            player.pause()
        }
    }

    return {
        togglePlayPause: async () => {
            if (settingUp) return
            if (wantsToPlay) pause()
            else await play()
        },
        destroy: () => {
            if (watchdog) clearInterval(watchdog)
            watchdog = null
            wantsToPlay = false
            resetSession()
            statusSubscription?.remove()
            statusSubscription = null
            player?.remove()
            player = null
        },
    }
}

type AudioContextValue = StreamState & { togglePlayPause: () => Promise<void> }

const AudioContext = createContext<AudioContextValue>({
    ...INITIAL_STATE,
    togglePlayPause: async () => {},
})

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState(INITIAL_STATE)
    const [controller] = useState(() => createStreamController(setState))

    useEffect(() => () => controller.destroy(), [controller])

    //AudioContext.Provider makes the stream state and togglePlayPause available anywhere useAudio() is used in the app
    return (
        <AudioContext.Provider value={{ ...state, togglePlayPause: controller.togglePlayPause }}>
            {children}
        </AudioContext.Provider>
    )
}

//useAudio can be used to get the stream state and togglePlayPause
export const useAudio = () => useContext(AudioContext)
