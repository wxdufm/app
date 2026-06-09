// This component displays the song that is currently playing.

import { useState, useEffect } from 'react';
import Image from "next/image"
import StreamButton from "../audioplayers/StreamButton"

export default function NowPlaying({ nowPlaying = {} }) {

    const [cover, setCover] = useState("");

    // looking for the cover of the currently playing song.
    useEffect(()=> {
        fetch(`/api/charts/cover?artist=${encodeURIComponent(nowPlaying.artist)}&album=${encodeURIComponent(nowPlaying.album)}`)
        .then(r=> r.ok ? r.json() : Promise.reject())
        .then(data=> data.coverUrl 
            ? setCover(data.coverUrl) 
            : setCover('/CD_1_Filler.jpg')) // default cover if none was found through the api
        .catch(() => {});
    }, [nowPlaying])

    return(
        <div className="w-full max-w-[320px] mx-auto">
            <Image
                src={cover}
                alt="Album Art"
                width={150}
                height={150}
                className="w-full h-auto object-cover rounded-sm"
            />
            <p className="mt-4 text-xl text-white">Song: {nowPlaying.title}</p>
            <p>Artist: {nowPlaying.artist}</p>
            <p className="text-lg text-gray-300 mt-1">Album: {nowPlaying.album}</p>

            <div className="flex justify-center">
                <div className="w-full max-w-sm">
                    <StreamButton />
                </div>
            </div>
        </div>
        
    )
}

