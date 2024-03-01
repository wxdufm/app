import {useTina} from 'tinacms/dist/react'
import {client} from '../../tina/__generated__/client'
import {TinaMarkdown} from 'tinacms/dist/rich-text'
import Link from 'next/link'
import BlogLayout from '../../components/BlogLayout'

// const components = {
// 	// google drive embedded iframe mp3
// 	AudioFileGD: (props) => {
// 		return (
// 			<>
// 				<AudioPlayerEmbed url={props.url} />
// 			</>
// 		)
// 	},
// }

// individual blog post page
const PostPage = (props) => {
	const {data, query, variables} = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const date = new Date(data.blog.published)
	const options = {month: 'long', day: 'numeric', year: 'numeric'}
	const displayDate = date.toLocaleString('en-US', options)

	return (
		<BlogLayout>
			<div className="mx-auto w-5/6 pb-10">
				{data.blog.categories && (
					<div>
						{data.blog.categories.map((category) => (
							<div className="my-2 text-neutral-400" key={category.category.id}>
								<Link
									href={`/blog/category/${category.category._sys.filename}`}
								>
									<p className="cursor-pointer hover:underline">
										{category.category.title}
									</p>
								</Link>
							</div>
						))}
					</div>
				)}
				<h1 className="kallisto mb-2 text-3xl lg:text-5xl">
					{data.blog.title}
				</h1>
				<p className="italic">{displayDate}</p>
				<h3 className="mb-3"> By {data.blog.author}</h3>
				<p className="italic lg:w-3/6 text-lg my-9">{data.blog.description}</p>
				<img
					src={data.blog.cover}
					alt=""
					width="650px"
					className="my-12 max-h-[40rem] object-cover"
				/>

				<article className="prose prose-lg text-white prose-h3:text-white prose-a:text-slate-700 prose-strong:text-slate-500 prose-h1:text-slate-500 prose-h2:text-slate-500 prose-em:italic prose-li:mb-1">
					{/* <TinaMarkdown content={data.blog.body} components={components} /> */}
					<TinaMarkdown content={data.blog.body} />
				</article>
			</div>
		</BlogLayout>
	)
}

export default PostPage

export const getStaticPaths = async () => {
	const {data} = await client.queries.blogConnection()
	const paths = data.blogConnection.edges.map((x) => {
		return {params: {slug: x.node._sys.filename}}
	})

	return {
		paths,
		fallback: 'blocking',
	}
}

export const getStaticProps = async (ctx) => {
	const {data, query, variables} = await client.queries.blog({
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
