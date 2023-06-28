import { Layout } from "../../../components/Layout";
import { client } from "../../../tina/__generated__/client";
import Link from "next/link";
import PostPreview from "../../../components/PostPreview";
import BlogHeader from "../../../components/BlogHeader";

const BlogCategoryPage = (props) => {
  let sortedEvents = [];
  if (props.data.blogConnection.edges.length > 0) {
    props.data.blogConnection.edges.forEach((event) => {
      sortedEvents.push(event);
    })
  } 

  const category = props.title.data.category.title;

  return (
    <Layout>
      <BlogHeader/>
      <div className=" w-5/6 mx-auto">
   
      <h1>{category}s</h1>
      </div>
      
      {(sortedEvents.length > 0) && 
      <div className="blog-grid grid grid-cols-3 justify-around gap-4 w-5/6 mx-auto">
        {sortedEvents.map((post) => (
          <PostPreview 
            id={post.node.id} 
            title={post.node.title} 
            slug={post.node._sys.filename} 
            cover={post.node.cover} 
            subtitle={ post.node.description ? post.node.description : post.node.body.children[0].children[0].text.substring(0, 75)}
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
        blogConnection(filter: {categories: {category: {category: {title: {eq: $title}}}}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
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