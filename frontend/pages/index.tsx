// frontend/pages/index.tsx

import Link from "next/link";
import groq from "groq";
import client from "../client";
import imageUrlBuilder from "@sanity/image-url";
import RootLayout from "@/app/layout";


function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

const Index = ({ posts, events }) => {
  return (
    <RootLayout>
      <div className="home">
        <div className="left">
          <h1>WXYC This Week</h1>
          <div className="blogCarousel">
            {events.length > 0 &&
              events.map(
                ({
                  _id,
                  title = "",
                  slug = "",
                  publishedAt = "",
                  mainImage = "",
                }) =>
                  slug && (
                    <div className="blogPost">
                      <li key={_id}>
                        <Link
                          href={`/archive/event/${encodeURIComponent(
                            slug.current
                          )}`}
                        >
                          {mainImage && (
                            <img
                              src={urlFor(mainImage)
                                .width(300)
                                .height(300)
                                .url()}
                              alt="Main Image"
                            />
                          )}

                          <b>{title}</b>

                          <p>{new Date(publishedAt).toDateString()}</p>
                        </Link>{" "}
                      </li>
                    </div>
                  )
              )}
          </div>

          <br />
          <br />
          <br />
          <h1>Blog Posts</h1>
          <div className="blogCarousel">
            {posts.length > 0 &&
              posts.map(
                ({
                  _id,
                  title = "",
                  slug = "",
                  publishedAt = "",
                  mainImage = "",
                  name = "",
                }) =>
                  slug && (
                    <div className="blogPost">
                      <li key={_id}>
                        <Link
                          href={`/blog/post/${encodeURIComponent(
                            slug.current
                          )}`}
                        >
                          {mainImage && (
                            <img
                              src={urlFor(mainImage)
                                .width(300)
                                .height(300)
                                .url()}
                              alt="Main Image"
                            />
                          )}

                          <b>{title}</b>

                          <p>{new Date(publishedAt).toDateString()}</p>
                        </Link>{" "}
                      </li>
                    </div>
                  )
              )}
          </div>
        </div>
        <div className="right">
          <h1>SIMULCAST EMBED</h1>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/2GaqYQWzfs0BiRvesw5oYk?utm_source=generator&theme=0"
            height="400px"
            width="100%"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>

          {/* TODO instagram embed */}
        </div>
      </div>
    </RootLayout>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
       *[_type == "post"]{
        title,
        slug,
        "name": author->name,
        mainImage,
        publishedAt
       }`);
  const events = await client.fetch(groq`
        *[_type == "event"]{
        title,
        slug,
        mainImage,
        publishedAt
       }`);
  return {
    props: {
      posts,
      events,
    },
  };
}

export default Index;
