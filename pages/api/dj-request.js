export default async function handler(req,res) {
    if(req.method !== 'POST'){
        return res.status(405).json({error: 'Method not allowed'})
    }

    const { type, songTitle, songArtist, songName, messageName, messageText } = req.body

    try {
        console.log('DJ request received:', req.body)

        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({error: 'Failed to send request'})
    }
}
