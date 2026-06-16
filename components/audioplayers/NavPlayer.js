import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaPause, FaPlay } from "react-icons/fa";
import { useAudio } from "../AudioContext";

const NavPlayer = () => {
    const { isPlaying, togglePlayPause } = useAudio();

    // refs for measuring available ticker width vs text width
    const tickerContainerRef = useRef(null);
    const tickerTextRef = useRef(null);

    // computed scroll distance for ping-pong ticker animation
    const [tickerDistance, setTickerDistance] = useState(0);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const [nowPlaying, setNowPlaying] = useState({
        artist: null,
        song: null,
        album: null,
        dj: "mystery dj"
    });

    // polls the local API wrapper route that proxies api.wxdu.art atm
    async function fetchNowPlaying() {
        try {
            const response = await fetch("/api/now-playing");
            const data = await response.json();

            setNowPlaying({
                artist: data.artist,
                song: data.song,
                album: data.album,
                dj: data.dj
            });
        } catch (error) {
            console.error("Failed to fetch now-playing data:", error);
        }
    }

    // do an immediate fetch and then refresh every 30 seconds
    useEffect(() => {
        fetchNowPlaying();

        const interval = setInterval(fetchNowPlaying, 30000);
        return () => clearInterval(interval);
    }, []);

    // only show track info when artist/song/album are all present
    const currentTrack =
        nowPlaying.artist && nowPlaying.song && nowPlaying.album
            ? `${nowPlaying.artist} — ${nowPlaying.song} ... ${nowPlaying.album}`
            : "it's a secret... tune in to find out";

    // measure text and container widths so animation distance is exact
    useEffect(() => {
        function measureTicker() {
            const containerWidth = tickerContainerRef.current?.getBoundingClientRect().width || 0;
            const textWidth = tickerTextRef.current?.getBoundingClientRect().width || 0;
            setTickerDistance(Math.ceil(Math.max(textWidth - containerWidth, 0)));
        }

        measureTicker();
        window.addEventListener("resize", measureTicker);
        return () => window.removeEventListener("resize", measureTicker);
    }, [currentTrack, nowPlaying.dj]);

    // check if reduced motion is on...and will disable the ticker if so
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event) => {
            setPrefersReducedMotion(event.matches);
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else if (mediaQuery.removeListener) {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    // only animate if text overflows horizontally and motion is not reduced
    const shouldScrollTicker = tickerDistance > 0 && !prefersReducedMotion;

    return (
        <div className="fixed top-0 left-0 z-50 flex h-16 w-full flex-row items-center overflow-hidden border-b-2 border-[#e0ff05] bg-black">
            <div className="flex shrink-0 flex-row items-center gap-2 border-r border-[#e0ff05] px-4">
                {/* Icon-only control needs an explicit name for screen readers. */}
                <button
                    onClick={togglePlayPause}
                    className="text-[#e0ff05] hover:text-yellow-200"
                    aria-label={isPlaying ? 'Pause stream' : 'Play stream'}
                    title={isPlaying ? 'Pause stream' : 'Play stream'}
                >
                    {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                </button>

                <span className="bitcount text-base uppercase tracking-widest text-[#e0ff05]">
                    Stream Here
                </span>

                <div className="hidden shrink-0 items-center lg:flex">
                    <img
                        src={isPlaying ? "/soundwaves.gif" : "/staticsoundwave.gif"}
                        alt="soundwaves"
                        style={{ height: "75px", width: "175px", objectFit: "cover" }}
                    />
                </div>
            </div>

            <div ref={tickerContainerRef} className="flex-1 overflow-hidden">
                <Link href="/listen" legacyBehavior>
                    <a
                        className="group block h-full w-full cursor-pointer rounded transition-colors duration-150 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        aria-label="Open listen page"
                        title="Open listen page"
                        onClick={(event) => {
                            event.currentTarget.blur();
                        }}
                    >
                        <div className="flex-1 overflow-hidden">
                            <div
                                className={`inline-block whitespace-nowrap ${
                                    shouldScrollTicker ? "animate-ticker-pingpong" : ""
                                }`}
                                style={{
                                    "--ticker-distance": `${tickerDistance}px`
                                }}
                            >
                                <span
                                    ref={tickerTextRef}
                                    className="px-8 text-base font-semibold tracking-widest text-[#e0ff05] group-hover:text-white group-hover:underline group-focus:text-white group-focus:underline"
                                >
                                    Currently Playing: {currentTrack} &nbsp;&nbsp;&nbsp;&nbsp; DJ ON AIR: {nowPlaying.dj}
                                </span>
                            </div>
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default NavPlayer;
