import React from 'react'
import {FaPlay, FaPause} from 'react-icons/fa'
import soundwaves from '../../images/soundwaves.gif'
import nosoundwaves from '../../images/staticsoundwave.gif'
import Image from 'next/image'
import { useAudio } from '../AudioContext'

const AudioPlayerStream = () => {
    const { isPlaying, togglePlayPause } = useAudio()

    return (
        <div className="flex h-16 max-w-sm items-center justify-center">
            <div className="flex flex-row items-center">
                <button
                    className="rounded-lg bg-transparent p-2 text-gray-200"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? (
                        <FaPause size={24} />
                    ) : (
                        <FaPlay size={24} className="relative pl-0.5" />
                    )}
                </button>
                <span className="kallistobold text-white text-sm tracking-widest uppercase ml-2">
                    Stream Here
                </span>
                <div className="w-36 md:w-60 lg:w-48">
                    {isPlaying ? (
                        <div className="pt-0.5">
                            <Image src={soundwaves} alt="soundwaves" />
                        </div>
                    ) : (
                        <div className="pt-1">
                            <Image src={nosoundwaves} alt="static soundwave" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AudioPlayerStream
