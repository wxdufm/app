import { Layout } from "../../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../../tina/__generated__/client";
import EventPreview from "../../../components/EventPreview";
import {groupEventsByWeek, generateStructuredData} from '../../../components/OrganizingArchive';
import Link from "next/link";

const ArchiveCategoryPage = (props) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
 
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });


  let structuredData = [];
  let sortedEvents = [];


  if (data.archiveConnection.edges.length > 0) {
    data.archiveConnection.edges.forEach((event) => {
      sortedEvents.push(event);
    })
    const groupedEvents = groupEventsByWeek(sortedEvents);
    structuredData = generateStructuredData(groupedEvents);
  }

  const category = data.category.title;

  return (
    <Layout>
      <Link href="/archive">
        <p>← Back</p>
      </Link>
      <h1>{category}s</h1>

      {(structuredData.length > 0) && 
      <div>
        <div className="archive-grid">
        {structuredData.map((event) => (
            <div key={event.id}>
                {(event.type === 'heading') && <h3>week of {event.weekStartDate}</h3>}
                {(event.type === 'events' &&
                <div>
                {event.weekEvents && <div className="events-row">
                    {event.weekEvents.map((event) => (
                        <EventPreview
                        id={event.event.id}
                        title={event.event.title}
                        cover={event.event.cover}
                        subtitle={event.event.description?.substring(0, 150)}
                        published={event.event.published}
                        slug={event.event._sys.filename}
                      />
                    ))}
                    </div>}
                </div>)}
            </div>

        ))}
      </div>
    
      </div>}


    </Layout>
  );
}

export default ArchiveCategoryPage;


export const getStaticPaths = async () => {
  const { data } = await client.queries.blogConnection();
  const paths = data.blogConnection.edges.map((x) => {
    return { params: { slug: x.node._sys.filename } };
  });
 
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async (ctx) => {
    // const { data, query, variables } = await client.queries.blogConnection();

    const { data } = await client.request({
      query: `
        query getContent($slug: String, $relativePath: String) {
          archiveConnection(filter: {categories: {category: {category: {slug: {eq: $slug}}}}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
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
          category(relativePath: $relativePath) {
            title
          }
        }`,
        variables: {
          "slug": ctx.params.slug,
          "relativePath": ctx.params.slug + ".md"
        }
    })

    return { 
      props: {
        data,
        // query,
        // variables,
        //myOtherProp: 'some-other-data',
      },
    };
}