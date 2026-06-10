// pages should call this function which will return the final array!!
// --> pass this into the relevant react component which renders an actual table
// moving this functionality here to accomodate both a weekly and today's schedule

// all pages/* should have this atop it (but with relative paths)
// import WeeklySchedule from 'components/WeeklySchedule'  *or relevant react component
// import { scheduleBuilder } from 'lib/schedule/scheduleBuilder'



/*
structure of scheduleCarrier

[0] headerRow = fullArray[0]   (1 row, 8 columns)
[1] hourColumn = fullArray.map(row => row[0]).slice(1)   (rotates hour column into 1 row, 24 columns)
[2] specialtyShowIndices = []   (marks indexes of all specialty shows [WIP])
[3] djNameOnlyArray = [] (starts out as fullNameOnlyArray but gets overwritten)     (24 rows, 7 columns)
[4] idGrid     (same dimensions as [3] but with MySQL ids)
*/



import { parseSchedule } from './scheduleParser'
import { lookupIDsfromFullNames } from './id-lookup'
import { lookupDjNamesFromIDs } from './djName-lookup'

export async function scheduleBuilder() {
  const scheduleCarrier = parseSchedule()
  const idGrid = await lookupIDsfromFullNames(scheduleCarrier[3], scheduleCarrier[2])
  const djNameGrid = await lookupDjNamesFromIDs(idGrid)
  scheduleCarrier[4] = idGrid
  scheduleCarrier[3] = djNameGrid
  return scheduleCarrier
}