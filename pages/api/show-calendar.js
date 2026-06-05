/*

connect to tickets db

accept start date & # of days in the API call (pages/api/show-calendar?start=YYYY-MM-DD&days=7)

query `event` table for show date, location ID (maps to venues in `location` table), description
  - venues should be formatted as NAME, CITY and be hyperlinked to the URL
  - multi-day event logic: they should appear on each covered day
  - basic filtering to remove test/placeholder shows

order shows by day, then by venue

return normalised JSON

*/

import db from "../../lib/db/tickets"

function formatLocalDate(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

function addDays(dateString, daysToAdd) {
	const [year, month, day] = dateString.split("-").map(Number)
	const date = new Date(Date.UTC(year, month - 1, day))
	date.setUTCDate(date.getUTCDate() + daysToAdd)
	const y = date.getUTCFullYear()
	const m = String(date.getUTCMonth() + 1).padStart(2, "0")
	const d = String(date.getUTCDate()).padStart(2, "0")
	return `${y}-${m}-${d}`
}

function isValidISODate(value) {
	return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function enumerateDays(startDate, days) {
	const output = []
	for (let i = 0; i < days; i += 1) {
		output.push(addDays(startDate, i))
	}
	return output
}

// conservative hard-coded approach since there aren't that many venues
function fixMojibake(str) {
    if (!str) return ""
    return str
        .replace(/â€™/g, "’")
        .replace(/â€œ/g, "“")
        .replace(/â€/g, "”")
        .replace(/â€"/g, "—")
        .replace(/â€“/g, "–")
        .replace(/Â/g, "")
}

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const today = formatLocalDate(new Date())
	const start = typeof req.query.start === "string" && isValidISODate(req.query.start) ? req.query.start : today
	const daysParam = parseInt(req.query.days, 10)
	const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 14) : 7

	const end = addDays(start, days - 1)
	const dayList = enumerateDays(start, days)

	try {
		const [rows] = await db.query(
			`
				SELECT
					e.event_ID AS eventId,
					e.start_date AS startDate,
					e.end_date AS endDate,
					e.description,
					l.location_ID AS locationId,
					l.name AS venueName,
					l.city AS venueCity,
					l.url AS venueUrl
				FROM event e
				LEFT JOIN location l ON e.location_ID = l.location_ID
				WHERE
					e.start_date <= ?
					AND e.end_date >= ?
					AND e.start_date >= "2000-01-01"
					AND e.end_date >= "2000-01-01"
					AND TRIM(IFNULL(e.description, "")) <> ""
				ORDER BY e.start_date ASC, l.name ASC, e.event_ID ASC
			`,
			[end, start]
		)

		const calendar = dayList.map((date) => ({ date, shows: [] }))
		const calendarByDate = new Map(calendar.map((entry) => [entry.date, entry]))

		rows.forEach((row) => {

			const showStart = formatLocalDate(row.startDate)
			const showEnd = formatLocalDate(row.endDate)

			dayList.forEach((date) => {
				if (date >= showStart && date <= showEnd) {
					const dayEntry = calendarByDate.get(date)
					if (dayEntry) {
                        const venueName = fixMojibake(row.venueName || "")
                        const venueCity = fixMojibake(row.venueCity || "")
						dayEntry.shows.push({
							eventId: row.eventId,
							startDate: showStart,
							endDate: showEnd,
							description: row.description,
							venue: {
								id: row.locationId,
								name: venueName,
								city: venueCity,
								label: [venueName, venueCity].filter(Boolean).join(", "),
								url: row.venueUrl || ""
							}
						})
					}
				}
			})
		})

		calendar.forEach((entry) => {
			entry.shows.sort((a, b) => {
				const venueA = (a.venue.label || "").toLowerCase()
				const venueB = (b.venue.label || "").toLowerCase()
				if (venueA < venueB) return -1
				if (venueA > venueB) return 1
				return a.eventId - b.eventId
			})
		})

		return res.status(200).json({
			startDate: start,
			days,
			endDate: end,
			calendar
		})
	} catch (error) {
		return res.status(500).json({
			error: "Failed to load show calendar"
		})
	}
}
