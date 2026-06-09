// This is the component for each song that is shown on the ExploreTab.

import Image from "next/image"

export default function ExploreSong({ rank = "", info = {} }) {
    const cover = info.cover || "/images/placeholder.png";
    return (
        <div className="w-full max-w-[180px] bg-black text-white p-3 rounded border border-gray-700 flex flex-col items-center transform transition-transform duration-300 hover:scale-125 hover:shadow-2xl hover:-translate-y-1 hover:z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
            <div className="text-2xl font-medium mb-2 select-none">{rank}</div>
            <div className="w-36 h-36 mb-3 overflow-hidden rounded">
                <Image
                    src={info.cover}
                    alt={info.album || info.song || "cover"}
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="text-center text-sm leading-tight">
                <div className="font-semibold truncate max-w-[180px]">{info.song || "Unknown title"}</div>
                <div className="text-gray-300 truncate max-w-[180px]">{info.artist || "Unknown artist"}</div>
                <div className="text-gray-400 truncate max-w-[180px]">{info.album || "Unknown album"}</div>
            </div>
        </div>
    );
}