import EventPreview from "../../components/EventPreview";
import { client } from "../../tina/__generated__/client";
import { groupEventsByWeek, generateStructuredData} from "../../components/OrganizingArchive";
import LazyLoad from 'react-lazyload';
import ArchiveDropdown from "../../components/ArchiveDropdown"
import ArchiveLayout from "../../components/ArchiveLayout"



export default function EventList(props) {

  const eventsList = props.data.archiveConnection.edges;
  const groupedEvents = groupEventsByWeek(eventsList);
  const structuredData = generateStructuredData(groupedEvents);

  let specialtyShows = [];
  props.data.categoryConnection.edges.forEach((category) => {
    specialtyShows.push({ label: category.node.title, value: category.node._sys.filename});
  });

  return (
    
    <ArchiveLayout>
      <ArchiveDropdown specialtyShows={specialtyShows}/>
      <div className="archive-grid w-full mx-auto">
        {structuredData.map((event) => (
            <div key={event.id}>
                {(event.type === 'heading') && <p className="text-3xl mt-10 mb-2">Week of {event.weekStartDate}</p>}
                {(event.type === 'events' &&
                // needs unique key somehow
                <div>
                {event.weekEvents && 
                  <div className="flex flex-row justify-start gap-4 overflow-x-scroll">
                    {event.weekEvents.map((event) => (
                    <div key={event.event.id}>
                      <LazyLoad height={200} once={true}>
                        <EventPreview
                          id={event.event.id}
                          title={event.event.title}
                          cover={event.event.cover}
                          subtitle={event.event.description.children[0].children[0].text.substring(0, 75)}
                          slug={event.event._sys.filename}
                        />
                      </LazyLoad>
                    </div>
                    ))}
                    </div>}
                </div>)}
            </div>

        ))}
      </div>
    </ArchiveLayout>
  );
}


export const getStaticProps = async () => {
  const length = await client.request({
    query: `{
      archiveConnection {
        totalCount
      }
    }
    `
  });

  const { data } = await client.request({
    query: `
    query getContent($eventCount: Float)
    {
      archiveConnection(sort: "published", last: $eventCount, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
        edges {
          node {
            id
            title
            cover
            published
            description
            _sys {
              filename
            }
          }
        }
      },
      categoryConnection(filter: {specialtyShow: { eq:true}}) {
        edges {
          node {
            id
            title
            _sys {
              filename
            }
          }
        }
      }
    }
    `,
    variables: {
      eventCount: length.data.archiveConnection.totalCount
    }
  });

  return { 
    props: {
      data
    },
    revalidate: 10,
  };
};
