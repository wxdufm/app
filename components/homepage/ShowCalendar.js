/*

fetch rows using api/show-calendar
  - request a 10-day window from current date

render day "sections", each listing shows with date, venue, description

skip days with no shows listed

*/

import { useEffect, useMemo, useState } from "react"

// formats local browser date into YYYY-MM-DD for the API query
function formatLocalDate(date) {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const day = String(date.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

// makes the date look nice and not numbery for display in div
function prettyDayLabel(isoDate) {
	const [year, month, day] = isoDate.split("-").map(Number)
	const date = new Date(year, month - 1, day)
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		month: "short",
		day: "numeric"
	})
}

export default function ShowCalendar() {
	const [rows, setRows] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let cancelled = false
		const start = formatLocalDate(new Date())

		async function fetchCalendar() {
			try {
				setLoading(true)
				setError(null)
				// request a 10-day window per homepage requirements
				const response = await fetch(`api/show-calendar?start=${start}&days=10`)
				if (!response.ok) {
					throw new Error("Calendar fetch failed")
				}
				const data = await response.json()
				if (!cancelled) {
					setRows(Array.isArray(data.calendar) ? data.calendar : [])
				}
			} catch (err) {
				if (!cancelled) {
					setError(err.message)
					setRows([])
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		fetchCalendar()
		return () => {
			cancelled = true
		}
	}, [])

	const daysWithShows = useMemo(() => rows.filter((day) => Array.isArray(day.shows) && day.shows.length > 0), [rows])

	if (loading) {
		return <div className="kallisto text-sm text-white">Loading shows...</div>
	}

	if (error) {
		return <div className="kallisto text-sm text-red-300">Could not load shows.</div>
	}

	if (daysWithShows.length === 0) {
		return <div className="kallisto text-sm text-white">No shows listed this week.</div>
	}

	return (
		<div className="mx-auto w-[60vw] text-sm text-white tracking-[0.1em]">
			<h2 className="mb-3 text-lg text-white">Upcoming Shows</h2>
			<div className="max-h-[50vh] overflow-y-auto border border-white p-4">
				{daysWithShows.map((day) => (
					<section key={day.date} className="border-b-4 border-white py-4 last:border-b-0">
						<h3 className="font-bold mb-3 text-base text-[#e0ff05]">{prettyDayLabel(day.date)}</h3>
						<ul>
							{day.shows.map((show) => (
								<li key={`${day.date}-${show.eventId}`} className="border-b border-neutral-600 py-2 last:border-b-0">
									<div className="kallisto text-white">
										{show.venue.url ? (
												<a
													href={show.venue.url}
													target="_blank"
													rel="noopener noreferrer"
													className="underline hover:no-underline"
													aria-label={`${show.venue.label} (opens in a new tab)`}
												>
												{show.venue.label || "Venue TBA"}
											</a>
										) : (
											<span>{show.venue.label || "Venue TBA"}</span>
										)}
									</div>
									<div className="text-neutral-300">{show.description}</div>
								</li>
							))}
						</ul>
					</section>
				))}
			</div>
		</div>
	)
}
