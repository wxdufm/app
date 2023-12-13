import {client} from '../../tina/__generated__/client'
import EventPreview from '../../components/EventPreview'
import {
	groupEventsByWeek,
	generateStructuredData,
} from '../../components/OrganizingArchive'
import ArchiveLayout from '../../components/ArchiveLayout'
import React, {useState} from 'react'
import SeeMoreButton from '../../components/SeeMoreButton'

// page for filtering archive by event status (i.e. non-specialty shows)
const EventsCategoryPage = (props) => {
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
			<h1 className="kallisto mb-3 mt-5 text-5xl">All Events</h1>

			{structuredData.length > 0 && (
				<div>
					<div className="archive-grid">
						{structuredData.slice(0, eventsToShow).map((event) => (
							<div key={event.id}>
								{event.type === 'heading' && (
									<h3 className="mb-2 mt-10 text-3xl">
										Week of {event.weekStartDate}
									</h3>
								)}
								{event.type === 'events' && (
									<div key={event.id}>
										{event.weekEvents && (
											<div className="events-row">
												{event.weekEvents.map((event) => (
													<EventPreview
														id={event.event.id}
														key={event.event.id}
														title={event.event.title}
														cover={event.event.cover}
														subtitle={event.event.description.children[0].children[0].text.substring(
															0,
															75
														)}
														slug={event.event._sys.filename}
													/>
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

export default EventsCategoryPage

export const getStaticProps = async () => {
	const {data} = await client.request({
		query: `
      {
      archiveConnection(filter: {categories: {category: {category: {title: {eq: "Event"}}}}}, sort: "published", last:30, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u") {
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
	})

	return {
		props: {
			data,
		},
	}
}
