// This component displays the song that is currently playing.

import Image from "next/image"
import StreamButton from "../audioplayers/StreamButton"

export default function NowPlaying() {
    return(
        <div className="w-full max-w-[320px] mx-auto">
            <Image
                src="/CD_1_Filler.jpg"
                alt="Album Art"
                width={150}
                height={150}
                className="w-full h-auto object-cover rounded-sm"
            />
            <p className="mt-4 text-xl text-white">[Name of the Song]</p>
            <p>[Name of the Artist]</p>
            <p className="text-lg text-gray-300 mt-1">[Name of the Album]</p>

            <div className="flex justify-center">
                <div className="w-full max-w-sm">
                    <StreamButton />
                </div>
            </div>
        </div>
        
    )
}
