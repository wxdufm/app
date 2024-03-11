import {client} from '../../../tina/__generated__/client'
import EventPreview from '../../../components/EventPreview'
import {
	groupEventsByWeek,
	generateStructuredData,
} from '../../../components/OrganizingArchive'
import Link from 'next/link'
import ArchiveLayout from '../../../components/ArchiveLayout'
import React, {useState} from 'react'
import SeeMoreButton from '../../../components/SeeMoreButton'

// page filtering for all specialty shows
const SpecialtyShowsPage = (props) => {
	const [eventsToShow, setEventsToShow] = useState(20)

	const loadMoreEvents = () => {
		setEventsToShow(eventsToShow + 20)
	}

	let structuredData = []
	let sortedEvents = []

	if (props.data.archiveConnection.edges.length > 0) {
		props.data.archiveConnection.edges.forEach((event) => {
			sortedEvents.push(event)
		})
		const groupedEvents = groupEventsByWeek(sortedEvents)
		structuredData = generateStructuredData(groupedEvents)
	}

	let specialtyShows = []
	props.data.categoryConnection.edges.forEach((category) => {
		specialtyShows.push({
			label: category.node.title,
			value: category.node._sys.filename,
		})
	})

	return (
		<ArchiveLayout specialtyShows={specialtyShows}>
			<h1 className="kallisto my-2 text-5xl">All Specialty Shows</h1>
			<p className="mb-10 text-lg">
				Click{' '}
				<Link href="../programming">
					<u className="cursor-pointer">here</u>
				</Link>{' '}
				for a list of all specialty shows and their descriptions.
			</p>

			{structuredData.length > 0 && (
				<div>
					<div className="archive-grid mx-auto w-full">
						{structuredData.slice(0, eventsToShow).map((event) => (
							<div key={event.id}>
								{event.type === 'heading' && (
									<h3 className="mb-2 mt-10 text-3xl font-bold">
										Week of {event.weekStartDate}
									</h3>
								)}
								{event.type === 'events' && (
									<div key={event.id}>
										{event.weekEvents && (
											<div className="bg scrollbar flex flex-row justify-start gap-2 overflow-x-auto md:gap-4">
												{event.weekEvents.map((event) => (
													<div key={event.event.id}>
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
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{eventsToShow < structuredData.length && (
				<SeeMoreButton onClick={loadMoreEvents} />
			)}
		</ArchiveLayout>
	)
}

export default SpecialtyShowsPage

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
		query getContent($endOfWeek:String, $eventCount: Float)  
		{
		  archiveConnection(filter: {categories: {category: {category: {title: {eq: "Specialty Show"}}}}, published: {before: $endOfWeek}}, sort: "published", last:$eventCount, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
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
  }`,
		variables: {
			endOfWeek: endOfWeek.toDateString(),
			eventCount: length.data.archiveConnection.totalCount,
		},
	})

	return {
		props: {
			data,
		},
	}
}
