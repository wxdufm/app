// This component displays the song that is currently playing.

import { useState, useEffect } from 'react';
import Image from "next/image"
import StreamButton from "../audioplayers/StreamButton"

export default function NowPlaying({ currentPlaylist = {} }) {

    const reverseTrack = Array.isArray(currentPlaylist.tracks) ? [...currentPlaylist.tracks].reverse() : []
    const track = reverseTrack?.[0] || {};
    const [cover, setCover] = useState("");

    // checking if track returns something. And default value in case it doesn't    
    const song = track.song || "";
    const artist = track.artist || "";
    const album = track.album || "";

    // looking for the cover of the currently playing song.
    useEffect(()=> {
        if (!artist && !album) return;

        fetch(`/api/charts/cover?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
        .then(r=> r.ok ? r.json() : Promise.reject())
        .then(data=> data.coverUrl 
            ? setCover(data.coverUrl) 
            : setCover('/CD_1_Filler.jpg')) // default cover if none was found through the api
        .catch(() => {});
    }, [track])

    return(
        <div className="w-full max-w-[320px] mx-auto">
            <Image
                src={cover}
                alt="Album Art"
                width={150}
                height={150}
                className="w-full h-auto object-cover rounded-sm"
            />
            <p className="mt-4 text-xl text-white">Song: {song}</p>
            <p>Artist: {artist}</p>
            <p className="text-lg text-gray-300 mt-1">Album: {album}</p>

            <div className="flex justify-center">
                <div className="w-full max-w-sm">
                    <StreamButton />
                </div>
            </div>
        </div>
        
    )
}

