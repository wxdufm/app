const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SEARCH_URL = 'https://api.spotify.com/v1/search'

let cachedToken: { token: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.token
    }

    const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) throw new Error('Spotify credentials not set')

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: 'grant_type=client_credentials',
    })

    if (!res.ok) throw new Error('Failed to get Spotify token')

    const data = await res.json()
    cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    }
    return cachedToken.token
}

export async function getSpotifyAlbumUrl(artist: string, song: string): Promise<string> {
    const fallback = `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${song}`)}`
    try {
        const token = await getToken()
        const q = encodeURIComponent(`track:${song} artist:${artist}`)
        const res = await fetch(`${SEARCH_URL}?q=${q}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return fallback
        const data = await res.json()
        return data.tracks?.items?.[0]?.album?.external_urls?.spotify ?? fallback
    } catch {
        return fallback
    }
}
