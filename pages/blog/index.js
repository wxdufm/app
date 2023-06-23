import { Layout } from "../../components/Layout";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import PostPreview from "../../components/PostPreview.tsx";
import LazyLoad from 'react-lazyload';


export default function PostList(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const postsList = data.blogConnection.edges;
  // console.log(postsList);

  return (
    <Layout>
      <h1>WXYC PRESS (?)</h1>
        <div className="blog-grid">
          {postsList.map((post) => (
          <LazyLoad height={200} once={true}>
            <PostPreview 
              id={post.node.id} 
              title={post.node.title} 
              slug={post.node._sys.filename} 
              cover={post.node.cover} 
              // TODO get description from post body somehow
              subtitle={ post.node.description ? post.node.description : "..." }
            />
            </LazyLoad>
          ))}
        </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  // const { data, query, variables } = await client.queries.blogConnection();
  const length = await client.request({
    query: `{
      blogConnection {
        totalCount
      }
    }`
  })

  const { data } = await client.request({
    query: `
    query getContent($postCount: Float)
    {
      blogConnection(sort: "published", last: $postCount, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
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
      }
    }
    `,
    variables: 
    {
      postCount: length.data.blogConnection.totalCount
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
};
