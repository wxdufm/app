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
    const recentRes = await fetch(`${API_URL}/api/playlists/recent?limit=5`);

    // if the API returns an error (e.g. station is off air), return 404
    if (!recentRes.ok) {
      return res.status(404).json({ error: "No current playlist found" });
    }

    // parse the JSON response — contains { show, dj, tracks }
    const recentShows = await recentRes.json();

    // filter out future shows
    const now = Math.floor(Date.now() / 1000); // current time in Unix seconds
    const pastShows = recentShows.filter(show => show.starttime <= now);

    // step 2: collect songs across shows until we have 5 / finds shows that have real tracks
    let tracks = [];
    for (const show of pastShows) {
    const showRes = await fetch(`${API_URL}/api/playlists/${show.ID}`);
    const showData = await showRes.json();
    const filtered = showData.tracks
        .filter(t => t.artist !== '*****')
        .sort((a, b) => new Date(b.songstart) - new Date(a.songstart));
    
    tracks = [...tracks, ...filtered];
    
    if (tracks.length >= 5) break; // stop once we have enough
    }

    // take only the 5 most recent across all shows
    tracks = tracks.slice(0, 5);

    // find the first show that has real tracks
    //let tracks = [];
    //for (const show of recentShows) {
      //const showRes = await fetch(`${API_URL}/api/playlists/${show.ID}`);
      //const showData = await showRes.json();
      //const filtered = showData.tracks.filter(t => t.artist !== '*****');
      //if (filtered.length) {
        // sort by most recent and take 5
        //tracks = filtered
          //.sort((a, b) => new Date(b.songstart) - new Date(a.songstart))
          //.slice(0, 5);
        //break;
      //}
    //}

    if (!tracks.length) {
      return res.status(404).json({ error: "No current playlist found" });
    }

    // fetch album art for all 5 songs in parallel
    const songsWithArt = await Promise.all(
      tracks.map(async (track) => ({
        song: track.song,
        artist: track.artist,
        album: track.album,
        label: track.label,
        songstart: track.songstart,
        albumArt: await getAlbumArt(track.artist, track.song)
      }))
    );

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(songsWithArt);

  } catch (error) {
    console.error("[now-playing API] threw error: ", error);
    return res.status(500).json({ error: error.message });
  }
}

   

    