import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";
import BlogLayout from "../../components/BlogLayout"

// individual blog post page
const PostPage = (props) => {
 
  const { data, query, variables } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const date = new Date(data.blog.published);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const displayDate = date.toLocaleString('en-US', options);
 
  return (
    
    <BlogLayout>
      <div className="mx-auto w-5/6 pb-10">
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
          <h1 className="text-5xl mb-2 kallisto">{data.blog.title}</h1>
          <p>{displayDate}</p>
          <h3 className="mb-3"> By {data.blog.author}</h3>
          <img src={data.blog.cover} alt="" width="300px" height="300px" className="mb-3"/>
          
          <article className="prose prose-lg prose-h3:text-white text-white">
            <TinaMarkdown content={data.blog.body} />
          </article>
      </div> 
    </BlogLayout>
   
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
