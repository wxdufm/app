import { apiFetch } from "@/utils/api"

// Resolve an album link through the station API, falling back to a Spotify search.
export async function getSpotifyAlbumUrl(artist: string, song: string): Promise<string> {
    const fallback = `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${song}`)}`
    try {
        const data = await apiFetch<{ url?: string }>(
            `/api/spotify-album?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`
        )

        return data?.url ?? fallback
    } catch {
        return fallback
    }
}
