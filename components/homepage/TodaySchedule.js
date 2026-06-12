import { useState, useEffect } from "react"

// Receives parsed CSV data from lib/schedule.js and renders today's schedule.
export default function TodaySchedule({ schedule }) {
	const [selectedShow, setSelectedShow] = useState(null)
	const [today, setToday] = useState("")

	useEffect(() => {
		// keep weekday lookup local to browser locale output but compare in normalized lowercase
		setToday(new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase())
	}, [])

	// scheduleCarrier structure:
	// [0] headerRow: ["summer26", "monday", "tuesday", ...]
	// [1] hourColumn: ["midnight–1 am", "1 am–2 am", ...]
	// [3] showGrid: 2D array (24 hours × 7 days) w/o headers

	const headerRow = Array.isArray(schedule?.[0]) ? schedule[0] : []
	const hourColumn = Array.isArray(schedule?.[1]) ? schedule[1] : []
	const showGrid = Array.isArray(schedule?.[3]) ? schedule[3] : []

	if (!headerRow.length || !hourColumn.length || !showGrid.length || !today) {
		return null
	}

	// trims and lowercases headers so matching is resilient to csv formatting changes
	const normalizedHeaderRow = headerRow.map((header) => String(header || "").trim().toLowerCase())

	// headerRow[0] is still the corner cell A1; day columns begin at index 1
	const todayIndex = normalizedHeaderRow.findIndex((header) => header === today)

	if (todayIndex === -1) {
		return null
	}

	const showColIndex = todayIndex - 1

	// parses "10 am–11 am" -> { startLabel: "10 am", endLabel: "11 am" }
	function parseHourCell(hourCell) {
		const value = String(hourCell || "").trim()
		if (!value) {
			return { startLabel: "", endLabel: "" }
		}

		const [startLabel, endLabel] = value.split("–").map((part) => String(part || "").trim())

		// fallback keeps output stable if the delimiter changes unexpectedly
		if (!endLabel) {
			return { startLabel: value, endLabel: value }
		}

		return { startLabel, endLabel }
	}

	// collapse consecutive rows with the same show into one block then compute display range using first row start + last row end
	const shows = []
	hourColumn.forEach((hourCell, i) => {
		const show = String(showGrid[i]?.[showColIndex] || "").trim() || null
		const last = shows[shows.length - 1]
		const parsedHour = parseHourCell(hourCell)

		if (show && last && last.show === show) {
			// preserve the first start label and continuously extend the final end label
			last.endLabel = parsedHour.endLabel
		} else {
			// each block starts from this row's start/end labels
			shows.push({
				show,
				startLabel: parsedHour.startLabel,
				endLabel: parsedHour.endLabel,
			})
		}
	})

	return (
		<div className="text-lg kallisto text-[#e0ff05] w-full">
			<h1 className="bitcount mb-2 text-center lg:text-left text-2xl lg:text-5xl text-white">Today's Schedule</h1>
			{shows.map(({ startLabel, endLabel, show }, i) => (
				show ? (
					<div key={`${startLabel}-${endLabel}-${i}`} className="flex gap-4 py-3 border-b border-gray-300">
						<span className="w-24 text-right">
							{startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`}
						</span>
						<span className="border-l border-gray-300 pl-4 flex-1">
							<button
								type="button"
								onClick={() =>
									setSelectedShow((cur) => cur === show ? null : show)
								}
								className={`text-left underline hover:no-underline ${
									selectedShow === show ? "bg-yellow-200 text-black" : ""
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
