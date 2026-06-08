import { useState, useEffect } from 'react';

export default function AlbumCover({ artist, album, rank }) {
    const [coverUrl, setCoverUrl] = useState(null);
    const fillerNum = (parseInt(rank) % 3) + 1;
    const fillerSrc = `/CD_${fillerNum}_Filler.jpg`
    useEffect(() => {
        if(!artist || !album) return;
        fetch(`/api/charts/cover?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            if (data.coverUrl) setCoverUrl(data.coverUrl);
        })
        .catch(() => {});
    }, [artist, album]);
    return (
        <img
            src={coverUrl || fillerSrc}
            alt={`${artist} - ${album}`}
            className="h-16 w-16 flex-shrink-0 object-cover rounded"
        />
    );
}