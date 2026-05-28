import React from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAudio } from '../AudioContext'


const NavPlayer = () => {
    const { isPlaying, togglePlayPause } = useAudio()

    return (
        // The outer bar: fixed underneath main bar, full width, black background, yellow border on bottom 
        <div className="fixed top-0 left-0 z-50 w-full bg-black border-b-2 border-[#e0ff05] flex flex-row items-center h-16 overflow-hidden">
            
            {/* LEFT SECTION: play/pause button + Stream Here + soundwave gif
                This stays still while the ticker scrolls next to it */}
            <div className="flex flex-row items-center gap-2 px-4 shrink-0 border-r border-[#e0ff05]">
                {/* Play/pause button — calls togglePlayPause from AudioContext */}
                <button onClick={togglePlayPause} className="text-[#e0ff05] hover:text-yellow-200">
                    {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                </button>

                {/* "Stream Here" text in kallisto font */}
                <span className="bitcount text-[#e0ff05] text-base tracking-widest uppercase">
                    Stream Here
                </span>

                {/* Soundwave gif —> animated when playing, still when paused; height can be adjusted, currently ~24 because h-10 in the parent div */}
                <div className="shrink-0 flex items-center">
                    <img 
                        src={isPlaying ? "/soundwaves.gif" : "/staticsoundwave.gif"}
                        alt="soundwaves"
                        style={{ height: '75px', width: '175px', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* RIGHT SECTION: scrolling ticker
                overflow-hidden clips the text so it scrolls inside the bar */}
            <div className="overflow-hidden flex-1">
                {/* animate-conveyor = custom animation defined in globals.css
                    whitespace-nowrap keeps the text on one line so it scrolls horizontally */}
                <div className="animate-conveyor whitespace-nowrap">
                    <span className="bitcount text-[#e0ff05] text-base tracking-widest uppercase px-8">
                    {/* Replace with Adrenalin data */}
                        Currently Playing: tune in to find out &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DJ ON AIR: _ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    {/* Text is repeated so there's no gap when it loops */}
                    <span className="bitcount text-[#e0ff05] text-base tracking-widest uppercase px-8">
                        Currently Playing: tune in to find out &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DJ ON AIR: _ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                </div>
            </div>

        </div>
    )
}

export default NavPlayer