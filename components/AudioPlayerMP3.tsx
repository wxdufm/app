import React, { useState, useRef, useEffect } from "react"
import {FaPlay, FaPause} from "react-icons/fa"
import {BsArrowLeftShort, BsArrowRightShort} from "react-icons/bs"

const AudioPlayerMP3 = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    

    const audioPlayer = useRef(); //reference to our audio component
    const progressBar = useRef(); //reference to our progress bar
    const animationRef = useRef(); //reference the animation


    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);
    

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs/60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }


    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`);
        setCurrentTime(progressBar.current.value);
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value) - 30;
        changeRange();
    }

    const forwardThirty = () => {
        progressBar.current.value = Number(progressBar.current.value) + 30;
        changeRange();
    }

    return(
        <div className="audioPlayer flex w-full items-center">
        <div className="flex gap-3">
            <audio ref={audioPlayer} src="https://docs.google.com/uc?export=open&id=17EQ-dNvMB59g1Vx7kHF_B_-tiJtzDxSB"></audio>
            <button className="forwardBackward" onClick={backThirty}><BsArrowLeftShort/> 30</button>
            <button className="bg-pink-700 text-gray-200 rounded-lg p-3" onClick={togglePlayPause}>{isPlaying ? <FaPause/> : <FaPlay className="relative pl-0.5"/>}</button>
            <button className="forwardBackward" onClick={forwardThirty}>30 <BsArrowRightShort /></button>
        </div>

        {/* current time */}
        <div className="currentTime ml-3">{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div>
            <input type="range" className="progressBar" defaultValue="0" ref={progressBar} onChange={changeRange}/>
        </div>

        {/* duration */}
        {isNaN(duration) && <div>hi</div>}
        <div className="duration">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
    </div>
    )
}

export default AudioPlayerMP3;
