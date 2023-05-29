import Link from 'next/link';
import groq from 'groq';
import client from '@/client';
import RootLayout from '@/app/layout';
import imageUrlBuilder from '@sanity/image-url';

function urlFor (source) {
  return imageUrlBuilder(client).image(source)
}

const CategoryAPage = ({ events }) => {
  return (
    <RootLayout>
      <div>
        {events.map((event) => (
          <div key={event.title}>
            {event.mainImage &&
              <div>
                <img src={urlFor(event.mainImage).width(100).url()} alt="Main Image" />
              </div>}
            <h2>{event.title}</h2>
            <p>Category Slug: {event.categorySlug}</p>
          </div>
        ))}
      </div>
    </RootLayout>
  );
};

const query = groq`*[_type == "event" && category->categorySlug == $categorySlug]{
  title,
  "categorySlug": category->categorySlug,
  mainImage
}`;

export async function getStaticPaths() {
  const categories = await client.fetch(groq`*[_type == "category"]{ categorySlug }`);
  
  const paths = categories.map((category) => ({
    params: { categorySlug: category.categorySlug },
  }));
  
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { categorySlug } = params;
  const events = await client.fetch(query, { categorySlug });
  
  return {
    props: {
      events,
    },
  };
}

export default CategoryAPage;
