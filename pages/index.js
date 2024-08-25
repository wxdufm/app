import {client} from '../tina/__generated__/client'
import PhotoGallery from '../components/homepage/PhotoGallery'
import ArchiveCarousel from '../components/homepage/ArchiveCarousel'
import BlogCarouselCropped from '../components/homepage/BlogCarouselCropped'
import BlogCarouselFull from '../components/homepage/BlogCarouselFull'
import AudioPlayerStream from '../components/audioplayers/AudioPlayerStream'
import HomepageBanner from '../components/HomepageBanner'

// home page
export default function Home(props) {
	const posts = props.data.blogConnection.edges
	const events = props.data.archiveConnection.edges

	return (
		<div>
			<div>
				<HomepageBanner />
			</div>

			<div className="mx-auto flex w-5/6 flex-col gap-4">
				<div className="-mt-5 flex w-full flex-col justify-center md:-mt-10 md:mr-10 lg:mt-5 ">
					<div className="mb-20 flex justify-center lg:hidden"> 
						<AudioPlayerStream />
						{/* <iframe src={`https://dj.wxyc.org/#/NowPlaying?theme=dark`} className="border-0 w-full h-[17.6rem] overflow-hidden mb-12 mt-16"/> */}
					</div>

					{/* if no events: just blog posts + player */}
					{events.length === 0 && posts && (
						<BlogCarouselCropped posts={posts} />
					)}

					{/* if yes events: events + player */}
					{events.length > 0 && <ArchiveCarousel events={events} />}

					{/* if yes events: blog posts full row */}
					{events.length > 0 && posts && <BlogCarouselFull posts={posts} />}

					{/* "Submit a PSA" button on moblie */}
					<div className="lg:hidden flex w-full justify-center"> 
						<div className="mx-auto mt-10 flex h-16 w-4/6 md:w-2/6 flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-neutral-200 to-neutral-400 text-xl text-black hover:text-neutral-700 lg:mx-0 ">
							<div>
								<a href="mailto:psa@wxyc.org" scroll={false}>
									Submit a PSA!
								</a>
							</div>
						</div>
					</div>

					<div className="mx-auto mt-16 hidden w-5/6 items-center justify-center md:visible md:flex">
						<PhotoGallery />
					</div>
				</div>
			</div>
		</div>
	)
}

export const getStaticProps = async () => {
	const currentDateTime = new Date()
	const startOfWeek = new Date(
		currentDateTime.getFullYear(),
		currentDateTime.getMonth(),
		currentDateTime.getDate() - currentDateTime.getDay() - 1
	)
	const endOfWeek = new Date(
		currentDateTime.getFullYear(),
		currentDateTime.getMonth(),
		currentDateTime.getDate() + (8 - currentDateTime.getDay())
	)
	const {data} = await client.request({
		query: `
    query getContent($startOfWeek: String, $endOfWeek: String)
    {    
        blogConnection(sort: "published", last:6, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
          edges {
            node {
              id
              title
              cover
              published
              description
			  categories {
				category {
		  			... on Category {
						_sys {
							filename
						}
						title
					}
  				}
			}
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
            cover
            published
			categories {
				category {
		  			... on Category {
						_sys {
							filename
						}
						title
					}
  				}
			}
            _sys {
              filename
            }
          }
        }
      },
  }
    
    `,
		variables: {
			endOfWeek: endOfWeek.toDateString(),
			startOfWeek: startOfWeek.toDateString(),
		},
	})

	return {props: {data}}
}
