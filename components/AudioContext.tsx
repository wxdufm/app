import React, { createContext, useContext, useRef, useState, useCallback } from 'react'
import { Audio } from 'expo-av'

const AudioContext = createContext<{
    isPlaying: boolean
    isLoading: boolean
    togglePlayPause: () => Promise<void>
}>({ isPlaying: false, isLoading: false, togglePlayPause: async () => {} })

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const soundRef = useRef<Audio.Sound | null>(null)
    // ref guard: synchronous, so a second tap can't slip through while createAsync is awaiting
    const lockRef = useRef(false)

    const togglePlayPause = useCallback(async () => {
        if (lockRef.current) return  // already in progress, ignore
        lockRef.current = true

        try {
            if (!soundRef.current) {
                setIsLoading(true)
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true })
                const { sound } = await Audio.Sound.createAsync(
                    { uri: 'https://stream.wxdu.art/wxdu192.mp3' },
                    { shouldPlay: true }
                )
                soundRef.current = sound
                setIsPlaying(true)
            } else {
                // live streams can't be paused and resumed — unload completely so the
                // next press reconnects to the live feed from the current position
                await soundRef.current.unloadAsync()
                soundRef.current = null
                setIsPlaying(false)
            }
        } finally {
            setIsLoading(false)
            lockRef.current = false
        }
    }, [])

    //AudioContext.Provider makes isPlaying and togglePlayPause available anywhere useAudio() is used in the app
    return (
        <AudioContext.Provider value={{ isPlaying, isLoading, togglePlayPause }}>
            {children}
        </AudioContext.Provider>
    )
}

//useAudio can be used to get isPlaying and togglePlayPause
export const useAudio = () => useContext(AudioContext)