// This component displays the current show and dj playing.

import { useState, useEffect } from 'react';

export default function NowPlayingHeader({ currentPlaylist = {} }) {

    const show = currentPlaylist.show || {};

    const djname = show.djname || "";
    const title = show.title || "";

    return(
        <>
            <p className="text-base text-center text-gray-300 tracking-wide">
                Current Show
            </p>
            <h1 className="text-5xl text-center font-light leading-tight"> 
                DJ: {djname}
            </h1>
            <h4 className="text-2xl text-center text-gray-300 mt-1">
                    Show: {title}
            </h4>
        </>

    )
}
