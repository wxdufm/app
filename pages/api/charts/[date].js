import clientPromise from "../../../lib/db/mongodb";

export default async function handler(req, res) {
    const { date } = req.query;
    try {
        const client = await clientPromise;
        const db = client.db('wxdu');
        const chart = await db.collection('charts').findOne({ date });
        if (!chart) {
            return res.status(404).json({ error: 'Chart not found' });
        }
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        return res.status(200).json(chart);
    } catch (error) {
        console.error('[charts/date API]', error);
        return res.status(500).json({ error: error.message });
    }
}


