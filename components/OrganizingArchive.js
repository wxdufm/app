// functions for grouping archive events by week and matching
// them with "Week of..." header
// currently just pulling all archive events and sorting them
// at once instead of pulling incrementally b/c pulling incrementally
// would end up with "week of" duplicates (also b/c all static/git-based,
// not really a lot to optimize anyway); but maybe this could be improved

export function groupEventsByWeek(events) {
  const groupedEvents = {};

  events.forEach((event) => {
    const eventDate = new Date(event.node.published);
    const weekStartDate = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate() - eventDate.getDay()
    );

    // check to see if this already exists below
    const formattedWeekStartDate = weekStartDate.toISOString().split("T")[0];

    if (!groupedEvents[formattedWeekStartDate]) {
      groupedEvents[formattedWeekStartDate] = [event.node];
    } else {
      groupedEvents[formattedWeekStartDate].push(event.node);
    }
  });

  return groupedEvents;
}

export function generateStructuredData(groupedEvents) {
  const structuredData = [];

  Object.keys(groupedEvents).forEach((weekStartDate) => {
    structuredData.push({ type: "heading", weekStartDate });

    const weekEvents = [];

    groupedEvents[weekStartDate].forEach((event) => {
      weekEvents.push({ type: "event", event });
    });

    structuredData.push({ type: "events", weekEvents });
  });

  return structuredData;
}
