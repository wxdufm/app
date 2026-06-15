// This is the listen page.

import { useState, useEffect } from 'react';
import useCurrentPlaylist from '@/hooks/useCurrentPlaylist'
import NowPlayingHeader from "@/components/listenpage/NowPlayingHeader";
import StreamButton from "@/components/audioplayers/StreamButton";
import PlayTabs from "@/components/listenpage/PlayTabs";
import ExploreTab from "@/components/listenpage/ExploreTab";

export default function Listen() {

    const { currentPlaylist, loading } = useCurrentPlaylist();

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

