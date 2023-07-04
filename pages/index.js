import { Layout } from "../components/Layout";
import { client } from "../tina/__generated__/client";
import Link from "next/link";
import PostPreview from "../components/PostPreview";
import EventPreview from "../components/EventPreview";
import ImageGallery from 'react-image-gallery';


export default function Home(props) {
  const posts = props.data.blogConnection.edges;
  const events = props.data.archiveConnection.edges;
  let images = [];

  props.data.gallery.galleryImage.forEach((image) => {
    images.push({original: image})
  })

  return (
    <Layout>
<<<<<<< Updated upstream
      <div className="w-full flex flex-row gap-4">
        <div className="flex flex-col w-4/6 justify-center">
          <h1>This Week on WXYC</h1>
=======
      <div className="w-5/6 mx-auto flex flex-row gap-4">
        
        {/* Left side of the screen container */}
        
        <div className="flex flex-col w-4/6 justify-center mr-10 mt-10">
          <p className="text-white font-hack text-2xl">This Week on WXYC</p>
>>>>>>> Stashed changes
          {events && (
            <div className="flex gap-1 overflow-x-auto snap-mandatory">
              {events.map((event) => (
                <div key={event.node.id}>
                <EventPreview
                id={event.node.id}
                title={event.node.title}
                cover={event.node.cover}
                subtitle={event.node.description.children[0].children[0].text.substring(0, 150) + "..."}
                published={event.node.published}
                slug={event.node._sys.filename}
              />
              </div>
              ))}
            </div>
          )}
          <Link href="/archive">
              <h2>archive {'>'}</h2>
          </Link>


          <h1>Blog Posts</h1>
          {posts && (
            <div className="carousel">
              {posts.map((post) => (
                <div key={post.node.id}>
                <PostPreview 
                id={post.node.id} 
                title={post.node.title} 
                slug={post.node._sys.filename} 
                cover={post.node.cover} 
                subtitle={ post.node.description ? post.node.description : post.node.body.children[0].children[0].text.substring(0, 150) + "..." }
              />
              </div>
              ))}
            </div>
          )}
          <Link href="/blog">
              <h2>blog {'>'}</h2>
          </Link>
          
          {/* <ImageGallery items={images} /> */}
        </div>

        <div className="right">
        <iframe src={`https://dj.wxyc.org/#/NowPlaying`} style={{border: '0px', width: '300px', height: '400px', overflow: 'hidden', marginBottom: "50px" }} />
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/playlist/2GaqYQWzfs0BiRvesw5oYk?utm_source=generator&theme=0"
            width="80%"
            height="352"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
        
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const currentDateTime = new Date();
  const startOfWeek = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay());
  const endOfWeek = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() + (6 - currentDateTime.getDay()));

  const { data } = await client.request({
    
    query: `
    query getContent($startOfWeek: String, $endOfWeek: String)
    {    
        blogConnection(sort: "published", last:10, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
          edges {
            node {
              id
              title
              cover
              published
              description
              
              body
              _sys {
                filename
              }
            }
          }
        },
       
      archiveConnection(filter: {published: {after: $startOfWeek, before: $endOfWeek}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
        edges {
          node {
            id
            title
            description
            cover
            published
            _sys {
              filename
            }
          }
        }
      },
      gallery(relativePath: "photo-gallery.mdx") {
        galleryImage
    }
  }
    
    `,
    variables:
    {
      "endOfWeek": endOfWeek.toDateString(),
      "startOfWeek": startOfWeek.toDateString()
    }

  });

  return { props: { data } };
};
