// URL for the library-metadata-lookup Python service (Discogs)
// uses localhost:8000 locally, or whatever LML_URL is set to in production
const LML_URL = process.env.LML_URL || 'http://localhost:8000';

// URL for the WXDU hosted API (replaces direct MySQL connection)
// reads from .env.local locally, or Cloudflare Pages env vars in production
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.wxdu.art';

// given an artist and song name, searches Discogs and returns an album cover URL
async function getAlbumArt(artist, song) {
  try {
    // step 1: search Discogs for releases that contain this track
    // encodeURIComponent converts spaces/special chars to URL-safe format
    // e.g. "200 Years" becomes "200%20Years"
    const trackRes = await fetch(
      `${LML_URL}/api/v1/discogs/track-releases?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(song)}`
    );
    const trackData = await trackRes.json();

    // if no releases found on Discogs, return null (no art)
    if (!trackData.releases?.length) return null;

    // take the first matching release's ID
    const releaseId = trackData.releases[0].release_id;

    // step 2: fetch full release details using that ID, which includes artwork_url
    const releaseRes = await fetch(`${LML_URL}/api/v1/discogs/release/${releaseId}`);
    const releaseData = await releaseRes.json();

    return releaseData.artwork_url || null;
  } catch (e) {
    // if anything fails, return null so the widget still works without art
    return null;
  }
}

export default async function handler(req, res) {
  console.log("[now-playing API] fetching playlist from remote API...");

  try {
    // *** FETCHES FROM api.wxdu.art ***
    // instead of querying MySQL directly, calls the hosted REST API
    // which runs on the WXDU Linux server and talks to MySQL internally
    const response = await fetch(`${API_URL}/api/playlists/current`);

    // if the API returns an error (e.g. station is off air), return 404
    if (!response.ok) {
      return res.status(404).json({ error: "No current playlist found" });
    }

    // parse the JSON response — contains { show, dj, tracks }
    const data = await response.json();

    // filter out DJ marker rows (artist = '*****') and take the 5 most recent
    const tracks = data.tracks
      .filter(t => t.artist !== '*****')
      .slice(0, 5);

    if (!tracks.length) {
      return res.status(404).json({ error: "No current playlist found" });
    }

    // for each of the 5 songs, fetch album art from Discogs in parallel
    // Promise.all runs all 5 requests at the same time instead of one by one
    const songsWithArt = await Promise.all(
      tracks.map(async (track) => ({
        song: track.song,        // song title
        artist: track.artist,    // artist name
        album: track.album,      // album name
        label: track.label,      // record label
        songstart: track.songstart, // time the song was played
        albumArt: await getAlbumArt(track.artist, track.song) // Discogs artwork URL
      }))
    );

    // tell browsers/CDN to cache this response for 30 seconds
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    return res.status(200).json(songsWithArt);

  } catch (error) {
    console.error("[now-playing API] threw error: ", error);
    return res.status(500).json({ error: error.message });
  }
}