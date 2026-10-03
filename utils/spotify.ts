const API_URL = 'https://api.wxdu.art'

// Resolve an album link through the station API, falling back to a Spotify search.
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
