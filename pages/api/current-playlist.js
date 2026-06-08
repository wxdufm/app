import db from '../../lib/db/plmanager';
async function getAlbumArt(artist, song) {
  try {
    // step 1: find release ID from artist + song
    const trackRes = await fetch(
      `http://localhost:8000/api/v1/discogs/track-releases?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(song)}`
    );
    const trackData = await trackRes.json();
    
    if (!trackData.releases?.length) return null;
    
    // take the first release ID
    const releaseId = trackData.releases[0].release_id;
    
    // step 2: get artwork from release ID
    const releaseRes = await fetch(`http://localhost:8000/api/v1/discogs/release/${releaseId}`);
    const releaseData = await releaseRes.json();
    
    return releaseData.artwork_url || null;
  } catch (e) {
    return null;
  }
}


export default async function handler(req, res) {
    console.log("[now-playing API] fetching playlist from database...");
    
    try {
        // query in MySQL that gets the 5 most recent songs from the current show
        const [rows] = await db.query(`
            SELECT song, album, artist, label, songstart 
            FROM playlist 
            WHERE showID = (SELECT showID FROM playlist ORDER BY songstart DESC LIMIT 1)
            AND artist != '*****'
            ORDER BY songstart DESC
            LIMIT 5
        `);

        // if no songs found (!rows.length = empty array), return 404
        if (!rows.length) {
            return res.status(404).json({
                error: "No current playlist found"
            });
        }
        // fetch album art for all 5 songs in parallel
        const songsWithArt = await Promise.all(
            rows.map(async (row) => ({
                ...row,
                albumArt: await getAlbumArt(row.artist, row.song)
            }))
        );

        // cache like the old one did
        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
        return res.status(200).json(songsWithArt);


    } catch (error) {
        console.error("[now-playing API] threw error: ", error);
        return res.status(500).json({
            error: error.message
        });
    }
}