import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout";
import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";
import Link from "next/link";

export default function Home(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  // const { data } = useTina({
  //   query: props.query,
  //   variables: props.variables,
  //   data: props.data,
  // });
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 7);

  const posts = props.data.blogConnection.edges;
  const events = props.data.archiveConnection.edges;
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.node.published);
    return eventDate >= startDate && eventDate <= endDate;
  });
  const eventDate = new Date(events[0].node.published);

  // const content = data.page.body;
  return (
    <Layout>
      <div className="home">
        <div className="left">
          <h1>This Week on WXYC</h1>
          {events && (
            <div className="carousel">
              {events.map((event) => (
                <div key={event.node.id} className="slide">
                  <Link href={`/archive/${event.node._sys.filename}`}>
                    <div>
                      <img
                        src={event.node.cover}
                        alt=""
                        height="250"
                        width="250"
                      />
                      <h3>{event.node.title}</h3>
                      <p>{event.node.description.substring(0, 100)}...</p>
                    </div>
                  </Link>
                  <p>{event.node.published}</p>
                </div>
              ))}
            </div>
          )}

          {/* blog preview */}
          <h1>Blog Posts</h1>
          {posts && (
            <div className="carousel">
              {posts.map((post) => (
                <div key={post.node.id} className="slide">
                  <Link href={`/blog/${post.node._sys.filename}`}>
                    <div>
                      <img
                        src={post.node.cover}
                        alt=""
                        width="250"
                        height="250"
                      />
                      <h3>
                        <b>{post.node.title}</b>
                      </h3>
                      {post.node.description && <p>{post.node.description}</p>}
                      {!post.node.description && (
                        <p>{post.node.body.substring(0, 100)}...</p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="right">
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/2GaqYQWzfs0BiRvesw5oYk?utm_source=generator&theme=0"
            width="80%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
        {/* <p>{filteredEvents.length}</p>
      <p>{startDate.toString()}</p>
      <p>{endDate.toString()}</p>
        <p>{eventDate.toString()}</p> */}

        {/* <div data-tina-field={tinaField(data.page, "body")}>
        <TinaMarkdown content={content} />
      </div> */}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  // const { data, query, variables } = await client.queries.page({
  //   relativePath: "home.mdx",
  // });
  // const query = `SELECT * FROM events WHERE event_date BETWEEN '${formattedCurrentDate}' AND '${formattedWeekFromNow}'`;

  const { data } = await client.request({
    query: `{
      blogConnection {
        edges {
          node {
            id
            title
            cover
            author
            tags
            published
            description
            body
            _sys {
              filename
            }
          }
        }
      },
      archiveConnection {
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
  });

  return { props: { data } };
};
