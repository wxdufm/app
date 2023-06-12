import { Layout } from "../../components/Layout";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";


// Function to group blog posts by week
function groupEventsByWeek(events) {
    const groupedEvents = {};
  
    // Iterate through each blog post
    events.forEach(event => {
      const eventDate = new Date(event.node.published);
      const weekStartDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate() - eventDate.getDay());
  
      // Format week start date as YYYY-MM-DD
      const formattedWeekStartDate = weekStartDate.toISOString().split('T')[0];
  
      // Create or update the week group and add the post to it
      if (!groupedEvents[formattedWeekStartDate]) {
        groupedEvents[formattedWeekStartDate] = [event.node];
      } else {
        groupedEvents[formattedWeekStartDate].push(event.node);
      }
    });
  
    return groupedEvents;
  }
  
  // Function to generate the desired structure with week headings
  function generateStructuredData(groupedEvents) {
    const structuredData = [];
  
    // Iterate through each week group
    Object.keys(groupedEvents).forEach(weekStartDate => {
      // Add the week heading
      structuredData.push({ type: 'heading', weekStartDate });
      
      const weekEvents = [];

        // Add each event in the week
      groupedEvents[weekStartDate].forEach(event => {
        weekEvents.push({ type: 'event', event });
      });
      // console.log(weekEvents);
      structuredData.push({type: 'events', weekEvents});
      // Add each blog post in the week
    //   groupedEvents[weekStartDate].forEach(event => {
    //     structuredData.push({ type: 'event', event });
    //   });
    });

    return structuredData;
  }


export default function EventList(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });


  const eventsList = data.archiveConnection.edges;
  // Group the blog posts by week
  const groupedEvents = groupEventsByWeek(eventsList);
  
  // Generate the desired structure with week headings
  const structuredData = generateStructuredData(groupedEvents);
  
  // Output the structured data
//   console.log(structuredData);

  return (
    <Layout>
      <h1>Archive</h1>
      <div className="archive-grid">
        {structuredData.map((event) => (
            <div>
                {(event.type === 'heading') && <h3>week of {event.weekStartDate}</h3>}
                {(event.type === 'events' &&
                <div>
                {event.weekEvents && <div className="events-row">
                    {event.weekEvents.map((event) => (
                        <div className="archive-event">
                        <Link href={`/archive/${event.event._sys.filename}`}>
                        <div>
                            <p>{event.event.title}</p>
                            <img src={event.event.cover} alt="" width="250" height="250"/>
                            <p>{event.event.description.substring(0, 75)}...</p>
                        </div>
                        </Link>
                        </div>
                    ))}
                    </div>}
                </div>)}
            </div>

        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.archiveConnection();

  return { 
    props: {
      data,
      query,
      variables,
      //myOtherProp: 'some-other-data',
    },
  };
};
