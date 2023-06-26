import { Layout } from "../../components/Layout";
import EventPreview from "../../components/EventPreview";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { groupEventsByWeek, generateStructuredData} from "../../components/OrganizingArchive";
import LazyLoad from 'react-lazyload';
import ArchiveHeader from "../../components/ArchiveHeader"

export default function EventList(props) {

  const eventsList = props.data.archiveConnection.edges;
  const groupedEvents = groupEventsByWeek(eventsList);
  const structuredData = generateStructuredData(groupedEvents);

  let specialtyShows = [];
  props.data.categoryConnection.edges.forEach((category) => {
    specialtyShows.push({ label: category.node.title, value: category.node._sys.filename});
  });

  return (
    <Layout>
      <ArchiveHeader specialtyShows={specialtyShows}/>
      <div className="archive-grid">
        {structuredData.map((event) => (
            <div key={event.id}>
                {(event.type === 'heading') && <h2>week of {event.weekStartDate}</h2>}
                {(event.type === 'events' &&
                <div>
                {event.weekEvents && 
                  <div className="flex flex-row justify-start gap-4">
                    {event.weekEvents.map((event) => (
                      <LazyLoad height={200} once={true}>
                        <EventPreview
                          id={event.event.id}
                          title={event.event.title}
                          cover={event.event.cover}
                          subtitle={event.event.description.children[0].children[0].text.substring(0, 150)}
                          slug={event.event._sys.filename}
                        />
                      </LazyLoad>
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
