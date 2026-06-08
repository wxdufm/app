// Is this api really useful?
// too much songs is returned for a single day

import db from '../../lib/db/plmanager';

export default async function handler(req, res) {
    console.log("[last-playing API] fetching last played song from database...");

    const {range} = req.query;
    const rangeNum = Math.min(Math.max(parseInt(range || '1'), 1), 31); // convert to int and ensure range is between 1 and 31
    
    const maxDay = new Date(Date.now() - rangeNum * 24 * 60 * 60 * 1000).toISOString(); // calculate the date 'range' days ago
    
    const custom_day = "202" // custom day for testing purposes since the database is not up to date.


    try {
        // query in MySQL that gets the all the songs played within a certain range of days, ordered by most recent first
        const [rows] = await db.query(`
            SELECT song, artist, album, title, djname
            FROM playlist
            JOIN shows ON playlist.showID = shows.ID
            WHERE songstart > DATE(?) AND artist != '*****'
            ORDER BY songstart DESC
        `, [custom_day]); // change custom day to maxDay when testing is done

        if (!rows.length) {
            return res.status(404).json({
                error: "Error: No songs found. Try again"
        });
        }

        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

        return res.status(200).json(rows);

    } catch(error) {
        console.log("[last-playing API] threw error: ", error);
        return res.status(500).json({
            error: error.message
        });
    }
}