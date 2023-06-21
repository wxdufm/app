import { Layout } from "../../components/Layout";
import EventPreview from "../../components/EventPreview";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { groupEventsByWeek, generateStructuredData} from "../../components/OrganizingArchive";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { useRouter } from 'next/router';
import { ParentDropdown } from "../../components/ParentDropdown";


export default function EventList(props) {
  const router = useRouter();

  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const eventsList = data.archiveConnection.edges;
  const groupedEvents = groupEventsByWeek(eventsList);
  const structuredData = generateStructuredData(groupedEvents);

  let specialtyShows = [];
  data.categoryConnection.edges.forEach((category) => {
    specialtyShows.push({ label: category.node.title, value: category.node.slug});
  });

  const options = [
    { label: 'Events', value: 'events' },
    { label: 'Specialty Shows', 
      type: 'group', name: 'Specialty Shows', items: specialtyShows,
   },
  ];
  const defaultOption = { label: 'Filter v', value: '' };

  return (
    <Layout>
      <div className="flex row">
        <h1>Archive</h1>
        <Dropdown options={options} onChange={(values) => router.push(`/archive/category/${values.value}`)} value={defaultOption} placeholder="Select an option" />
        {/* <ParentDropdown/> */}
      </div>
      <div className="archive-grid">
        {structuredData.map((event) => (
            <div key={event.id}>
                {(event.type === 'heading') && <h2>week of {event.weekStartDate}</h2>}
                {(event.type === 'events' &&
                <div>
                {event.weekEvents && 
                  <div className="events-row">
                    {event.weekEvents.map((event) => (
                        <EventPreview
                          id={event.event.id}
                          title={event.event.title}
                          cover={event.event.cover}
                          //FIX
                          subtitle={"event.event.description?.substring(0, 150)"}
                          published={event.event.published}
                          slug={event.event._sys.filename}
                        />
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
  const { data } = await client.request({
    query: `
    {
      archiveConnection(sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
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
            slug
          }
        }
      }
    }
    `
  });

  return { 
    props: {
      data,
      //myOtherProp: 'some-other-data',
    },
  };
};
