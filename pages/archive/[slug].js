import { Layout } from "../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import  Link  from "next/link";


const EventPage = (props) => {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
 
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout>
 
        <Link href="/archive">
        <h3>{'<'} Archive</h3>
        </Link>
        <div className="row">
          <img src={data.archive.cover} alt="" width="600" height="600"/>

          <div className="column">
          <h1>{data.archive.title}</h1>
          {/* <h3>{data.archive.description}</h3> */}
       
          {/* <TinaMarkdown content={data.post.body}/> */}
          {/* {JSON.stringify(data.post,   null, 2)} */}
   
          {data.archive.categories &&
            <div>
              {data.archive.categories.map((category) => (
                <div key={category.category.id}>
                <Link href={`/archive/category/${category.category.slug}`}>
                  <p>{category.category.title}</p>
                </Link>
                </div>
              ))}
            </div>}
          </div>
          
          </div>

    </Layout>
  );
}

export default EventPage;


export const getStaticPaths = async () => {
  const { data } = await client.queries.archiveConnection();
  const paths = data.archiveConnection.edges.map((x) => {
    return { params: { slug: x.node._sys.filename } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};


export const getStaticProps = async (ctx) => {
  const { data, query, variables } = await client.queries.archive({
    relativePath: ctx.params.slug + ".md",
  });

  // const {categories} = await client.request({
  //   query: `
  //   query getCategories ($relativePath: String) {
  //     archive(relativePath: $relativePath) {
  //       title
  //        categories {
  //         category {
  //           ... on Category {
  //             title
                //  _sys {
                //   filename
                //  }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   `,
  //   variables: 
  //   {
  //     relativePath: ctx.params.slug + ".md"
  //   }
  // })



  return { 

    props: {
      data,
      query,
      variables
    }
};
}
