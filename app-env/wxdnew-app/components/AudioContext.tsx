import React, { createContext, useContext, useRef, useState, useCallback, Children } from 'react'
import { Audio } from 'expo-av'

const AudioContext = createContext<{
    isPlaying: boolean
    togglePlayPause: () => Promise<void>  //function to start/stop the stream
}>({ isPlaying: false, togglePlayPause: async () =>{} })

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const soundRef = useRef<Audio.Sound | null>(null)
    const togglePlayPause = useCallback(async () => {
        if (!soundRef.current) { //first press no sound object? create one
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true }) //iOS play audio even if on silent mode
            
            //load stream url and return sound object. then start playing immediately
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://stream.wxdu.art/wxdu192.mp3' },
                { shouldPlay: true }
            )

            //stores sound object to play/pause on future presses
            soundRef.current = sound
            setIsPlaying(true)

        } else if (isPlaying) {
            await soundRef.current.pauseAsync()
            setIsPlaying(false)
        } else {
            //stream is paused. resume.
            await soundRef.current.playAsync()
            setIsPlaying(true)
        }
    }, [isPlaying])

    //AudioContext.Provider makes isPlaying and togglePlayPause available anywhere useAudio() is used in the app
    return (
        <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
            {children}
        </AudioContext.Provider>
    )
}

//useAudio can be used to get isPlaying and togglePlayPause
export const useAudio = () => useContext(AudioContext)