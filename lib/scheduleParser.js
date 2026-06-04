const fs = require('fs')
const path = require('path')
const {parse} = require('csv-parse/sync')

function loadSchedule() {
	const csvFilePath = path.join(process.cwd(), 'public', 'uploads', 'schedule.csv')
	const csvData = fs.readFileSync(csvFilePath, 'utf-8')

	return parse(csvData, {
		columns: false, // keeps day names in table
		trim: true,
	})
}

module.exports = {loadSchedule}
