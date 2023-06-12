import { Layout } from "../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";


const PostPage = (props) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
 
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout>
      <code>
        <pre
          style={{
            backgroundColor: "lightgray",
          }}
        >
          <h1>{data.blog.title}</h1>
          <h3>{data.blog.author}</h3>
          <p>{data.blog.body}</p>
          <img src={data.blog.cover} alt=""/>
          
          {/* <TinaMarkdown content={data.post.body}/> */}
          {/* {JSON.stringify(data.post,   null, 2)} */}
        </pre>
        <body>
          <p>{data.blog.title}</p>
          {data.blog.tags &&
            <div>
              {data.blog.tags.map((tag) => (
                <div key={tag.id}>
                <p>{tag}</p>
                </div>
              ))}
            </div>}
        </body>
      </code>
    </Layout>
  );
}

export default PostPage;


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
  const { data, query, variables } = await client.queries.blog({
    relativePath: ctx.params.slug + ".md",
  });

  return { 

    props: {
      data,
      query,
      variables,
    }
};
}
