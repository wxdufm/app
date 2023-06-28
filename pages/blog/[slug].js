import { Layout } from "../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";
import BlogHeader from "../../components/BlogHeader"

// individual blog post page
const PostPage = (props) => {
 
  const { data, query, variables } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const date = new Date(data.blog.published)
  const dateString = date.toDateString();
  const arr = dateString.split(' ');
  const displayDate = `${arr[1]} ${arr[2]}, ${arr[3]}`
  // console.log(data.blog.body);
  return (
    <Layout>
      <BlogHeader/>
          <Link href="/blog">
            <h3>{'<'} Blog</h3>
          </Link>
          {data.blog.categories &&
            <div>
              {data.blog.categories.map((category) => (
                <div key={category.category.id}>
                <Link href={`/blog/category/${category.category._sys.filename}`}>
                  <p>{category.category.title}</p>
                </Link>
                </div>
              ))}
            </div>}
          <h1>{data.blog.title}</h1>
          <p>{displayDate}</p>
          <h3>By {data.blog.author}</h3>
          <img src={data.blog.cover} alt="" width="300px" height="300px"/>
          
          <article className="prose prose-lg prose-h1:text-red-300 text-white">
            <TinaMarkdown content={data.blog.body} />
          </article>
       
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
