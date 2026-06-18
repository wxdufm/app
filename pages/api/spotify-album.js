// A Next.js endpoint that holds Spotify credentials and returns album URL

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SEARCH_URL = 'https://api.spotify.com/v1/search'

let cachedToken = null

async function getToken() {
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.token
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) throw new Error('Spotify credentials not configured')

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
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

export default async function handler(req, res) {
    const { artist, song } = req.query

    if (!artist || !song) {
        return res.status(400).json({ error: 'artist and song are required' })
    }

    try {
        const token = await getToken()
        const q = encodeURIComponent(`track:${song} artist:${artist}`)
        const spotifyRes = await fetch(`${SEARCH_URL}?q=${q}&type=track&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!spotifyRes.ok) throw new Error('Spotify search failed')

        const data = await spotifyRes.json()
        const url = data.tracks?.items?.[0]?.album?.external_urls?.spotify ?? null

        return res.status(200).json({ url })
    } catch (e) {
        return res.status(500).json({ url: null, error: e.message })
    }
}
