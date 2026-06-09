// This component displays each of the row for current playlist

import SongAlbumCover from "./songAlbumCover"

export default function SongRow({song, artist, album, songStart}) {
      function formatTime(iso) {
            return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

    return (
        <div className="flex items-center gap-4 border-b border-zinc-800 py-3">
            <SongAlbumCover artist={artist} album={album}/>
            <div className = "w-16 flex-shrink-0 text-center text-sm text-zinc-400">
                Played at {formatTime(songStart)}
            </div>
            <div className="min-w-0 flex-1">
                <div className="font-courierprime text-white">{song}</div>
                <div className="font-courierprime text-sm text-zinc-300 italic">{artist}</div>
                <div className="font-courierprime text-xs text-zinc-500">{album}</div>
            </div>
        </div>
    )
}
