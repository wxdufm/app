// This component displayed the last played songs of the entire day.

import StreamButton from "../audioplayers/StreamButton";
import SongRow from "./songRow"

export default function LastPlayed({ currentPlaylist = {}}) {


    // getting current playlist track and reversing it so that the latest song shows first
    const tracks = Array.isArray(currentPlaylist.tracks) ? [...currentPlaylist.tracks].reverse() : [];
    return(
        <div className="w-full max-w-[360px] mx-auto">
            <div className="flex justify-center">
                <div className="w-full max-w-sm">
                    {tracks.map((item, i) => (
                        <SongRow key={i} song={item.song} artist={item.artist} album={item.album} songStart={item.songstart} />
                    ))}
                </div>
            </div>
        </div>
    )
}
