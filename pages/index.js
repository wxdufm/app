import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout";
import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import Link from "next/link";
import PostPreview from "../components/PostPreview";
import EventPreview from "../components/EventPreview";


export default function Home(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  // const { data } = useTina({
  //   query: props.query,
  //   variables: props.variables,
  //   data: props.data,
  // });

  const posts = props.data.blogConnection.edges;
  const events = props.data.archiveConnection.edges;
  console.log({events});

  // const content = data.page.body;
  return (
    <Layout>
      <div className="home">
        <div className="left">
          <h1>This Week on WXYC</h1>
          {events && (
            <div className="carousel">
              {events.map((event) => (
                <EventPreview
                id={event.node.id}
                title={event.node.title}
                cover={event.node.cover}
                // TODO get description from post body somehow
                subtitle={event.node.description.toString().substring(0, 150)}
                published={event.node.published}
                slug={event.node._sys.filename}
              />
              ))}
            </div>
          )}
          <Link href="/archive">
              <h2>archive {'>'}</h2>
          </Link>

          {/* blog preview */}
          <h1>Blog Posts</h1>
          {posts && (
            <div className="carousel">
              {posts.map((post) => (
                <PostPreview 
                id={post.node.id} 
                title={post.node.title} 
                slug={post.node._sys.filename} 
                cover={post.node.cover} 
                // TODO get description from post body somehow
                subtitle={ post.node.description ? post.node.description : "..." }
              />
              ))}
            </div>
          )}
          <Link href="/blog">
              <h2>blog {'>'}</h2>
          </Link>
        </div>

        <div className="right">
        <iframe src={`https://dj.wxyc.org/#/NowPlaying`} style={{border: '0px', width: '300px', height: '400px', overflow: 'hidden', marginBottom: "50px" }} />
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/2GaqYQWzfs0BiRvesw5oYk?utm_source=generator&theme=0"
            width="80%"
            height="352"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          {/* <iframe src={`https://dj.wxyc.org/#/NowPlaying`} style={{border: '0px', width: '320px', height: '400px', overflow: 'hidden', marginBottom: "50px" }} /> */}

        </div>
        
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  // const { data, query, variables } = await client.queries.page({
  //   relativePath: "home.mdx",
  // });


  const currentDateTime = new Date();
  const startOfWeek = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay());
  const endOfWeek = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() + (6 - currentDateTime.getDay()));

  const { data } = await client.request({
    
    query: `
    query getContent($startOfWeek: String, $endOfWeek: String)
    {    
        blogConnection(sort: "published", last:10, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
          edges {
            node {
              id
              title
              cover
              published
              description
              
              body
              _sys {
                filename
              }
            }
          }
        },
       
      archiveConnection(filter: {published: {after: $startOfWeek, before: $endOfWeek}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
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
      } 
    }
    `,
    variables:
    {
      "endOfWeek": endOfWeek.toDateString(),
      "startOfWeek": startOfWeek.toDateString()
    }

  });

  return { props: { data } };
};
