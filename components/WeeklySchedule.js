import {useState} from "react"

/*
Receives parsed CSV data from lib/scheduleParser.js and renders a weekly grid.
headerRow includes value of corner cell A1, but is removed from hourColumn

fullArray is what scheduleParser.js returns (25x8)

[0] headerRow = fullArray[0]   (1 row, 8 columns)
[1] hourColumn = fullArray.map(row => row[0]).slice(1)   (rotates hour column into 1 row, 24 columns)
[2] specialtyShowIndices = []   (marks indexes of all specialty shows [WIP])
[3] djNameOnlyArray = [] (starts out as fullNameOnlyArray but gets overwritten)     (24 rows, 7 columns)
[4] idGrid     (same dimensions as [3] but with MySQL ids)
*/

// adding functionality to collapse 2+ otto-only rows to save space
const ottoAlias = "Lunokhod 3"
function isOttofulRow(hourRow) {
	const djCells = hourRow.slice(1)

	return (
		djCells.some((cell) => cell === ottoAlias) &&
		djCells.every((cell) => !cell || cell === ottoAlias)
	)
}

// checks if there's 2+ consecutive rows where for all days of the week, it's just otto
// alias = Lunohkod 3
function whichRowsCollapse(hourRows) {
	const rows = []
	let i = 0

	while (i < hourRows.length) {
		if (!isOttofulRow(hourRows[i])) {
			rows.push({ type: "normal", row: hourRows[i], originalRowIndex: i })
			i += 1
			continue
		}

		let j = i + 1
		while (j < hourRows.length && isOttofulRow(hourRows[j])) {
			j += 1
		}

		const block = hourRows.slice(i, j)

		if (block.length >= 2) {
			rows.push({
				type: "ottoCollapse",
				startHour: block[0][0],
				endHour: block[block.length - 1][0],
				cells: block[0].slice(1).map((_, dayIndex) =>
					block.some((row) => row[dayIndex + 1] === ottoAlias) ? ottoAlias : ""
				),
			})
		} else {
			rows.push({ type: "normal", row: hourRows[i] })
		}

		i = j
	}

	return rows
}

export default function WeeklySchedule({schedule}) {

	// because I"m lazy and I don"t want to rewrite the array logic below (which accounts for headers),
	// I"m going to simply reconstruct the carrier into full array with header and feed it in
	const reconstructedSchedule = [
		schedule[0],
		...schedule[3].map((row, i) => [schedule[1][i], ...row])
	];

	// for temp button functionality
	const [selectedDj, setSelectedDj] = useState(null)

	// make sure we aren"t passing in non-arrays or nothing
	if (!Array.isArray(reconstructedSchedule) || reconstructedSchedule.length === 0) {
		return null
	}

	// init arrays
	const headerRow = reconstructedSchedule[0]
	const hourRows = reconstructedSchedule.slice(1)
	const days = headerRow
	const collapseAwareHourRows = whichRowsCollapse(hourRows)
	const specialtyShowIndices = schedule[2] || []

	// checks for specialty shows, so we can format them differently
	function isSpecialtyShow(rowIndex, dayIndex) {
		return specialtyShowIndices.some(
			([specialtyRowIndex, specialtyDayIndex]) =>
				specialtyRowIndex === rowIndex && specialtyDayIndex === dayIndex
		)
	}

	return (
		<div className="overflow-x-auto text-sm text-[#e0ff05]">
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

					{collapseAwareHourRows.map((collapseAwareHourRow, rowIndex) => {
						if (collapseAwareHourRow.type === "ottoCollapse") {
							return (
								<tr key={`lunokhod-${collapseAwareHourRow.startHour}-${rowIndex}`}>
									<th className="border border-gray-300 px-4 py-2 bg-pink text-left">
										{
											collapseAwareHourRow.startHour.replace(/–.*$/, "")
										}–{
											collapseAwareHourRow.endHour.replace(/^.*–/, "")
										}
									</th>

									{collapseAwareHourRow.cells.map((djName, dayIndex) => (
										<td
											key={`lunokhod-${dayIndex}`}
											className={`border border-gray-300 bg-black px-4 py-2 text-center align-middle ${
												selectedDj === djName ? "bg-yellow-200 text-black" : ""
											}`}
										>
											{djName && (
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
											)}
										</td>
									))}
								</tr>
							)
						}
					
						// these are normal, non-collapsing rows
						const hourRow = collapseAwareHourRow.row
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

									// checks if current cell is specialty show
									const specialtyShow = isSpecialtyShow(collapseAwareHourRow.originalRowIndex, dayIndex)

									// Skip repeated cells so rowSpan can cover multi-hour shows.
									const previousRow = collapseAwareHourRows[rowIndex - 1]
									const previousDj =
										previousRow?.type === "normal"
											? previousRow.row[dayIndex + 1]
											: null

									if (previousDj === djName) {
										return null
									}


									let rowSpan = 1
									while (
										collapseAwareHourRows[rowIndex + rowSpan]?.type === "normal" &&
										collapseAwareHourRows[rowIndex + rowSpan].row[dayIndex + 1] === djName
									) {
										rowSpan += 1
									}

									return (
										<td
											key={`${hour}-${dayIndex}`}
											rowSpan={rowSpan}
											className={`border border-gray-300 px-4 py-2 text-center bg-black align-middle ${
												specialtyShow ? 'bg-[#e0ff05] text-black italic' : 'bg-black' // HIGHLIGHT SPECIALTY SHOWS!!!
											} ${
												selectedDj === djName ? "bg-yellow-200 text-black" : ""
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
