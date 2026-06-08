import db from '../../lib/db/plmanager';

export default async function handler(req, res) {
    console.log("[most-played API] fetching playlist from database...");

    const {range, chart} = req.query;
    let rangeNum = parseInt(range || '1'); // convert to int. set it as 1 by default if no range was provided

    const allowed_range = [1, 7, 30, 365];
    rangeNum = allowed_range.includes(rangeNum) 
                ? rangeNum 
                : allowed_range.reduce((prev, curr) => {
                    return (Math.abs(curr - rangeNum) < Math.abs(prev - rangeNum) ? curr : prev);
                });
    
    try{

        // change custom day
        const custom_day = "2026-03-29"

        const [rows] = await db.query(`
            SELECT song, artist, album, COUNT(*) AS num_played 
            FROM playlist
            JOIN shows ON playlist.showID = shows.id
            WHERE 
                songstart >= DATE_SUB(DATE(?), INTERVAL ? DAY)
                AND artist != '*****'
                AND userID != 346
            GROUP BY song, artist, album
            ORDER BY num_played DESC
            LIMIT 12;
        `, [custom_day,rangeNum]);

        if (!rows.length){
            return res.status(404).json({ error: "Error: No songs found. Try again" });
        }

        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");


        res.status(200).json(rows)
    } catch(error){
        console.log("[most-played API] threw error: ", error);
        res.status(500).json({error: error.message})
    }


}
