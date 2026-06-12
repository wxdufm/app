/*

fetch from external /api/events

accept start date & # of days in the API call (pages/api/show-calendar?start=YYYY-MM-DD&days=10)

filter and normalize to the homepage calendar shape
  - venues should be formatted as NAME, CITY and be hyperlinked to the URL
  - multi-day event logic: they should appear on each covered day
  - basic filtering to remove blank placeholder shows

order shows by day, then by venue

return normalised JSON

*/

import { apiFetch } from "../../lib/api"

function formatLocalDate(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

// normalizes API datetime values like 2026-06-12T04:00:00.000Z into YYYY-MM-DD
function formatEventDate(value) {
	if (typeof value === "string" && value.length >= 10) {
		return value.slice(0, 10)
	}
	return formatLocalDate(new Date(value))
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

	// get today's date
	const today = formatLocalDate(new Date())
	const start = typeof req.query.start === "string" && isValidISODate(req.query.start) ? req.query.start : today

	// clamp day windows to keep payload and processing bounded
	const daysParam = parseInt(req.query.days, 10)
	const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 14) : 10

	const end = addDays(start, days - 1)
	const dayList = enumerateDays(start, days)

	try {
		// external API returns all future events
		const payload = await apiFetch("/api/events")
		const rows = Array.isArray(payload) ? payload : []

		const calendar = dayList.map((date) => ({ date, shows: [] }))
		const calendarByDate = new Map(calendar.map((entry) => [entry.date, entry]))

		rows.forEach((row) => {
			// skip malformed rows and blank descriptions just in case
			if (!row || !String(row.description || "").trim()) {
				return
			}

			// normalize incoming field names from /api/events
			const eventId = row.event_ID
			const showStart = formatEventDate(row.start_date)
			const showEnd = formatEventDate(row.end_date || row.start_date)

			// skip anything that doesn't overlap the requested date window
			if (!showStart || !showEnd || showStart > end || showEnd < start) {
				return
			}

			dayList.forEach((date) => {
				if (date >= showStart && date <= showEnd) {
					const dayEntry = calendarByDate.get(date)
					if (dayEntry) {
						// preserve existing venue payload shape consumed by ShowCalendar
						// after migrating to API endpoints we want to preserve
						const venueName = fixMojibake(row.location_name || "")
						const venueCity = fixMojibake(row.location_city || "")
						dayEntry.shows.push({
							eventId,
							startDate: showStart,
							endDate: showEnd,
							description: fixMojibake(String(row.description || "")),
							venue: {
								id: row.location_ID,
								name: venueName,
								city: venueCity,
								label: [venueName, venueCity].filter(Boolean).join(", "),
								url: row.location_url || ""
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
