import Link from 'next/link';
import groq from 'groq';
import client from '@/client';
import RootLayout from '@/app/layout';
import imageUrlBuilder from '@sanity/image-url';

function urlFor (source) {
  return imageUrlBuilder(client).image(source)
}

const CategoryPage = ({ posts }) => {
  return (
    <RootLayout>
      <div>
        {posts.map((post) => (
          <div key={post.title}>
            {post.mainImage &&
              <div>
                <img src={urlFor(post.mainImage).width(100).url()} alt="Main Image" />
              </div>}
            <h2>{post.title}</h2>
            <p>Category Slug: {post.categorySlug}</p>
          </div>
        ))}
      </div>
    </RootLayout>
  );
};

const query = groq`*[_type == "post" && category->categorySlug == $categorySlug]{
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
  const posts = await client.fetch(query, { categorySlug });
  
  return {
    props: {
      posts,
    },
  };
}

export default CategoryPage;
