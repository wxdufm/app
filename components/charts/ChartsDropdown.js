export default function ChartsDropdown({ weeks, selectedDate, onSelect }) {
    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});
    }
    return (
        <div className="mb-6">
            <label className="font-courierprime mb-2 block text-sm text-zinc-400">
                Select a week:
            </label>
            <select
                value={selectedDate}
                onChange={e => onSelect(e.target.value)}
                className="font-courierprime w-full max-w-sm rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
                {weeks.map(week => (
                    <option key={week.date} value={week.date}>
                        Week ending {formatDate(week.date)}
                    </option>
                ))}
            </select>
        </div>
    );
}