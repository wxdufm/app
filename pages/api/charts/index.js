import clientPromise from '../../../lib/db/mongodb'

export default async function handler(req, res){
	try {
		const client = await clientPromise
		const db = client.db('wxdu');
		const charts = await db.collection('charts')
			.find({}, { projection: { date: 1, title: 1, _id: 0 } })
			.sort({ date: -1 })
			.toArray();
			return res.status(200).json(charts);
	} catch (error) {
		console.error('[charts API]', error);
		return res.status(500).json({ error: error.message });
	}
}