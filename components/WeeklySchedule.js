import {useState} from 'react'

// Receives parsed CSV data from lib/schedule.js and renders a weekly grid.
export default function WeeklySchedule({schedule}) {
	const [selectedDj, setSelectedDj] = useState(null)

	if (!Array.isArray(schedule) || schedule.length === 0) {
		return null
	}

	const headerRow = schedule[0]
	const hourRows = schedule.slice(1)
	const days = headerRow.slice(1)

	return (
		<div className="overflow-x-auto text-sm kallisto text-[#e0ff05]">
			<table className="w-full table-auto border-collapse border border-gray-300">
				<thead>
					<tr>
						<th className="border border-gray-300 px-4 py-2 bg-black">
							hour of day
						</th>
						{days.map((day) => (
							<th
								key={day}
								className="border border-gray-300 px-4 py-2 bg-black"
							>
								{day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{hourRows.map((hourRow, rowIndex) => {
						const hour = hourRow[0]
						const djCells = hourRow.slice(1)

						return (
							<tr key={`${hour}-${rowIndex}`}>
								<th className="border border-gray-300 px-4 py-2 bg-black text-left">
									{hour}
								</th>
								{djCells.map((djName, dayIndex) => {
									if (!djName) {
										return (
											<td
												key={`${hour}-${dayIndex}`}
												className="border border-gray-300 px-4 py-2"
											/>
										)
									}

									// Skip repeated cells so rowSpan can cover multi-hour shows.
									const previousRow = hourRows[rowIndex - 1]
									const previousDj = previousRow?.[dayIndex + 1]
									if (previousDj === djName) {
										return null
									}

									let rowSpan = 1
									while (hourRows[rowIndex + rowSpan]?.[dayIndex + 1] === djName) {
										rowSpan += 1
									}

									return (
										<td
											key={`${hour}-${dayIndex}`}
											rowSpan={rowSpan}
											className={`border border-gray-300 px-4 py-2 text-center align-middle ${
												selectedDj === djName ? 'bg-yellow-200 text-black' : ''
											}`}
										>
											<button
												type="button"
												onClick={() =>
													setSelectedDj((currentDj) =>
														currentDj === djName ? null : djName
													)
												}
												className="underline hover:no-underline"
											>
												{djName}
											</button>
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
