import {TinaMarkdown} from 'tinacms/dist/rich-text'
import {tinaField, useTina} from 'tinacms/dist/react'
import {client} from '../../tina/__generated__/client'
import AboutLayout from '../../components/AboutLayout'

// about default page itself
export default function About(props) {
	const {data} = useTina({
		query: props.query,
		variables: props.variables,
		data: props.data,
	})

	const content = data.page.body

	return (
		<AboutLayout>
			<div data-tina-field={tinaField(data.page, 'body')}>
				<div className="mx-auto flex w-5/6 flex-row justify-center pb-10">
					<article className="prose prose-lg text-white prose-h1:font-kallisto prose-h1:text-5xl prose-h1:font-normal prose-h1:text-white prose-h3:font-normal prose-h3:text-white prose-a:text-blue-500">
						<TinaMarkdown content={content} />
					</article>
				</div>
			</div>
		</AboutLayout>
	)
}

export const getStaticProps = async (ctx) => {
	const {data, query, variables} = await client.queries.page({
		relativePath: 'about.mdx',
	})

	return {
		props: {
			data,
			query,
			variables,
		},
	}
}
