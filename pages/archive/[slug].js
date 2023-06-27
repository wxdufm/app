import { Layout } from "../../components/Layout";
import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import  Link  from "next/link";


const EventPage = (props) => {
 
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <Layout>
    <div className="w-5/6 mx-auto">
      <Link href="/archive">
        <p className="mb-5">{'<'} Archive</p>
        </Link>
        <div className="row">
          <img src={data.archive.cover} alt="" width="600" height="600"/>

          <div className="column">
          <p className="text-xl mb-5">{data.archive.title}</p>

          <article className="prose mb-5 text-white">
            <TinaMarkdown content={data.archive.description} />
          </article>

          {data.archive.categories &&
            <div>
              {data.archive.categories.map((category) => (
                <div className="border rounded-xl border-white w-24 flex justify-center" key={category.category.id}>
                <Link href={`/archive/category/${category.category._sys.filename}`}>
                  <p>{category.category.title}</p>
                </Link>
                </div>
              ))}
            </div>}
          </div>
          
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




  return { 

    props: {
      data,
      query,
      variables
    }
};
}
