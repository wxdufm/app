import db from '../../lib/db/plmanager';
import ChartEntryRow from '../../components/charts/ChartEntryRow';


export default function ChartsPage({ chart }) {
    return (
        <div className="min-h-screen text-white px-4 py-8 max-w-3xl mx-auto">
            <h1 className="font-courierprime text-3xl font-bold mb-6">WXDU TOP 10</h1>
            <p className="font-courierprime text-sm text-zinc-400 mb-6">
                Most spun new adds: Past 7 days
            </p>
            {chart.length === 0 ? (
                <p className="text-zinc-400"> No chart data available</p>
            ) : (
                <div>
                    {chart.map(entry => (
                        <ChartEntryRow
                            key={entry.rank}
                            rank={entry.rank}
                            spins={entry.spins}
                            artist={entry.artist}
                            album={entry.album}
                            label={entry.label}
                            />
                        ))}
                    </div>
            )}
        </div>
    );
}

export async function getServerSideProps() {
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

        return { props: { chart } };
        
    } catch (error) {
        console.error('[charts API]', error);
        return { props: {chart: [] } };
    }
}

