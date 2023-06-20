import { Layout } from "../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Link from "next/link";


const PostPage = (props) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
 
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout>
          <Link href="/blog">
            <h3>{'<'} Blog</h3>
          </Link>
          {data.blog.categories &&
            <div>
              {data.blog.categories.map((category) => (
                <div key={category.category.id}>
                <Link href={`/blog/category/${category.category.slug}`}>
                  <p>{category.category.title}</p>
                </Link>
                </div>
              ))}
            </div>}
          <h1>{data.blog.title}</h1>
          <p>{data.blog.published}</p>
          <h3>By {data.blog.author}</h3>
          <img src={data.blog.cover} alt="" width="300px" height="300px"/>
          <TinaMarkdown content={data.blog.body} />
          <article class="prose prose-slate">
            {/* {data.blog.body} */}
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

  // const { data } = await client.request({
  //   query: `query blog($relativePath: String!) {
  //     blog(relativePath: $relativePath) {
  //       ... on Document {
  //         _sys {
  //           filename
  //           basename
  //           breadcrumbs
  //           path
  //           relativePath
  //           extension
  //         }
  //         id
  //       }
  //       title
  //       author
  //       cover
  //       categories {
  //       __typename
  //         category {
  //           ... on Category {
  //             title
  //             slug
  //             specialtyShow
  //             _sys {
  //               filename
  //             }
  //         }
  //           ... on Document {
  //             id
  //           }
  //         }
  //       }
  //       published
  //       description
  //       body
  //     }
  //   }`,
  //   variables: 
  //   {
  //     relativePath: ctx.params.slug + ".md"
  //   }
  // })

  // console.log({data});

  return { 

    props: {
      data, 
      query,
      variables,
      
    }
};
}
