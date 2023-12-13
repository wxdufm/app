import {TinaMarkdown} from 'tinacms/dist/rich-text'
import {tinaField, useTina} from 'tinacms/dist/react'
import {client} from '../../tina/__generated__/client'

//editable static pages (programming, contact, etc.)
export default function Home(props) {
	// data passes though in production mode and data is updated to the sidebar data in edit-mode
	const {data} = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	// store whatever is in rich text editor for that page in variable content
	const content = data.page.body

	return (
		<div>
			<div data-tina-field={tinaField(data.page, 'body')}>
				<div className="mx-auto flex w-5/6 flex-row justify-center pb-10">
					<article className="prose prose-lg text-white prose-h1:font-kallisto prose-h1:font-normal prose-h1:text-white prose-h3:text-gray-400 prose-a:text-blue-500">
						<TinaMarkdown content={content} />
					</article>
				</div>
			</div>
		</div>
	)
}

// build all the editable static pages ahead of time via github action
export const getStaticPaths = async () => {
	const {data} = await client.queries.pageConnection()
	const paths = data.pageConnection.edges.map((x) => {
		return {params: {slug: x.node._sys.filename}}
	})

	return {
		paths,
		fallback: 'blocking',
	}
}

// get relevant content via graphql
export const getStaticProps = async (ctx) => {
	const {data, query, variables} = await client.queries.page({
		relativePath: ctx.params.slug + '.mdx',
	})

	return {
		props: {
			data,
			query,
			variables,
		},
	}
}
