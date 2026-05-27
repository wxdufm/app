import React, { createContext, useContext, useRef, useState } from 'react'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    const togglePlayPause = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
            <audio
                ref={audioRef}
                src="https://stream.wxdu.art/wxdu192.mp3"
            />
            {children}
        </AudioContext.Provider>
    )
}

export const useAudio = () => useContext(AudioContext)