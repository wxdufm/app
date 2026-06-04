import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import clientPromise from '../../lib/db/mongodb';
import ChartsDropdown from '../../components/charts/ChartsDropdown';
import ChartEntryRow from '../../components/charts/ChartEntryRow';

export default function ChartsPage({ weeks }) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;
        setSelectedDate(router.query.week || weeks[0]?.date);
    }, [router.isReady]);

    useEffect(() => {
        if (!selectedDate) return;
        setLoading(true);
        fetch(`/api/charts/${selectedDate}`)
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                setChartData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [selectedDate]);

    function handleSelect(date) {
        setSelectedDate(date);
        router.push(`/charts?week=${date}`, undefined, { shallow: true });
    }

    return (
        <div className="min-h-screen text-white px-4 py-8 max-w-3xl mx-auto">
            <h1 className="font-courierprime text-3xl font-bold mb-6">WXDU TOP 88.7</h1>
            {weeks.length > 0 ? (
                <ChartsDropdown
                    weeks={weeks}
                    selectedDate={selectedDate || weeks[0]?.date}
                    onSelect={handleSelect}
                />
            ) : (
                <p className="text-zinc-400">No charts available.</p>
            )}
            {loading && (
                <p className="text-zinc-400 mt-4">Loading...</p>
            )}
            {!loading && chartData && (
                <>
                    <h2 className="font-courierprime text-xl mb-4 text-zinc-300">
                        {chartData.title}
                    </h2>
                    <div>
                        {chartData.entries.map(entry => (
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
                </>
            )}
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db('wxdu');
        const weeks = await db.collection('charts')
            .find({}, { projection: { date: 1, title: 1, _id: 0 } })
            .sort({ date: -1 })
            .toArray();
        return { props: { weeks: JSON.parse(JSON.stringify(weeks)) } };
    } catch (error) {
        console.error('[charts page]', error);
        return { props: { weeks: [] } };
    }
}
