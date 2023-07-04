import { Layout } from "../../../components/Layout";
import { client } from "../../../tina/__generated__/client";
import EventPreview from "../../../components/EventPreview";
import {groupEventsByWeek, generateStructuredData} from '../../../components/OrganizingArchive';
import Link from "next/link";
import ArchiveHeader from "../../../components/ArchiveHeader";

const ArchiveCategoryPage = (props) => {

  let structuredData = [];
  let sortedEvents = [];


  if (props.data.archiveConnection.edges.length > 0) {
    props.data.archiveConnection.edges.forEach((event) => {
      sortedEvents.push(event);
    })
    const groupedEvents = groupEventsByWeek(sortedEvents);
    structuredData = generateStructuredData(groupedEvents);
  }

  const category = props.title.data.category.title;

  let specialtyShows = [];
  props.data.categoryConnection.edges.forEach((category) => {
    specialtyShows.push({ label: category.node.title, value: category.node._sys.filename});
  });

  return (
    <Layout>
      <ArchiveHeader specialtyShows={specialtyShows}/>
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
                        subtitle={event.event.description.children[0].children[0].text.substring(0, 150)}
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
  const title = await client.request({
    query: `
      query getTitle($relativePath: String) {
        category(relativePath: $relativePath) {
          title
        }
      }
    `,
    variables: 
    {
      "relativePath": ctx.params.slug + ".md"
    }
  })

  const { data } = await client.request({
    query: `
      query getContent($title: String) {
      archiveConnection(filter: {categories: {category: {category: {title: {eq: $title}}}}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
      edges {
        node {
          id
          title
          description
          cover
          published
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

  }`,
      variables: {
        "title": title.data.category.title,
      }
  })

  return { 
    props: {
      data,
      title
    },
  };
}