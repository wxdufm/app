import { useState } from 'react'

// Receives parsed CSV data from lib/schedule.js and renders today's schedule.
export default function TodaySchedule({ schedule }) {
	const [selectedShow, setSelectedShow] = useState(null)

	if (!Array.isArray(schedule) || schedule.length === 0) {
		return null
	}

	const headerRow = schedule[0]
	const hourRows = schedule.slice(1)

    // creates new JS Date object, and formats it as the weekday name but in lowercase to match the schedule.csv file
	const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
	// loops through the header array, finds index of today
    const todayIndex = headerRow.findIndex(h => h === today)

	if (todayIndex === -1) {
		return null
	}

	// Collapse consecutive rows with the same show into one block; makes new array for today
	const shows = []
	hourRows.forEach((row) => {
		const hour = row[0]
		const show = row[todayIndex] || null
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