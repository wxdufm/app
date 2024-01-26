import {client} from '../tina/__generated__/client'
import Link from 'next/link'
import PostPreview from '../components/PostPreview'
import EventPreview from '../components/EventPreview'
import PhotoGallery from '../components/PhotoGallery'
import {AiFillInstagram, AiFillTwitterCircle} from 'react-icons/ai'
import {FaTiktok} from 'react-icons/fa'
import {FiMail} from 'react-icons/fi'
import {BsSpotify} from 'react-icons/bs'
import AudioPlayerStream from '../components/AudioPlayerStream'
import { FaApple } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";

// home page
export default function Home(props) {
	const posts = props.data.blogConnection.edges
	const events = props.data.archiveConnection.edges

	return (
		<div>
			<div className="mx-auto flex w-5/6 flex-row gap-4">
				{/* Left side of the screen container - all mobile content lives here */}

				<div className="-mt-5 md:-mt-10 lg:mt-5 flex w-full flex-col justify-center md:mr-10 lg:w-4/6">
					<div className="mb-2 flex justify-center lg:hidden">
						<AudioPlayerStream />
						{/* <iframe src={`https://dj.wxyc.org/#/NowPlaying?theme=dark`} className="border-0 w-full h-[17.6rem] overflow-hidden mb-12 mt-16"/> */}
						
					</div>

					<div className="w-full md:w-1/2 md:mx-auto flex flex-col md:flex-row mt-2 lg:hidden">
						<div className="flex flex-row items-center justify-center">
						<a target="_blank" href="https://play.google.com/store/apps/details?id=org.wxyc.WXYCCH&pcampaignid=web_share">
							<DiAndroid size={44} className="mr-6 hover:text-gray-400"/>
						</a>
					<a target="_blank" href="https://apps.apple.com/us/app/wxyc-radio/id353182815">
						<FaApple size={44} className="hover:text-gray-400"/>
					</a>
						</div>
						<p className="mt-5 mb-5 w-5/6 mx-auto text-center">Listen on our mobile app, available for Apple and Android</p>
					</div>

					

					{events.length > 0 && (
						//This Week on WXYC
						<>
							<p className="kallisto mx-auto mb-2 whitespace-nowrap text-3xl text-white md:mx-0 md:mb-4 lg:text-5xl">
								This Week on WXYC
							</p>
							<div className="mx-auto md:mx-0">
								<div className=" mx-auto mb-10 mt-6 flex snap-mandatory flex-col gap-6 md:mt-0 md:flex-row md:gap-4 md:overflow-x-auto">
									{events.map((event) => (
										//Event previews
										<div key={event.node.id}>
											<EventPreview
												id={event.node.id}
												title={event.node.title}
												cover={event.node.cover}
												subtitle={event.node.description.children[0].children[0].text.substring(
													0,
													75
												)}
												published={event.node.published}
												slug={event.node._sys.filename}
											/>
										</div>
									))}
								</div>
							</div>
							<div className="w-1/8  mx-auto mb-16 rounded-3xl bg-neutral-800 px-3 py-2 md:mx-0 md:ml-auto md:inline-block md:bg-transparent md:px-0 md:py-0">
								<Link href="/archive">
									<p className="my-1 cursor-pointer hover:underline">
										Archive {'>'}
									</p>
								</Link>
							</div>
						</>
					)}

					<p className="kallisto mx-auto mb-2 whitespace-nowrap text-3xl text-white md:mx-0 md:mb-4 lg:text-5xl">
						Blog Posts
					</p>
					{posts && (
						// Blog posts parent container

						<div className="mx-auto mb-10 mt-6 flex snap-mandatory flex-col gap-6 md:mx-0 md:mt-0 md:flex-row md:gap-4 md:overflow-x-auto">
							{posts.map((post) => (
								// Blog post previews

								<div key={post.node.id}>
									<PostPreview
										id={post.node.id}
										title={post.node.title}
										slug={post.node._sys.filename}
										cover={post.node.cover}
										subtitle={
											post.node.description
												? post.node.description
												: post.node.body.children[0].children[0].text.substring(
														0,
														75
													)
										}
									/>
								</div>
							))}
						</div>
					)}

					<div className="w-1/8 mx-auto rounded-3xl bg-neutral-800 px-3 py-2 md:mx-0 md:mb-20 md:ml-auto md:inline-block md:bg-transparent md:px-0 md:py-0">
						<Link href="/blog">
							<h2 className="my-1 cursor-pointer hover:underline">
								Older blog posts {'>'}
							</h2>
						</Link>
					</div>
				</div>

				{/* Right side of the screen container - DESKTOP ONLY */}

				<div className="mr-3 mt-12 hidden items-start lg:flex lg:flex-col ">
					<p className="kallisto text-left text-3xl">Listen Live</p>

					{/* <iframe src={`https://dj.wxyc.org/#/NowPlaying?theme=dark`} className="border-0 w-full h-[17.6rem] mt-5 mb-12 flex items-center overflow-hidden"/> */}

					<div className="pt-7">
						<AudioPlayerStream />
					</div>

							
					<div className="w-full flex flex-col mt-5">
						<div className="flex flex-row items-center justify-center">
						<a target="_blank" href="https://play.google.com/store/apps/details?id=org.wxyc.WXYCCH&pcampaignid=web_share">
							<DiAndroid size={48} className="mr-7 hover:text-gray-400"/>
						</a>

						<a target="_blank" href="https://apps.apple.com/us/app/wxyc-radio/id353182815">
						<FaApple size={44} className="hover:text-gray-400"/>
					</a>
						</div>
						<p className="mt-5 text-sm w-5/6 mx-auto text-center">Listen on our mobile app, available for Apple and Android</p>
					</div>
					
					<div className="w-full flex justify-center">					
					<div className="mx-auto mt-10 flex h-16 w-4/6 flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-neutral-200 to-neutral-400 text-xl text-black hover:text-neutral-700 lg:mx-0 ">
						<div>
							<Link href="mailto:psa@wxyc.org" scroll={false}>
								Submit a PSA!
							</Link>
						</div>
					</div>
					</div>
				</div>
			</div>

			<div className=" mx-auto mt-16 hidden w-2/3 items-center justify-center md:visible md:flex">
				<PhotoGallery />
			</div>

			{/* Social media links footer */}
			<div className="mt-12 flex w-full items-center justify-center gap-8 pb-10 md:gap-24">
				<a target="_blank" href="https://instagram.com/wxyc893">
					<AiFillInstagram size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="https://twitter.com/wxyc">
					<AiFillTwitterCircle size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="https://tiktok.com/@wxyc893">
					<FaTiktok size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="mailto:info@wxyc.org">
					{' '}
					<FiMail size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="https://open.spotify.com/user/wxyc">
					{' '}
					<BsSpotify size={44} className="ml-;5 mt-0.5" />
				</a>
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
		currentDateTime.getDate() + (6 - currentDateTime.getDay())
	)
	const {data} = await client.request({
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
		variables: {
			endOfWeek: endOfWeek.toDateString(),
			startOfWeek: startOfWeek.toDateString(),
		},
	})

	return {props: {data}}
}
