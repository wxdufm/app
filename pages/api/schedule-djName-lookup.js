import { lookupDjNamesFromIDs } from 'lib/schedule/djName-lookup'

// receives body-only array of IDs

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end()
    try {
        const idGrid = req.body;
        const djNameGrid = await lookupDjNamesFromIDs(idGrid)
        res.status(200).json(djNameGrid);
    } catch (err) {
        res.status(500).json({ error: "DJ Name lookup failed"})
    }
}