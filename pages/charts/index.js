import db from '../../lib/db/plmanager';
import ChartEntryRow from '../../components/charts/ChartEntryRow';
import { useState, useEffect } from 'react';

//initalChart and latestDate come from getServerSideProps below
export default function ChartsPage({ initialChart, latestDate }) {
    const [chart, setChart] = useState(initialChart);  //chart data currently shown
    const [selectedDate, setSelectedDate] = useState(latestDate); //date the user has picked
    const [loading, setLoading] = useState(false);

    //runs whenever selectedDate changes - fetches chart for the new date from the api
    useEffect(() => {
        if (selectedDate === latestDate) return; //skip fetch on first load, we already have the data
        setLoading(true);
        fetch(`/api/charts/${selectedDate}`)
            .then(r => r.json())
            .then(data => { setChart(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [selectedDate]);

    return (
        <div className="min-h-screen text-white px-4 py-8 max-w-3xl mx-auto">
            <h1 className="font-courierprime text-3xl font-bold mb-6">WXDU TOP 10</h1>
            <p className="font-courierprime text-sm text-zinc-400 mb-6">Most spun new-add albums: Past 7 days</p>


            {/* date picker: user selects the date and the API returns the prior 7 days */}
            <div className="mb-6">
                <label
                    htmlFor="week-ending"
                    className="font-courierprime text-sm text-zinc-400 block mb-2"
                >
                    Week ending:
                </label>

                <input
                    id="week-ending"
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

//runs on the server before the page loads - fetches the default chart (most recent week)
export async function getServerSideProps() {
    try {
        //gets most recent date in the db to be default
        const [[latestRow]] = await db.query(
            `SELECT DATE_FORMAT(MAX(songstart), '%Y-%m-%d') as latestDate FROM playlist`
        );
        const latestDate = latestRow.latestDate

        //fetch the top 10 for the 7 days ending on that date
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

        //add rank 1-10 to each row
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

