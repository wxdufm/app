// This is the listen page.

import { useState, useEffect } from 'react';
import NowPlayingHeader from "../../components/listenpage/NowPlayingHeader";
import StreamButton from "../../components/audioplayers/StreamButton";
import PlayTabs from "../../components/listenpage/PlayTabs";
import ExploreTab from "../../components/listenpage/ExploreTab";

export default function Listen() {

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

    return(
        <div className="min-h-screen text-white pb-2">
            <NowPlayingHeader nowPlaying={nowPlaying} />

            <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
                <div className="md:h-[calc(100vh-160px)] md:overflow-auto h-auto flex justify-center">
                    <div className="w-full max-w-[360px]">
                        <PlayTabs nowPlaying={nowPlaying} />
                    </div>
                </div>

                <div className="md:h-[calc(100vh-160px)] md:overflow-auto h-auto border-l border-gray-700 pl-8 flex justify-center">
                    <ExploreTab />
                </div>
            </div>
        </div>
    )
}

