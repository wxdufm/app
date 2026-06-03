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

	// Collapse consecutive rows with the same show into one block
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
		<div className="overflow-x-auto text-sm kallisto text-[#e0ff05]">
			<table className="w-full table-auto border-collapse border border-gray-300">
				<thead>
					<tr>
						<th className="border border-gray-300 px-4 py-2 bg-black">hour</th>
						<th className="border border-gray-300 px-4 py-2 bg-black">show</th>
					</tr>
				</thead>
				<tbody>
					{shows.map(({ hour, endHour, show }, i) => (
						<tr key={`${hour}-${i}`}>
							<th className="border border-gray-300 px-4 py-2 bg-black text-left whitespace-nowrap">
								{endHour ? `${hour} – ${endHour}` : hour}
							</th>
							<td className={`border border-gray-300 px-4 py-2 text-center align-middle ${
								show && selectedShow === show ? 'bg-yellow-200 text-black' : ''
							}`}>
								{show ? (
									<button
										type="button"
										onClick={() =>
											setSelectedShow((cur) => cur === show ? null : show)
										}
										className="underline hover:no-underline"
									>
										{show}
									</button>
								) : null}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}