// This component contains the tabs to switch between viewing now playing and last played songs.

import {useState, useMemo} from "react";
import NowPlaying from "./NowPlaying";
import LastPlayed from "./LastPlayed";

export default function PlayTabs({ nowPlaying = {}, currentPlaylist = {}}) {
    const [activeTab, setActiveTab] = useState("nowplaying");

    const tabs = useMemo(
        () => [
            { id: "nowplaying", label: "Now Playing", panelId: "tabpanel-nowplaying" },
            { id: "lastplayed", label: "Last Played", panelId: "tabpanel-lastplayed" },
        ],
        []
    );

    const handleTabKeyDown = (event) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex;

        if (event.key === "ArrowRight") {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = tabs.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        setActiveTab(tabs[nextIndex].id);
        document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
    };

    return(
        <div className="w-full max-w-[360px] mx-auto">
            <div role="tablist" aria-label="Now playing and last played tabs" className="flex justify-center">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={tab.panelId}
                        tabIndex={activeTab === tab.id ? 0 : -1}
                        onClick={() => setActiveTab(tab.id)}
                        onKeyDown={handleTabKeyDown}
                        className={
                            activeTab === tab.id
                                ? "text-white border-b-2 border-blue-400 px-4 py-2 text-lg"
                                : "text-gray-300 hover:text-white transition-colors duration-150 px-4 py-2 text-lg"
                        }
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                <div
                    id="tabpanel-nowplaying"
                    role="tabpanel"
                    aria-labelledby="tab-nowplaying"
                    hidden={activeTab !== "nowplaying"}
                    className={activeTab === "nowplaying" ? "block" : "hidden"}
                >
                    <NowPlaying currentPlaylist={currentPlaylist} />
                </div>
                <div
                    id="tabpanel-lastplayed"
                    role="tabpanel"
                    aria-labelledby="tab-lastplayed"
                    hidden={activeTab !== "lastplayed"}
                    className={activeTab === "lastplayed" ? "block" : "hidden"}
                >
                    <LastPlayed currentPlaylist={currentPlaylist} />
                </div>
            </div>
        </div>
    )
}