import {useState} from 'react'

/*
Receives parsed CSV data from lib/scheduleParser.js and renders a weekly grid.
headerRow includes value of corner cell A1, but is removed from hourColumn

[0] headerRow = fullArray[0],
[1] hourColumn = fullArray.map(row => row[0]).slice(1),
[2] specialtyShowIndices = [],
[3] djNameOnlyArray = [] (starts out as fullNameOnlyArray but gets overwritten)
[4] idGrid (same dimensions as [3] but with MySQL ids)
*/

export default function WeeklySchedule({schedule}) {

	// because I'm lazy and I don't want to rewrite the array logic below, I'm going to simply reconstruct the carrier into full array with header
	const reconstructedSchedule = [
		schedule[0],
		...schedule[3].map((row, i) => [schedule[1][i], ...row])
	];

	const [selectedDj, setSelectedDj] = useState(null)

	if (!Array.isArray(reconstructedSchedule) || reconstructedSchedule.length === 0) {
		return null
	}

	const headerRow = reconstructedSchedule[0]
	const hourRows = reconstructedSchedule.slice(1)
	const days = headerRow

	return (
		<div className="overflow-x-auto text-sm kallisto text-[#e0ff05]">
			<table className="w-full table-auto border-collapse border border-gray-300">

                {/* table header row, including cell A1 ("show start time" or something) */}
				<thead> 
					<tr>
						{days.map((day) => (
							<th
								key={day}
								className="border border-gray-300 px-4 py-2 bg-red"
							>
								{day}
							</th>
						))}
					</tr>
				</thead>

                {/* table body!! */}
				<tbody>

					{hourRows.map((hourRow, rowIndex) => {
						const hour = hourRow[0]
						const djCells = hourRow.slice(1)

						return (
							<tr key={`${hour}-${rowIndex}`}>

                                {/* first column is the hour */}
								<th className="border border-gray-300 px-4 py-2 bg-pink text-left">
									{hour}
								</th>

                                {/* loop for remaining columns, including multi-hour show logic */}
								{djCells.map((djName, dayIndex) => {
									if (!djName) {
										return (
											<td
												key={`${hour}-${dayIndex}`}
												className="border border-gray-300 bg-black px-4 py-2"
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
											className={`border border-gray-300 px-4 py-2 text-center bg-black align-middle ${
												selectedDj === djName ? 'bg-yellow-200 text-black' : ''
											}`}
										>
                                            {/* placeholder onClick which is just a button. will eventually redirect to DJ pages */}
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
