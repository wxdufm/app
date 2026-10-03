import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'
import { isRunningInExpoGo } from 'expo'
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio'

const STREAM_URL = 'https://stream.wxdu.art/wxdu192.mp3'
// Expo Go does not provide the app's configured native background playback support.
const supportsBackgroundPlayback = !isRunningInExpoGo()

const AudioContext = createContext<{
    isPlaying: boolean
    isLoading: boolean
    togglePlayPause: () => Promise<void>
}>({ isPlaying: false, isLoading: false, togglePlayPause: async () => {} })

/**
 * Owns the shared live radio player and exposes playback state and controls
 * to child components, keeping audio available when listeners switch tabs.
 */
export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const playerRef = useRef<AudioPlayer | null>(null)
    // ref guard: synchronous, so a second tap can't start another player during setup
    const lockRef = useRef(false)

    const togglePlayPause = useCallback(async () => {
        if (lockRef.current) return  // already in progress, ignore
        lockRef.current = true

        try {
            if (!playerRef.current) {
                setIsLoading(true)
                await setAudioModeAsync({
                    playsInSilentMode: true,
                    shouldPlayInBackground: supportsBackgroundPlayback,
                    interruptionMode: 'doNotMix',
                    allowsRecording: false,
                    shouldRouteThroughEarpiece: false,
                })
                const player = createAudioPlayer(STREAM_URL)
                if (supportsBackgroundPlayback) {
                    player.setActiveForLockScreen(true, {
                        title: 'WXDU 88.7 FM',
                        artist: 'Live Radio',
                    })
                }
                player.play()
                playerRef.current = player
                setIsPlaying(true)
            } else {
                // live streams can't be paused and resumed — unload completely so the
                // next press reconnects to the live feed from the current position
                if (supportsBackgroundPlayback) {
                    playerRef.current.setActiveForLockScreen(false)
                }
                playerRef.current.pause()
                playerRef.current.remove()
                playerRef.current = null
                setIsPlaying(false)
            }
        } finally {
            setIsLoading(false)
            lockRef.current = false
        }
    }, [])

    // Dispose of the native player when the provider unmounts.
    useEffect(() => () => {
        playerRef.current?.remove()
        playerRef.current = null
    }, [])

    // All stream buttons read the same playback and connection state through useAudio().
    return (
        <AudioContext.Provider value={{ isPlaying, isLoading, togglePlayPause }}>
            {children}
        </AudioContext.Provider>
    )
}

// Access the player owned by the root layout's AudioProvider.
export const useAudio = () => useContext(AudioContext)
