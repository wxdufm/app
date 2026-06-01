import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    console.log("[now-playing API] fetching playlist from database...");
    
    try {
        // connect directly to the database, createConnection will take credentials and open the connection in MySQL then store it
        const db = await mysql.createConnection({
        host: '127.0.0.1', // 'localhost' points back to your machine where Docker exposed the port
        port: 3306,
        user: 'wxdu_pl',      // Using root to bypass any backup-script user overrides for now
        password: 'm3rzb0w',  // Matches MYSQL_ROOT_PASSWORD in compose
        database: 'plmanager', // Matches MYSQL_DATABASE in compose
        });

        // query in MySQL that gets the 5 most recent songs from the current show
        const [rows] = await db.query(`
            SELECT song, album, artist, label, songstart 
            FROM playlist 
            WHERE showID = (SELECT showID FROM playlist ORDER BY songstart DESC LIMIT 1)
            AND artist != '*****'
            ORDER BY songstart DESC
            LIMIT 5
        `);

        await db.end();

        // if no songs found (!rows.length = empty array), return 404
        if (!rows.length) {
            return res.status(404).json({
                error: "No current playlist found"
            });
        }

        // cache like the old one did
        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");

        return res.status(200).json(rows);

    } catch (error) {
        console.error("[now-playing API] threw error: ", error);
        return res.status(500).json({
            error: error.message
        });
    }
}