import mysql from 'mysql2/promise'

// DB pool connection using credentials from .env.local
// "pool" handles the connections synchronously, no await needed
// createPool is called once when module loads, not per-request.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

export default async function handler(req,res) {
    // rejects anything that isn't a POST
    if(req.method !== 'POST'){
        return res.status(405).json({error: 'Method not allowed'})
    }

    const { type, songTitle, songArtist, songName, messageName, messageText } = req.body

    // formats fields for the request table
    const userName = type === 'song' ? songName : messageName
    const text = type === 'song'
        ? `Song Request: ${songTitle} by ${songArtist}`
        : `Message: ${messageText}`
    const createdAt = Math.floor(Date.now() / 1000).toString()

    try {
        // inserts into request table: fills old Twitter columns with defaults
        await pool.execute(
            `INSERT INTO request (tweet_id, in_reply_to_status_id, text, created_at, user_profile_image_url, user_screen_name, user_name, user_id, email)
            VALUES (0, 0, ?, ?, '', '', ?, 0, '')`,
            [text, createdAt, userName]
        )

        return res.status(200).json({ success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'Failed to send request'})
    }
}
