import { Layout } from "../components/Layout";
import { client } from "../tina/__generated__/client";
import Link from "next/link";
import PostPreview from "../components/PostPreview";
import EventPreview from "../components/EventPreview";
import PhotoGallery from "../components/PhotoGallery";
import InstagramEmbed from "../components/InstagramEmbed";


//home page
export default function Home(props) {
  const posts = props.data.blogConnection.edges;
  const events = props.data.archiveConnection.edges;

  // console.log(props.data.page.body)
  const images = [
    'http://localhost:3000/uploads/IMG_8649-700x500.jpeg',
    'http://localhost:3000/uploads/kickball-700x500.jpeg',
    'http://localhost:3000/uploads/R1-02256-004A-768x519-700x500.jpeg',
    'http://localhost:3000/uploads/R1-03649-030A-700x500.png',
    'http://localhost:3000/uploads/R1-02408-024A-700x500.jpeg'
  ];

  return (
    <Layout>
      <div className="w-5/6 mx-auto flex flex-row gap-4">
        
        {/* Left side of the screen container */}
        
        <div className="flex flex-col w-4/6 justify-center mr-10 mt-10">
          <p className="text-white text-2xl">This Week on WXYC</p>
          {events && (
            //This Week on WXYC
            <div className="mb-10 flex flex-row gap-4 overflow-x-scroll snap-mandatory">
              {events.map((event) => (
                //Event previews
                <div key={event.node.id}>
                <EventPreview
                id={event.node.id}
                title={event.node.title}
                cover={event.node.cover}
                subtitle={event.node.description.children[0].children[0].text.substring(0, 75)}
                published={event.node.published}
                slug={event.node._sys.filename}
              />
              
              
              </div>
              ))}
             
            </div>
            
          )}

      <div className=" ml-auto w-1/8">
              <Link href="/archive">
                <p>Archive {'>'}</p>
              </Link>
                </div>


          

          
          <p className="text-white text-2xl">Blog Posts</p>
          {posts && (
            // Blog posts parent container
            <div className="mb-10 flex gap-4 overflow-x-scroll snap-mandatory">
              {posts.map((post) => (
                // Blog post previews
                <div key={post.node.id}>
                <PostPreview 
                id={post.node.id} 
                title={post.node.title} 
                slug={post.node._sys.filename} 
                cover={post.node.cover} 
                subtitle={ post.node.description ? post.node.description : post.node.body.children[0].children[0].text.substring(0, 75)}
              />
              </div>
              ))}
            </div>
          )}
          
          <div className=" ml-auto w-1/8 mb-20">
          <Link href="/blog">
              <h2>Blog {'>'}</h2>
          </Link>
          </div>

          <div className="w-full">
              <PhotoGallery images={images} />
            </div>
        </div>

       

         

        <div className="">
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

          <InstagramEmbed/>
        </div>
          
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const currentDateTime = new Date();
  const startOfWeek = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() - currentDateTime.getDay() - 1);
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
