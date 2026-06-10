// This component contains the tabs to switch between viewing now playing and last played songs.

import {useState} from "react";
import NowPlaying from "./NowPlaying";
import LastPlayed from "./LastPlayed";

export default function PlayTabs({ nowPlaying = {}, currentPlaylist = {}}) {
    const [activeTab, setActiveTab] = useState("nowplaying");

    // To render the correct tab based on the activeTab state (i.e which tab the user has clicked on)
    function renderTab() {
        if (activeTab === "nowplaying") {
            return <NowPlaying nowPlaying={nowPlaying} />
        } else if (activeTab === "lastplayed") {
            return <LastPlayed currentPlaylist={currentPlaylist}/>
        }
    } 

    return(
        <div className="w-full max-w-[360px] mx-auto">
            <div role="tablist" className="flex justify-center">
                <button role="tab" onClick={() => setActiveTab("nowplaying")} aria-selected={activeTab === 'nowplaying'} className={activeTab === "nowplaying" ? "text-white border-b-2 border-blue-400 px-4 py-2 text-lg" : "text-gray-300 hover:text-white transition-colors duration-150 px-4 py-2 text-lg"}>
                    Now Playing
                </button>
                <button role="tab" onClick={() => setActiveTab("lastplayed")} aria-selected={activeTab === 'lastplayed'} className={activeTab === "lastplayed" ? "text-white border-b-2 border-blue-400 px-4 py-2 text-lg" : "text-gray-300 hover:text-white transition-colors duration-150 px-4 py-2 text-lg"}>
                    Last Played
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                {renderTab()}
            </div>
        </div>
    )
}