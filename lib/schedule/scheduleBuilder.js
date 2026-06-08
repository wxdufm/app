// pages should call this function which will return the final array!!
// --> pass this into the relevant react component which renders an actual table
// moving this functionality here to accomodate both a weekly and today's schedule

// all pages/* should have this atop it (but with relative paths)
// import WeeklySchedule from 'components/WeeklySchedule'  *or relevant react component
// import { scheduleBuilder } from 'lib/schedule/scheduleBuilder'

import { parseSchedule } from './scheduleParser'
import { lookupIDsfromFullNames } from './id-lookup'
import { lookupDjNamesFromIDs } from './djName-lookup'

export async function scheduleBuilder() {
  const scheduleCarrier = parseSchedule()
  const idGrid = await lookupIDsfromFullNames(scheduleCarrier[3])
  const djNameGrid = await lookupDjNamesFromIDs(idGrid)
  scheduleCarrier[4] = idGrid
  scheduleCarrier[3] = djNameGrid
  return scheduleCarrier
}