import React, { useEffect, useState, useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAudio } from '../AudioContext'
import Link from 'next/link'


const NavPlayer = () => {
    const { isPlaying, togglePlayPause } = useAudio()

    // init stuff for ping pong animation
    const tickerContainerRef = useRef(null)
    const tickerTextRef = useRef(null)
    const [tickerDistance, setTickerDistance] = useState(0)

    // create state for now-playing API data
    const [nowPlaying, setNowPlaying] = useState({
        artist: null,
        title: null,
        album: null,
        dj: null
    })

    // function to fetch now-playing data
    async function fetchNowPlaying() {
        try {
            const response = await fetch('../../api/now-playing')

            const data = await response.json()

            setNowPlaying({
                artist: data.artist,
                title: data.title,
                album: data.album,
                dj: data.dj
            })

        } catch (error) {
            console.error('Failed to fetch now-playing data:', error)
        }
    }

    // calls API on component mount and every 30 seconds thereafter
    useEffect(() => {

        // initial fetch
        fetchNowPlaying()

        // poll API again every 30 secs
        const interval = setInterval(fetchNowPlaying, 30000)

        // clean-up on component unmount
        return () => clearInterval(interval)

    }, [])

    // takes API result and turns it into text
    const currentTrack =
        nowPlaying.artist && nowPlaying.title && nowPlaying.album
            ? `${nowPlaying.artist} — ${nowPlaying.title} ... ${nowPlaying.album}`
            : `it's a secret... tune in to find out`
    
    // measures length of text + container for ping pong --> grabs difference
    useEffect(() => {
        function measureTicker() {
            const containerWidth = tickerContainerRef.current?.getBoundingClientRect().width || 0
            const textWidth = tickerTextRef.current?.getBoundingClientRect().width || 0

            setTickerDistance(Math.ceil(Math.max(textWidth - containerWidth, 0)))
        }

        measureTicker()
        window.addEventListener('resize', measureTicker)

        return () => window.removeEventListener('resize', measureTicker)
    }, [currentTrack, nowPlaying.dj])

    // only scroll if the difference is >0 i.e. text is longer than container width
    const shouldScrollTicker = tickerDistance > 0

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
                <div className="hidden lg:flex shrink-0 items-center">
                    <img 
                        src={isPlaying ? "/soundwaves.gif" : "/staticsoundwave.gif"}
                        alt="soundwaves"
                        style={{ height: '75px', width: '175px', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* RIGHT SECTION: scrolling ticker
                overflow-hidden clips the text so it scrolls inside the bar */}
            <div ref={tickerContainerRef} className="overflow-hidden flex-1">
                <Link href="/listen" legacyBehavior>
                    <a
                        className="block w-full h-full group cursor-pointer hover:bg-white/5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                        aria-label="Open listen page"
                        title="Open listen page"
                        onClick={(e) => { e.currentTarget.blur(); }}
                    >
                        <div className="overflow-hidden flex-1">
                            <div
                                // animate-ticker-pingpong is defined in globals.css if you want to tweak
                                className={`whitespace-nowrap inline-block ${
                                    shouldScrollTicker ? 'animate-ticker-pingpong' : ''
                                }`}
                                style={{
                                    '--ticker-distance': `${tickerDistance}px`,
                                }}
                            >
                                <span ref={tickerTextRef} className="font-semibold text-[#e0ff05] text-base tracking-widest px-8 group-hover:underline group-hover:text-white group-focus:underline group-focus:text-white">
                                    Currently Playing: {currentTrack} &nbsp;&nbsp;&nbsp;&nbsp; DJ ON AIR: {nowPlaying.dj}
                                </span>
                            </div>
                        </div>

                        {/*
                        <div className="overflow-hidden flex-1">
                                // animate-conveyor = custom animation defined in globals.css
                                // whitespace-nowrap keeps the text on one line so it scrolls horizontally
                            <div className="animate-ticker-pingpong whitespace-nowrap">
                                <span className="bitcount text-[#e0ff05] text-base tracking-widest px-8 group-hover:underline group-hover:text-white group-focus:underline group-focus:text-white">
                                // Replace with Adrenalin data
                                    Currently Playing: {currentTrack} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DJ ON AIR: {nowPlaying.dj} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                                // </Link>Text is repeated so there's no gap when it loops
                                <span className="bitcount text-[#e0ff05] text-base tracking-widest px-8 group-hover:underline group-hover:text-white group-focus:underline group-focus:text-white">
                                    Currently Playing: {currentTrack} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DJ ON AIR: {nowPlaying.dj} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                            </div>
                        </div>
                        */}
                    </a>
                </Link>
            </div>


        </div>
    )
}

export default NavPlayer