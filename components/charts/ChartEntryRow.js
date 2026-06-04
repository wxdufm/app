import AlbumCover from "./AlbumCover";

export default function ChartEntryRow({ rank, spins, artist, album, label }) {
    return (
        <div className="flex items-center gap-4 border-b border-zinc-800 py-3">
            <AlbumCover artist={artist} album={album} rank={rank} />
            <div className="w-8 flex-shrink-0 text-right font-bold text-white">
                {rank}
            </div>
            <div className = "w-16 flex-shrink-0 text-center text-sm text-zinc-400">
                {spins} spins
            </div>
            <div className="min-w-0 flex-1">
                <div className="font-courierprime text-white">{artist}</div>
                <div className="font-courierprime text-sm text-zinc-300 italic">{album}</div>
                <div className="font-courierprime text-xs text-zinc-500">{label}</div>
            </div>
        </div>
    )
}