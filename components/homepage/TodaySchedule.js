import { useState, useEffect } from 'react'

// Receives parsed CSV data from lib/schedule.js and renders today's schedule.
export default function TodaySchedule({ schedule }) {
	const [selectedShow, setSelectedShow] = useState(null)
	const [today, setToday] = useState('')

	useEffect(() => {
		setToday(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())
	}, [])

	// scheduleCarrier structure:
	// [0] headerRow: ['hour', 'monday', 'tuesday', ...]
	// [1] hourColumn: ['12am', '1am', ...]
	// [3] showGrid: 2D array (hours × days), hour column already stripped

	const headerRow = Array.isArray(schedule?.[0]) ? schedule[0] : []
	const hourColumn = Array.isArray(schedule?.[1]) ? schedule[1] : []
	const showGrid = Array.isArray(schedule?.[3]) ? schedule[3] : []

	if (!headerRow.length || !hourColumn.length || !showGrid.length || !today) {
		return null
	}

	// headerRow[0] is 'hour', days start at index 1; showGrid columns are 0-based (no hour col)
	const todayIndex = headerRow.findIndex(h => h?.toLowerCase() === today)

	if (todayIndex === -1) {
		return null
	}

	const showColIndex = todayIndex - 1

	// Collapse consecutive rows with the same show into one block
	const shows = []
	hourColumn.forEach((hour, i) => {
		const show = showGrid[i]?.[showColIndex] || null
		const last = shows[shows.length - 1]

		if (show && last && last.show === show) {
			last.endHour = hour
		} else {
			shows.push({ hour, endHour: null, show })
		}
	})

	return (
    <div className="text-lg kallisto text-[#e0ff05] w-full">
		<h1 className="bitcount mb-2 text-center lg:text-left text-2xl lg:text-5xl text-white">Today's Schedule</h1>
        {shows.map(({ hour, endHour, show }, i) => (
            show ? (
                <div key={`${hour}-${i}`} className="flex gap-4 py-3 border-b border-gray-300">
                    <span className="w-24 text-right">
                        {endHour ? `${hour} – ${endHour}` : hour}
                    </span>
                    <span className="border-l border-gray-300 pl-4 flex-1">
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedShow((cur) => cur === show ? null : show)
                            }
                            className={`text-left underline hover:no-underline ${
                                selectedShow === show ? 'bg-yellow-200 text-black' : ''
                            }`}
                        >
                            {show}
                        </button>
                    </span>
                </div>
            ) : null
        ))}
    </div>
	)
}