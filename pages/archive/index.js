import EventPreview from '../../components/EventPreview'
import {client} from '../../tina/__generated__/client'
import {
	groupEventsByWeek,
	generateStructuredData,
} from '../../components/OrganizingArchive'
// import LazyLoad from 'react-lazyload';
import ArchiveDropdown from '../../components/DropdownArchive'
import ArchiveLayout from '../../components/ArchiveLayout'
import photo from '/images/crowd.jpg'
import mobilephoto from '/images/crowdmobile.jpeg'
import Image from 'next/image'
import React, {useState} from 'react'
import SeeMoreButton from '../../components/SeeMoreButton'

// archive home page
export default function EventList(props) {
	const [eventsToShow, setEventsToShow] = useState(20)

	const loadMoreEvents = () => {
		setEventsToShow(eventsToShow + 20)
	}

	const eventsList = props.data.archiveConnection.edges
	const groupedEvents = groupEventsByWeek(eventsList)
	const structuredData = generateStructuredData(groupedEvents)

	let specialtyShows = []
	props.data.categoryConnection.edges.forEach((category) => {
		specialtyShows.push({
			label: category.node.title,
			value: category.node._sys.filename,
		})
	})

	return (
		<ArchiveLayout>
			<div className="relative z-20 -mt-2 flex w-full flex-col items-center justify-between md:w-5/6 md:flex-row">
				<div className="relative z-20 mt-5 text-sm md:text-base">
					An archive of WXYC&apos;s weekly specialty shows and events.{' '}
					<a href="../page/programming" className="underline">
						Learn more about WXYC&apos;s specialty programming.
					</a>
				</div>
				<div className="mt-3">
					<ArchiveDropdown specialtyShows={specialtyShows} />
				</div>
			</div>

			{/* Desktop banner image */}
			<div className="relative z-10 -mt-10 hidden md:block">
				<Image src={photo} alt="A crowded dancefloor at a WXYC event." />
			</div>

			{/* Mobile banner image */}
			<div className="relative z-10 -mt-10 md:hidden">
				<Image src={mobilephoto} alt="A crowded dancefloor at a WXYC event." />
			</div>

			<div className="archive-grid mx-auto">
				{structuredData.slice(0, eventsToShow).map((event) => (
					<div key={event.id}>
						{event.type === 'heading' && (
							<p className="mb-2 mt-10 text-3xl font-bold">
								Week of {event.weekStartDate}
							</p>
						)}
						{event.type === 'events' && (
							// needs unique key somehow
							<div>
								{event.weekEvents && (
									<div className="bg flex flex-row justify-start gap-2 overflow-x-scroll md:gap-4 scrollbar">
										{event.weekEvents.map((event) => (
											<div key={event.event.id}>
												{/* <LazyLoad height={200} once={true}> */}
												<EventPreview
													id={event.event.id}
													title={event.event.title}
													cover={event.event.cover}
													subtitle={event.event.description.children[0].children[0].text.substring(
														0,
														75
													)}
													slug={event.event._sys.filename}
												/>
												{/* </LazyLoad> */}
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>

			{eventsToShow < structuredData.length && (
				<SeeMoreButton onClick={loadMoreEvents} />
			)}
		</ArchiveLayout>
	)
}

export const getStaticProps = async () => {
	const currentDateTime = new Date()
	const endOfWeek = new Date(
		currentDateTime.getFullYear(),
		currentDateTime.getMonth(),
		currentDateTime.getDate() + (6 - currentDateTime.getDay())
	)

	const length = await client.request({
		query: `{
      archiveConnection {
        totalCount
      }
    }
    `,
	})

	const {data} = await client.request({
		query: `
    query getContent($eventCount: Float, $endOfWeek: String)
    {
      archiveConnection(filter: {published: {before: $endOfWeek}}, sort: "published", last: $eventCount, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
        edges {
          node {
            id
            title
            cover
            published
            description
            _sys {
              filename
            }
          }
        }
      },
      categoryConnection(filter: {specialtyShow: { eq:true}}) {
        edges {
          node {
            id
            title
            _sys {
              filename
            }
          }
        }
      }
    }
    `,
		variables: {
			eventCount: length.data.archiveConnection.totalCount,
			endOfWeek: endOfWeek.toDateString(),
		},
	})

	return {
		props: {
			data,
		},
	}
}
