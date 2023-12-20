import {useTina} from 'tinacms/dist/react'
import {client} from '../../tina/__generated__/client'
import {TinaMarkdown} from 'tinacms/dist/rich-text'
import Link from 'next/link'
import ArchiveLayout from '../../components/ArchiveLayout'
import {AiFillTag} from 'react-icons/ai'

// page for a specific specialty show after it's been opened
const EventPage = (props) => {
	const {data} = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const date = new Date(data.archive.published)
	const options = {month: 'long', day: 'numeric', year: 'numeric'}
	const displayDate = date.toLocaleString('en-US', options)

	return (
		<ArchiveLayout>
			<div className="mx-auto w-full">
				<div className="row">
					<div className="column">
						<p className="kallisto mb-3 mt-5 text-3xl lg:text-5xl">
							{data.archive.title}
						</p>
						<p className="mb-5 text-xl">{displayDate}</p>

						<img
							className="my-2"
							src={data.archive.cover}
							alt=""
							width="400"
							height="400"
						/>

						<article className="prose mt-3 text-white prose-a:text-slate-700">
							<TinaMarkdown content={data.archive.description} />
						</article>

						{data.archive.categories && (
							<div className="mt-5 flex flex-col gap-3 md:flex-row md:gap-0">
								{data.archive.categories.map((category) => (
									<div
										className="mr-3 flex  cursor-pointer justify-around whitespace-nowrap rounded-2xl border border-white px-3 py-1"
										key={category.category.id}
									>
										<AiFillTag size={18} className="mr-1" />
										{category.category._sys.filename === 'event' ||
										category.category._sys.filename === 'specialty-show' ? (
											<Link
												href={`/archive/${category.category._sys.filename}s`}
											>
												<div className=" text-sm">
													{category.category.title}
												</div>
											</Link>
										) : (
											<Link
												href={`/archive/specialty-shows/${category.category._sys.filename}`}
											>
												<div className=" text-sm">
													{category.category.title}
												</div>
											</Link>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</ArchiveLayout>
	)
}

export default EventPage

export const getStaticPaths = async () => {
	const {data} = await client.queries.archiveConnection()
	const paths = data.archiveConnection.edges.map((x) => {
		return {params: {slug: x.node._sys.filename}}
	})

	return {
		paths,
		fallback: 'blocking',
	}
}

export const getStaticProps = async (ctx) => {
	const {data, query, variables} = await client.queries.archive({
		relativePath: ctx.params.slug + '.md',
	})

	return {
		props: {
			data,
			query,
			variables,
		},
	}
}
