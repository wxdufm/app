// This component displayed the last played songs of the entire day.

import StreamButton from "../audioplayers/StreamButton";

export default function LastPlayed() {
    return(
        <div className="w-full max-w-[360px] mx-auto">
            <p>This is Last Played</p>
            <div className="flex justify-center">
                <div className="w-full max-w-sm">
                    <StreamButton /> // button to play the song
                </div>
            </div>
        </div>
    )
}
