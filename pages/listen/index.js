// This is the listen page.

import { useState, useEffect } from 'react';
import NowPlayingHeader from "../../components/listenpage/NowPlayingHeader";
import StreamButton from "../../components/audioplayers/StreamButton";
import PlayTabs from "../../components/listenpage/PlayTabs";
import ExploreTab from "../../components/listenpage/ExploreTab";

export default function Listen() {

    const [currentPlaylist, setCurrentPlaylist] = useState({});

    // function to fetch current playlist
    async function fetchCurrentPlaylist(){
        try {
            const response = await fetch('https://api.wxdu.art/api/playlists/current')

            const data = await response.json()

            setCurrentPlaylist(data)

        } catch (error) {
            console.error('Failed to fetch current-playlist data:', error)
        }
    }

    // calls API on component mount and every 30 seconds thereafter
    useEffect(() => {

        // initial fetch
        fetchCurrentPlaylist();

        // poll API again every 30 secs
        const interval = setInterval(() => {
            fetchCurrentPlaylist();
        }, 3000)

        // clean-up on component unmount
        return () => clearInterval(interval)

    }, [])

    return(
        <div className="min-h-screen text-white pb-2">
            <NowPlayingHeader currentPlaylist={currentPlaylist} />

            <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
                <div className="md:h-[calc(100vh-160px)] md:overflow-auto h-auto flex justify-center">
                    <div className="w-full max-w-[360px]">
                        <PlayTabs currentPlaylist={currentPlaylist}/>
                    </div>
                </div>

                <div className="md:h-[calc(100vh-160px)] md:overflow-auto h-auto border-l border-gray-700 pl-8 flex justify-center">
                    <ExploreTab />
                </div>
            </div>
        </div>
    )
}

