// This component displays the current show and dj playing.

import { useState, useEffect } from 'react';

export default function NowPlayingHeader({ nowPlaying }) {

    const [show, setShow] = useState("");

    // fetching the show name of the current playing dj
    useEffect(() => {
        fetch(`/api/dj-show?dj=${encodeURIComponent(nowPlaying.dj)}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => data ? setShow(data) : setShow(null))
    })

    // rending the Show part only if a show has been returned through the api
    function renderShow(){
        if (show){
            return(
                 <h4 className="text-2xl text-center text-gray-300 mt-1">
                    Show: {show}
                </h4>
            )
        }

        return null
    }

    return(
        <>
            <p className="text-base text-center text-gray-300 tracking-wide">
                Current Show
            </p>
            <h1 className="text-5xl text-center font-light leading-tight"> 
                DJ: {nowPlaying.dj}
            </h1>
            {renderShow()}
        </>

    )
}
