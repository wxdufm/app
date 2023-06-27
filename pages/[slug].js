import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout";
import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../tina/__generated__/client";

//editable static pages (about, programming, etc.)
export default function Home(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const content = data.page.body;

  return (
    <Layout>
      <div data-tina-field={tinaField(data.page, "body")}>
  <div className="w-5/6 mx-auto">
  <article className="prose text-white">
        <TinaMarkdown content={content} />
      </article>
  </div>
      
      </div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
    const { data } = await client.queries.pageConnection();
    const paths = data.pageConnection.edges.map((x) => {
      return { params: { slug: x.node._sys.filename } };
    });
  
    return {
      paths,
      fallback: "blocking",
    };
  };

export const getStaticProps = async (ctx) => {
    const { data, query, variables } = await client.queries.page({
        relativePath: ctx.params.slug + ".mdx",
    });
  
    return {
      props: {
        data,
        query,
        variables,
        //myOtherProp: 'some-other-data',
      },
    };
  };


