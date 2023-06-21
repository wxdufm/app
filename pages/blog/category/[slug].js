import { Layout } from "../../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";
import PostPreview from "../../../components/PostPreview";

const BlogCategoryPage = (props) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
 
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  let sortedEvents = [];
  if (data.blogConnection.edges.length > 0) {
    data.blogConnection.edges.forEach((event) => {
      sortedEvents.push(event);
    })
  } 

  const category = data.category.title;

  return (
    <Layout>
      <Link href="/blog">
        <p>← Back</p>
      </Link>
      <h1>{category}s</h1>
      {(sortedEvents.length > 0) && 
      <div className="blog-grid">
        {sortedEvents.map((post) => (
          <PostPreview 
            id={post.node.id} 
            title={post.node.title} 
            slug={post.node._sys.filename} 
            cover={post.node.cover} 
            subtitle={ post.node.description ? post.node.description : post.node.body?.substring(0,150) + "..." }
          /> 
        ))}
      </div>}
    </Layout>
  );
}

export default BlogCategoryPage;


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
        blogConnection(filter: {categories: {category: {category: {slug: {eq: $slug}}}}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
        edges {
          node {
            id
            title
            author
            description
            cover
            published
            body
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