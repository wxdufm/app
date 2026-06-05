import db from '../../../lib/db/plmanager'

export default async function handler(req, res){
	try {
		const [rows] = await db.query(`
			SELECT artist, album, MIN(label) as label, COUNT(*) as spins
			FROM playlist
			WHERE playlist IN ('red', 'black', 'red/nonrock', 'black/nonrock')
			AND songstart >= DATE_SUB((SELECT MAX(songstart) FROM playlist), INTERVAL 7 DAY)
			AND artist != '*****'
			AND album IS NOT NULL AND album != ''
			GROUP BY artist, album
			ORDER BY spins DESC
			LIMIT 10
		`);

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
		console.error('[charts API]', error);
		return { props: {chart: [] } };
	}
}