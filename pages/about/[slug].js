import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField, useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import AboutLayout from "../../components/AboutLayout";

//editable static pages within the about tab (mission and history)
export default function AboutPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  // gets content from CMS and stores it in content variable
  // gets props from getStaticProps method below
  const content = data.page.body;

  return (
    <AboutLayout>
      <div data-tina-field={tinaField(data.page, "body")}>
        <div className="flex flex-row justify-center w-5/6 mx-auto">
          <article className="prose prose-lg prose-h1:text-white prose-h1:font-kallisto prose-h1:text-5xl prose-h1:font-normal prose-a:text-blue-500 prose-h3:text-white prose-h3:font-normal text-white">
            <TinaMarkdown content={content} />
          </article>
        </div>
      </div>
    </AboutLayout>
  );
}

export const getStaticPaths = async () => {
  const paths = [
    { params: { slug: "mission" } },
    { params: { slug: "history" } },
  ];

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
    },
  };
};
