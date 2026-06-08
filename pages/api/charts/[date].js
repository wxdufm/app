import db from "../../../lib/db/plmanager";

//returns top 10 most spun new-add albums in the 7 days ending on the date
//called as /api/charts/2026-03-29   :the date comes from the url



export default async function handler(req, res) {

    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date is required '})

    try {
        //? in the query is a placeholder
        //[date, date] passes the date value twice, once for start of range and once for end
        const [rows] = await db.query(`
            SELECT artist, album, MIN(label) as label, COUNT(*) as spins
            FROM playlist
            WHERE playlist IN ('red', 'black', 'red/nonrock', 'black/nonrock')
            AND songstart BETWEEN DATE_SUB(?, INTERVAL 7 DAY) AND ?
            AND artist != '*****'
            AND album IS NOT NULL AND album != ''
            GROUP BY artist, album
            ORDER BY spins DESC
            LIMIT 10
        `, [date, date]);

        //add rank numbers (1-10) to each row
        const chart = rows.map((row, index) => ({
            rank: index + 1,
            spins: row.spins,
            artist: row.artist,
            album: row.album,
            label: row.label || '',
        }));

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        return res.status (200).json(chart);

    } catch (error) {
        console.error('[charts/date API]', error);
        return res.status(500).json({ error: error.message });
    }
}