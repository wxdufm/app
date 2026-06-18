const API_URL = 'https://api.wxdu.art'

export async function getSpotifyAlbumUrl(artist: string, song: string): Promise<string> {
    const fallback = `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${song}`)}`
    try {
        const res = await fetch(
            `${API_URL}/api/spotify-album?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`
        )
        if (!res.ok) return fallback
        const data = await res.json()
        return data.url ?? fallback
    } catch {
        return fallback
    }
}
