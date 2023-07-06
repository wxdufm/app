import { useTina } from "tinacms/dist/react";
import { client } from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import  Link  from "next/link";
import ArchiveLayout from "../../components/ArchiveLayout"



const EventPage = (props) => {

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const date = new Date(data.archive.published);
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const displayDate = date.toLocaleString('en-US', options);

  return (
    <ArchiveLayout specialtyShows={specialtyShows}>
    <div className="w-full mx-auto">
        <div className="row">
          <img src={data.archive.cover} alt="" width="600" height="600"/>

          <div className="column">
          <p className="text-xl mb-5">{data.archive.title}</p>
          <p className="text-xl mb-5">{displayDate}</p>

          <article className="prose mb-5 text-white">
            <TinaMarkdown content={data.archive.description} />
          </article>

          {data.archive.categories &&
            <div>
              {data.archive.categories.map((category) => (
                <div className="border rounded-xl border-white w-24 flex justify-center" key={category.category.id}>
                 {(category.category._sys.filename === "event" || category.category._sys.filename === "specialty-show") 
                  ? <Link href={`/archive/${category.category._sys.filename}s`}>
                      <p>{category.category.title}</p>
                    </Link>
                  : 
                  <Link href={`/archive/specialty-shows/${category.category._sys.filename}`}>
                    <p>{category.category.title}</p>
                  </Link>
                  } 
                </div>
              ))}
            </div>}
          </div>
          
          </div>
      </div>
        
    </ArchiveLayout>
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
