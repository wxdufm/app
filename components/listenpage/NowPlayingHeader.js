// This component displays the current show and dj playing.

import { useState, useEffect } from 'react';

export default function NowPlayingHeader({ currentPlaylist = {} }) {

    let show = currentPlaylist.show || {};

    return(
        <>
            <p className="text-base text-center text-gray-300 tracking-wide">
                Current Show
            </p>
            <h1 className="text-5xl text-center font-light leading-tight"> 
                DJ: {show.djname}
            </h1>
            <h4 className="text-2xl text-center text-gray-300 mt-1">
                    Show: {show.title}
            </h4>
        </>

    )
}
