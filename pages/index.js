import { client } from "../tina/__generated__/client";
import Link from "next/link";
import PostPreview from "../components/PostPreview";
import EventPreview from "../components/EventPreview";
import PhotoGallery from "../components/PhotoGallery";
import { AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
import { FiMail } from "react-icons/fi"
import { BsSpotify } from "react-icons/bs"

//home page
export default function Home(props) {
  const posts = props.data.blogConnection.edges;
  const events = props.data.archiveConnection.edges;

  return (
    <div >
      <div className="w-5/6 mx-auto flex flex-row gap-4">
        
        {/* Left side of the screen container */}
        
        <div className="flex flex-col lg:w-4/6 w-full justify-center md:mr-10 md:mt-10 mt-0">
          <p className="text-white lg:text-5xl mb-2 md:mb-4 whitespace-nowrap text-3xl kallisto mx-auto md:mx-0">This Week on WXYC</p>
          {events && (
            //This Week on WXYC

            <div className="mx-auto md:mx-0 ">

            <div className=" md:mt-0 mt-6 mb-10 flex flex-col md:flex-row md:gap-4 gap-6 md:overflow-x-auto snap-mandatory mx-auto">
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
            </div>
            
          )}

      <div className="mx-auto  w-1/8 mb-20 bg-neutral-800 px-3 py-2 rounded-3xl md:bg-transparent md:px-0 md:py-0 md:inline-block md:mx-0 md:ml-auto">
              <Link href="/archive">
                <p className="hover:underline cursor-pointer my-1">Archive {'>'}</p>
              </Link>
                </div>
          
          <p className="text-white lg:text-5xl text-3xl mb-2 md:mb-4 whitespace-nowrap kallisto mx-auto md:mx-0">Blog Posts</p>
          {posts && (
            // Blog posts parent container
            
            <div className="md:mt-0 mt-6 mb-10 flex flex-col md:flex-row md:gap-4 gap-6 md:overflow-x-auto snap-mandatory mx-auto md:mx-0">
              
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
          
          <div className="mx-auto w-1/8 md:mb-20 bg-neutral-800 px-3 py-2 rounded-3xl md:bg-transparent md:px-0 md:py-0 md:inline-block md:mx-0 md:ml-auto">
          <Link href="/blog">
              <h2 className="hover:underline cursor-pointer my-1">Older blog posts {'>'}</h2>
          </Link>
          </div>

          
        </div>

       

        {/* Right side of the screen container */}

        <div className="hidden lg:flex lg:flex-col mr-3 mt-12 ">

        <p className="kallisto text-3xl text-left">Listen Live</p>

        <iframe src={`https://dj.wxyc.org/#/NowPlaying?theme=dark`} className="border-0 w-full h-[25rem] overflow-hidden mt-5 mb-12"/>

         
        <div className="mx-auto bg-gradient-to-b from-neutral-200 to-neutral-400 hover:text-neutral-700 text-black  w-5/6 flex flex-col justify-center items-center h-16 border-0 rounded-3xl mt-10 text-xl ">
          <div>

        <Link href="/page/contact" scroll={false} >Submit a PSA!</Link>

          </div>
        </div>

        </div>
      </div>

      <div className=" hidden md:visible md:flex justify-center items-center mx-auto w-2/3 mt-20">
    
    <PhotoGallery/>
  </div>

  {/* Social media links footer */}
  <div className="w-full flex justify-center items-center gap-8 md:gap-24 mt-12 pb-10">
    <a target="_blank"  href="https://www.instagram.com/wxyc893/?hl=en"><AiFillInstagram size={44} className="ml-.5 mt-0.5" /></a>
    <a  target="_blank"  href="https://twitter.com/wxyc?lang=en"><AiFillTwitterCircle size={44} className="ml-.5 mt-0.5" /></a>
    <Link href="/page/contact" legacyBehavior={false}> <FiMail  size={44} className="ml-.5 mt-0.5" /></Link>
    <a  target="_blank" href="https://open.spotify.com/user/wxyc?si=f9cf2c3eff10462e"> <BsSpotify  size={44} className="ml-;5 mt-0.5" /></a>
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