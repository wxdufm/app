// This component contains the explore tab for finding new music.

import ExploreSong from './ExploreSong';
import { useState, useEffect } from 'react';
import getAlbumCover from "../../pages/api/albumCover";

// function to get the album cover for each song.
async function getCovers(album, artist){
    const res = await fetch(`/api/albumCover?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`);
    if (!res.ok) {
        throw new Error(`Cover search failed: ${res.status}`);
    }

    const cover = await res.json();
    return cover.coverUrl;
}

export default function ExploreTab() {
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState([]);
    const [range, setRange] = useState(7);

    // function to find the most played songs
    async function fetchSongs(range) {
        setLoading(true);

        try {
            // fetching the api
            const res = await fetch(`/api/charts?range=${encodeURIComponent(range)}`);
            if (!res.ok) throw new Error(`Charts fetch failed: ${res.status}`);
            const raw = await res.json();
            const items = Array.isArray(raw) ? raw : []; // storing the result as an array

            setSongs(items); // updating the songs variable.
        } catch (err) {
            console.error('fetchSongs error', err);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    }

    // fetching songs each time the user changes the range
    useEffect(() => {
        const ac = new AbortController();
        // call fetchSongs and pass the controller's signal so the fetch can be aborted
        fetchSongs(range);
        return () => ac.abort(); // cancels in-flight requests on unmount or when `range` changes
    }, [range]);
    
    return (
        <div className="w-full">
            <h4 className="text-2xl font-light text-white text-center mb-4">Explore New Music</h4>
            <div className="flex items-center justify-center gap-3 mb-4">
                <label htmlFor="rangeSelect" className="text-white sr-only">Range</label>
                <select
                    id="rangeSelect"
                    value={range}
                    onChange={(e) => setRange(Number(e.target.value))}
                    className="bg-black text-white border border-gray-600 rounded px-2 py-1"
                    aria-label="Select range in days"
                >
                    <option value={1}>Last 1 day</option>
                    <option value={7} selected>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={365}>Last year</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
                {songs.map((item, i) => (
                    <ExploreSong key={i} rank={item.rank} info={item} />
                ))}
            </div>
        </div>
    );
}