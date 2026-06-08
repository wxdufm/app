import db from '../../lib/db/plmanager';
import ChartEntryRow from '../../components/charts/ChartEntryRow';
import { useState, useEffect } from 'react';


export default function ChartsPage({ initialChart, latestDate }) {
    const [chart, setChart] = useState(initialChart);
    const [selectedDate, setSelectedDate] = useState(latestDate);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDate === latestDate) return;
        setLoading(true);
        fetch(`/api/charts/${selectedDate}`)
            .then(r => r.json())
            .then(data => { setChart(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [selectedDate]);

    return (
        <div className="min-h-screen text-white px-4 py-8 max-w-3xl mx-auto">
            <h1 className="font-courierprime text-3xl font-bold mb-6">WXDU TOP 10</h1>
            <div className="mb-6">
                <label className="font-courierprime text-sm text-zinc-400 block mb-2">
                    Week ending:
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="font-courierprime bg-zinc-900 border border-zinc-600 text-white rounded px-3 py-2"
                />
            </div>

            {loading ? (
                <p className="text-zinc-400">Loading...</p>
            ) : chart.length === 0 ? (
                <p className="text-zinc-400">No chart data available</p>
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
        const [[latestRow]] = await db.query(
            `SELECT DATE_FORMAT(MAX(songstart), '%Y-%m-%d')`
        );
        const latestDate = latestRow.latestDate

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

        const initialChart = rows.map((row, index) => ({
            rank: index + 1,
            spins: row.spins,
            artist: row.artist,
            album: row.album,
            label: row.label || '',
        }));

        return { props: { initialChart, latestDate } };
        
    } catch (error) {
        console.error('[charts page]', error);
        return { props: { initialChart: [], latestDate: '' } };
    }
}

