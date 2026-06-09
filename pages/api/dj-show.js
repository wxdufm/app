// This API returns a show name when given a dj name

import db from '../../lib/db/plmanager';

export default async function handler(req, res){
    const {dj} = req.query;
    if (!dj){
        res.status(400).json({error: "Must provide dj"})
    }

    console.log("[dj-show API] find dj show name...");

    try{
        const [rows] = await db.query(`
            SELECT title 
            FROM shows
            WHERE djname = ?
            LIMIT 1;
        `, [dj]);

        if (!rows.length){
            return res.status(404).json({ error: "DJ show not found" });
        }

        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

        res.status(200).json(rows[0].title)
    }catch(error){
        console.log("[dj-show API] threw error: ", error);
        res.status(500).json({error: error.message})
    }
}