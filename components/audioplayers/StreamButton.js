import React from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAudio } from '../AudioContext'

const StreamButton = () => {
    const { isPlaying, togglePlayPause } = useAudio()

    return (
        <button
            onClick={togglePlayPause}
            className="flex flex-row items-center gap-4 bg-red-700 hover:bg-red-600 transition-colors px-8 py-4 w-full"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/20">
                {isPlaying ? <FaPause size={18} className="text-white" /> : <FaPlay size={18} className="text-white pl-0.5" />}
            </div>
            <span className="kallistobold text-white text-xl tracking-widest">
                {isPlaying ? 'pause' : 'stream here'}
            </span>
        </button>
    )
}

export default StreamButton