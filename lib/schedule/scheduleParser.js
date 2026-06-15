/*
schedule formatting flow:

full names in format "(First) First.Last (Last)"

.csv of full names dropped into public/uploads/schedule.csv via Tina
			|
			v
lib/schedule/scheduleParser.js reads .csv, returns 2D array of full names,
note specialty shows prefixed with [SP], strip "[SP] " from the name, note indices
strip header row and first column, note header information (day names, hour labels)
			|
			v
pages/api/schedule-fullName-lookup.js takes 2D array of full names, queries MySQL: plmanager/users for matching first + last names,
returns 2D array of primary keys "ID" (or "first name + last name" if no match is found)
			|
			v
pages/api/schedule-djName-lookup.js takes 2D array of primary keys, queries MySQL: plmanager/users for matching IDs,
returns 2D array of DJ names (or skip querying and return "[NO USER FOUND] first name + last name" if no match is found)
			|
			v
components/WeeklySchedule.js receives 2D array of DJ names, renders weekly grid (including multi-hour show logic)
also receives specialty show indices to apply special styling, and header information for day names and hour labels

all of this via getStaticProps in pages/[slug].js for build-time rendering, revalidating every 24 hours or with new schedule upload
and widgetized in tina/collections/page.js, allowing schedule to be added anywhere on the site from TinaCMS
*/

const fs = require("fs")
const path = require("path")
const {parse} = require("csv-parse/sync")

function parseSchedule() {
	const csvFilePath = path.join(process.cwd(), "public", "uploads", "schedule.csv")
	// explicit parse guardrails keep schedule errors actionable at build/runtime
	if (!fs.existsSync(csvFilePath)) {
		throw new Error("SCHEDULE_PARSE_FILE_MISSING: public/uploads/schedule.csv")
	}

	const csvData = fs.readFileSync(csvFilePath, "utf-8")
	if (!csvData || !csvData.trim()) {
		throw new Error("SCHEDULE_PARSE_EMPTY_FILE: schedule.csv has no data")
	}

	const parsedArray = parse(csvData, {
		columns: false,
		trim: true
	})

	if (!Array.isArray(parsedArray) || parsedArray.length < 2) {
		throw new Error("SCHEDULE_PARSE_BAD_ROWS: need header row plus at least one schedule row")
	}

	const firstRowWidth = Array.isArray(parsedArray[0]) ? parsedArray[0].length : 0
	if (firstRowWidth < 2) {
		throw new Error("SCHEDULE_PARSE_BAD_COLUMNS: need hour column plus at least one day column")
	}

	// normalize every cell once so downstream lookups can assume strings
	const fullArray = parsedArray.map((row, rowIndex) => {
		if (!Array.isArray(row) || row.length !== firstRowWidth) {
			throw new Error(`SCHEDULE_PARSE_RAGGED_ROW: row ${rowIndex + 1} has inconsistent width`)
		}
		return row.map((cell) => String(cell ?? "").trim())
	})

	const scheduleCarrier = [
		// headerRow includes value of corner cell A1, but is removed from hourColumn
		fullArray[0], //headerRow
		fullArray.map(row => row[0]).slice(1), //hourColumn
		[], //specialtyShowIndices (in case special formatting)
		fullArray.slice(1).map(row => row.slice(1)), //showOnlyArray --> at first, contains First.Last --> becomes DjNames
		[] //idGrid
	]

	/* search for specialty shows <moved to id-lookup.js
	for (let i = 1; i < fullArray.length; i++) {
		for (let j = 1; j < fullArray[i].length; j++) {
			if (fullArray[i][j].startsWith("[SP] ")) {
				scheduleCarrier[2].push([i - 1, j - 1])
				fullArray[i][j] = fullArray[i][j].substring(5) // strips "[SP] " from the name
			}
		}
	}
	*/

	return scheduleCarrier
}

module.exports = {parseSchedule}
