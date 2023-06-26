export function groupEventsByWeek(events) {
    const groupedEvents = {};
  
    events.forEach(event => {
      const eventDate = new Date(event.node.published);
      const weekStartDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() - eventDate.getDay());
      //check to see if this already exists  
      const formattedWeekStartDate = weekStartDate.toISOString().split('T')[0];
  
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
  
    Object.keys(groupedEvents).forEach(weekStartDate => {

      structuredData.push({ type: 'heading', weekStartDate });
      
      const weekEvents = [];

      groupedEvents[weekStartDate].forEach(event => {
        weekEvents.push({ type: 'event', event });
      });

      structuredData.push({type: 'events', weekEvents});
    });

    return structuredData;
  }