import { client } from "../tina/__generated__/client";
import Link from "next/link";
import PostPreview from "../components/PostPreview";
import EventPreview from "../components/EventPreview";
import PhotoGallery from "../components/PhotoGallery";


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
    <div>
      <div className="w-5/6 mx-auto flex flex-row gap-4">
        
        {/* Left side of the screen container */}
        
        <div className="flex flex-col md:w-4/6 w-full justify-center mr-10 mt-10">
          <p className="text-white md:text-5xl mb-2 whitespace-nowrap text-4xl kallisto mx-auto md:mx-0">This Week on WXYC</p>
          {events && (
            //This Week on WXYC
            <div className="md:mt-0 mt-6 mb-10 flex flex-col md:flex-row md:gap-4 gap-6 md:overflow-x-scroll snap-mandatory mx-auto">
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

      <div className="mx-auto w-1/8 mb-20 bg-neutral-800 px-3 py-2 rounded-3xl md:bg-transparent md:px-0 md:py-0 md:inline-block md:mx-0 md:ml-auto">
              <Link href="/archive">
                <p className="hover:underline">Archive {'>'}</p>
              </Link>
                </div>
          
          <p className="text-white md:text-5xl text-4xl mb-2 whitespace-nowrap kallisto mx-auto md:mx-0">Blog Posts</p>
          {posts && (
            // Blog posts parent container
            
            <div className="md:mt-0 mt-6 mb-10 flex flex-col md:flex-row md:gap-4 gap-6 md:overflow-x-scroll snap-mandatory mx-auto md:mx-0">
              
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
          
          <div className="mx-auto w-1/8 mb-20 bg-neutral-800 px-3 py-2 rounded-3xl md:bg-transparent md:px-0 md:py-0 md:inline-block md:mx-0 md:ml-auto">
          <Link href="/blog">
              <h2 class="hover:underline">Older blog posts {'>'}</h2>
          </Link>
          </div>

          <div className="w-full invisible md:visible">
              <PhotoGallery images={images} />
            </div>
        </div>

       

         

        <div className="hidden md:block">
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

        <Link href="/contact" scroll={false} >Submit a PSA!</Link>

        </div>
          
      </div>
    </div>
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
        blogConnection(sort: "published", last:3, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
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
