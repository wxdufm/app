import Link from 'next/link'
import AudioPlayerStream from '../audioplayers/AudioPlayerStream'
import EventPreview from '../EventPreview'

const ArchiveCarousel = (props) => {
	return (
		<div>
			   {/* Div below is container for archive carousel only on desktop */}
				<div className="-mt-5 flex flex-col md:-mt-10 md:mr-10 lg:mt-5 lg:w-full lg:max-w-screen-xl">
					<p className="kallisto mx-auto mb-2 whitespace-nowrap text-3xl text-white md:mx-0 md:mb-4 lg:text-5xl">
						This Week on WXYC
					</p>

					<div className="mx-auto md:mx-0">
						<div className=" scrollbar mx-auto mb-10 mt-6 flex snap-mandatory flex-col gap-6 md:mt-0 md:flex-row md:gap-4 md:overflow-x-auto">
							{props.events.map((event) => (
								//Content is formatted in EventPreview.js
								<div key={event.node.id}>
									<EventPreview
										id={event.node.id}
										title={event.node.title}
										cover={event.node.cover}
										published={event.node.published}
										slug={event.node._sys.filename}
										categories={event.node.categories}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Link to /archive on mobile */}
					<div className="w-1/8 mx-auto mb-16 rounded-3xl bg-neutral-800 px-3 py-2 md:hidden">
						<Link href="/archive">
							<p className="my-1 cursor-pointer hover:underline">
								Archive {'>'}
							</p>
						</Link>
					</div>
				</div>

				
			

		   {/* Link to /archive on desktop */}
			<div className="w-1/8 mx-auto mb-16 hidden bg-neutral-800 px-3 py-2 md:mx-0 md:ml-auto md:flex md:h-full md:w-full md:items-start md:justify-start md:bg-transparent md:px-0 md:py-0">
				<Link href="/archive">
					<p className="my-1 cursor-pointer hover:underline">Archive {'>'}</p>
				</Link>
			</div>
		</div>
	)
}

export default ArchiveCarousel
