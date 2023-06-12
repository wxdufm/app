import { Layout } from "../../components/Layout";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";

export default function PostList(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });


  const postsList = data.blogConnection.edges;

  return (
    <Layout>
      <h1>WXYC PRESS (?)</h1>
      <div className="blog-grid">
        {postsList.map((post) => (
          <div key={post.node.id} className="blog-post">
            <img src={post.node.cover} width="300px" height="300px" alt=""/>
            <Link href={`/blog/${post.node._sys.filename}`}>
              <a>{post.node._sys.filename}</a>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { data, query, variables } = await client.queries.blogConnection();

  return { 
    props: {
      data,
      query,
      variables,
      //myOtherProp: 'some-other-data',
    },
  };
};
