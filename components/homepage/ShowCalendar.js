/*

fetch rows using api/show-calendar
  - request a 7-day window from current date

render 7 day "sections", each listing shows with date, venue, description

skip days with no shows listed

*/

import { useEffect, useMemo, useState } from "react"

const TEMP_START_DATE = "2026-03-19"

// makes the date look nice and not numbery
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
		const start = TEMP_START_DATE

		async function fetchCalendar() {
			try {
				setLoading(true)
				setError(null)
				const response = await fetch(`api/show-calendar?start=${start}&days=7`)
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
		<div className="kallisto mx-auto w-[60vw] text-sm text-white">
			<h2 className="bitcount mb-3 text-lg text-white">Upcoming Shows</h2>
			<div className="max-h-[50vh] overflow-y-auto border border-white p-4">
				{daysWithShows.map((day) => (
					<section key={day.date} className="border-b-4 border-white py-4 last:border-b-0">
						<h3 className="mb-3 text-base text-[#e0ff05]">{prettyDayLabel(day.date)}</h3>
						<ul>
							{day.shows.map((show) => (
								<li key={`${day.date}-${show.eventId}`} className="border-b border-neutral-600 py-2 last:border-b-0">
									<div className="text-white">
										{show.venue.url ? (
											<a
												href={show.venue.url}
												target="_blank"
												rel="noreferrer"
												className="underline hover:no-underline"
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
