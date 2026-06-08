// This component contains the explore tab for finding new music.
import ExploreSong from './ExploreSong';

export default function ExploreTab() {
    const info = {
        cover: "/CD_1_Filler.jpg",
        song: "A song",
        artist: "An artist",
        album: "An album"
    };
    const songs = new Array(12).fill(0);
    return (
        <div className="w-full">
            <h4 className="text-2xl font-light text-white text-center mb-4">Explore New Music</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
                {songs.map((_, i) => (
                    <ExploreSong key={i} rank={i + 1} info={info} />
                ))}
            </div>
        </div>
    );
}