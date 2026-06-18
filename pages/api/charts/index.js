import db from '../../../lib/db/plmanager'
import getAlbumCover from "../albumCover"

export default async function handler(req, res){
	console.log("[most-played API] fetching playlist from database...");

	const {range, isChart} = req.query;
	// normalize isChart from query (query params are strings)
	const isChartFlag = (typeof isChart === 'string')
		? (isChart.toLowerCase() === 'true' || isChart === '1')
		: Boolean(isChart);

	if (isChartFlag || !range){

		try{
			const chart = await findChart();

			res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
			return res.status (200).json(chart);
		}catch (error) {
			console.error('[charts API]', error);
			return res.status(500).json({chart: []});
		}
	}
	else{
		let rangeNum = parseInt(range || '1');
		const allowed_range = [1, 7, 30, 365];
    	rangeNum = allowed_range.includes(rangeNum) 
                ? rangeNum 
                : allowed_range.reduce((prev, curr) => {
                    return (Math.abs(curr - rangeNum) < Math.abs(prev - rangeNum) ? curr : prev);
                });

		try{
			const results = await findRange(range, rangeNum);
			res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
			return res.status (200).json(results);
		}catch(error){
			console.log("[most-played API] threw error: ", error);
			res.status(500).json({error: error.message})
		}
	}
}

async function findChart(){
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

	const chart = await Promise.all(
	rows.map(async (row, index) => ({
		rank: index + 1,
		spins: row.spins,
		artist: row.artist,
		album: row.album,
		label: row.label || '',
		cover:
		(await getAlbumCover(
			row.artist,
			'', // no song available here
			row.album
		)) || '/CD_1_Filler.jpg',
	}))
	);
	
	return chart;
}

async function findRange(range, rangeNum){
	// change custom day
	const custom_day = "2026-03-29"

	const [rows] = await db.query(`
		SELECT song, artist, album, COUNT(*) AS spins 
		FROM playlist
		JOIN shows ON playlist.showID = shows.id
		WHERE 
			songstart >= DATE_SUB(DATE(?), INTERVAL ? DAY)
			AND artist != '*****'
			AND userID != 346
		GROUP BY song, artist, album
		ORDER BY spins DESC
		LIMIT 12;
	`, [custom_day, rangeNum]);

	if (!rows.length){
		return null;
	}

	const songs = await Promise.all(
	rows.map(async (row, index) => ({
		...row,
		rank: index + 1,
		cover:
		(await getAlbumCover(row.artist, row.song, row.album)) ||
		"/CD_1_Filler.jpg",
	}))
	);

	return songs;
}