import Link from 'next/link'
import AudioPlayerStream from '../audioplayers/AudioPlayerStream'
import EventPreview from '../EventPreview'

const ArchiveCarousel = (props) => {
	return (
		<div>
			<div className="flex flex-col w-full lg:flex-row">
				<div className="-mt-5 flex flex-col justify-center md:-mt-10 md:mr-10 lg:mt-5 lg:w-4/6 lg:max-w-screen-lg">
					<p className="kallisto mx-auto mb-2 whitespace-nowrap text-3xl text-white md:mx-0 md:mb-4 lg:text-5xl">
						This Week on WXYC
					</p>

					<div className="mx-auto md:mx-0">
						<div className=" scrollbar mx-auto mb-10 mt-6 flex snap-mandatory flex-col gap-6 md:mt-0 md:flex-row md:gap-4 md:overflow-x-auto">
							{props.events.map((event) => (
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
					<div className="w-1/8 mx-auto mb-16 rounded-3xl bg-neutral-800 px-3 py-2 md:hidden">
						<Link href="/archive">
							<p className="my-1 cursor-pointer hover:underline">
								Archive {'>'}
							</p>
						</Link>
					</div>
				</div>

				{/* player */}
				<div className="ml-0 mr-3 mt-12 hidden items-start px-3 lg:flex lg:flex-col">
					<p className="kallisto text-left text-3xl">Listen Live</p>
					{/* <iframe src={`https://dj.wxyc.org/#/NowPlaying?theme=dark`} className="border-0 w-full h-[17.6rem] mt-5 mb-12 flex items-center overflow-hidden"/> */}

					<div className="pt-7">
						<AudioPlayerStream />
					</div>

					<div className="flex w-full justify-center">
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

			<div className="w-1/8 mx-auto mb-16 hidden rounded-3xl bg-neutral-800 px-3 py-2 md:mx-0 md:ml-auto md:flex md:h-full md:w-full md:items-start md:justify-start md:bg-transparent md:px-0 md:py-0">
				<Link href="/archive">
					<p className="my-1 cursor-pointer hover:underline">Archive {'>'}</p>
				</Link>
			</div>
		</div>
	)
}

export default ArchiveCarousel
