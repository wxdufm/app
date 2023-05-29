// [slug].tsx
import markdownStyles from "/Users/hayleyowens/Desktop/website/frontend/components/markdown-styles.module.css";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import client from "@/client";

import RootLayout from "@/app/layout";
import Link from "next/link";
import { flattenDiagnosticMessageText } from "typescript";

const page = {
  width: "100%",
  padding: "50px 0px 50px 0px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const titleStyle = {
  fontSize: "36px",
  textAlign: "center",
};

const center = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "15px",
  gap: "10px"
};

const tag = {
  width: "200px",
  padding: "10px",
  backgroundColor: "rgba(255, 0, 102, 0.55)",
  textAlign: "center"
}

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

const Event = ({ event }) => {
  const {
    title = "Missing title",
    categoryTitle = "Missing category",
    categorySlug, 
    mainImage,
    description = [],
  } = event;
  return (
    <RootLayout>
      <div style={page}>
        <article>
          
          <div style={center}>
          <Link
            href={`/archive/category/${encodeURIComponent(categorySlug)}`}
          >
            <p style={tag}>{categoryTitle}</p>
          </Link>

          <h1 style={titleStyle}>{title}</h1>  

          {/* {categories && (
          <ul>
            Posted in
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/blog/category/${encodeURIComponent(
                    category.categorySlug
                  )}`}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        )} */}

          {mainImage && (
            <div style={center}>
              <img src={urlFor(mainImage).width(400).url()} alt="Main Image" />
            </div>
          )}
          </div>
      
          <div className={`max-w-2xl mx-auto ${markdownStyles.markdown}`}>
            <PortableText value={description} />
          </div>
        </article>
      </div>
    </RootLayout>
  );
};

const query = groq`*[_type == "event" && slug.current == $slug][0]{
  title,
  "categoryTitle": category->title,
  "categorySlug": category->categorySlug,
  mainImage,
  description
}`;
export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "event" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const event = await client.fetch(query, { slug });
  return {
    props: {
      event,
    },
  };
}
export default Event;
