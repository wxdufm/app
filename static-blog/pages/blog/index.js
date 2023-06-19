import { Layout } from "../../components/Layout";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import blog from "../../tina/collections/blog";
import PostPreview from "../../components/PostPreview.tsx"

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
          <PostPreview 
            id={post.node.id} 
            title={post.node.title} 
            slug={post.node._sys.filename} 
            cover={post.node.cover} 
            subtitle={ post.node.description ? post.node.description : post.node.body?.substring(0,150) + "..." }
          />
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  // const { data, query, variables } = await client.queries.blogConnection();
  const { data } = await client.request({
    query: `
    {
      blogConnection(sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
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
    `
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
