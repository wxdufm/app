import {client} from '../tina/__generated__/client'
import PhotoGallery from '../components/homepage/PhotoGallery'
import ArchiveCarousel from '../components/homepage/ArchiveCarousel'
import BlogCarouselFull from '../components/homepage/BlogCarouselFull'
	import {useTina, tinaField} from 'tinacms/dist/react'
import HomepageBanner from '../components/HomepageBanner'
import Link from 'next/link'
import photo from '../images/logo.png'
import Image from 'next/image'
import StreamButton from '../components/audioplayers/StreamButton'
import CDLink from '../components/homepage/CDLink'
import IpodWidget from '../components/homepage/IpodWidget'
import TodaySchedule from '../components/homepage/TodaySchedule'
import ShowCalendar from "../components/homepage/ShowCalendar"


// home page
export default function Home(props) {
	const { data: pageData } = useTina({
		query: props.pageQuery,
		variables: props.pageVariables,
		data: props.pageData,
	})

	const bannerColumns = pageData?.page?.homepageBanner?.columns || []
	const bannerAboveLogo = pageData?.page?.homepageBanner?.aboveLogo || []
	const bannerBelowLogo = pageData?.page?.homepageBanner?.belowLogo || []
	const posts = props.data.blogConnection.edges
	const events = props.data.archiveConnection.edges
	const schedule = props.schedule

	return (
		<div>
			<div data-tina-field={pageData?.page ? tinaField(pageData.page, 'homepageBanner') : undefined} className="pt-28 lg:pt-0 lg:px-16">
				{/* HomepageBanner is a component for adding a closeable banner announcement to the homepage. Toggle on or off in Components > HomepageBanner.js */}
				<HomepageBanner columns={bannerColumns} aboveLogo={bannerAboveLogo} belowLogo={bannerBelowLogo} />
			</div>
			{/* Header with WXDU logo lives here */}
			<div className="mx-auto lg:flex hidden w-full flex-col items-start justify-center pt-10 md:mb-10 md:pt-2 ">
					{/* Header text parent container */}
					<div className="mb-20 lg:mb-5 flex  w-full cursor-pointer flex-col items-center justify-center pt-20 md:flex-row md:items-end md:pt-20 lg:pt-1">
						{/* Actual header text */}
						<div className="flex w-full flex-col items-center justify-center md:w-3/4 md:pt-4 lg:w-full lg:pt-1">
							<div className="mt-4 flex flex-row justify-between gap-4 items-start px-2 w-full" style={{ zoom: 1.1 }}>
								<div className="flex-[5]">
									<TodaySchedule schedule={schedule} />
								</div>
								<div className="flex flex-col items-end gap-2 flex-[2]" style={{ zoom: 0.85 }}>
									<IpodWidget />
									<StreamButton />
									{/* CDs (fillers for now) that link to important pages */}
								<div className="flex flex-row justify-between gap-2 mt-4 w-full">
									<CDLink href="/blog" label="blog posts" image="/CD_1_Filler.jpg" />
									<CDLink href="/programming" label="programming" image="/CD_2_Filler.jpg" />
									<CDLink href="/about" label="about" image="/CD_3_Filler.jpg" />
								</div>
								
							</div>
							</div>
						</div>
					</div>

				</div>

			{/* Mobile layout — hidden on desktop */}
			<div className="lg:hidden flex flex-col items-center gap-8 px-8 pt-1 pb-16">
				<div className="flex flex-col items-center gap-2 w-full">
					<StreamButton />
					<IpodWidget />
		
				</div>
				<TodaySchedule schedule={schedule} />
				<div className="flex flex-row justify-between gap-1 mt-4 w-full">
						<CDLink href="/blog" label="blog posts" image="/CD_1_Filler.jpg" />
						<CDLink href="/programming" label="programming" image="/CD_2_Filler.jpg" />
						<CDLink href="/about" label="about" image="/CD_3_Filler.jpg" />
				</div>
				
			</div>

			<div className="mx-auto flex w-full flex-col gap-4">
<div className="mt-6">
    <ShowCalendar />
</div>

			<div className="mx-auto flex w-5/6 flex-col gap-4">
				<div className="-mt-5 flex w-full flex-col justify-center md:-mt-10 md:mr-10 lg:mt-5">
					
					

					{/* if no events: just blog posts + player */}
					{events.length === 0 && posts && (
						<BlogCarouselFull posts={posts} />
					)}

					{/* if yes events: events + player
					{events.length > 0 && <ArchiveCarousel events={events} />} */}
					{/* ^ disables archive carousel, since WXDU doesn't use this function */}

					{/* if yes events: blog posts full row */}
					{events.length > 0 && posts && <BlogCarouselFull posts={posts} />}

					{/* "Submit a PSA" button on mobile */}
					<div className="lg:hidden flex w-full justify-center"> 
						<div className="mx-auto mt-10 flex h-16 w-4/6 md:w-2/6 flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-neutral-200 to-neutral-400 text-xl text-black hover:text-neutral-700 lg:mx-0 ">
							<div>
								<a href="mailto:psa@wxdu.org" scroll={false}>
									Submit a PSA!
								</a>
							</div>
						</div>
					</div>
					
					{/* Photo gallery */}
					<div className="mx-auto mt-16 hidden w-full items-center justify-center md:visible md:flex">
						<PhotoGallery />
					</div>
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
	const pageResult = await client.queries.page({
		relativePath: 'home.mdx',
	})

	const {data} = await client.request({
		query: `
    query getContent($startOfWeek: String, $endOfWeek: String)
    {    
        blogConnection(sort: "published", last:6){
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
	const { scheduleBuilder } = await import('../lib/schedule/scheduleBuilder')
	const schedule = await scheduleBuilder()
	return {
		props: {
			data,
			schedule,
			pageData: pageResult.data,
			pageQuery: pageResult.query,
			pageVariables: pageResult.variables,
		},
	}
}