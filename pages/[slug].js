import {TinaMarkdown} from 'tinacms/dist/rich-text'
import {tinaField, useTina} from 'tinacms/dist/react'
import {client} from '../tina/__generated__/client'
import WeeklySchedule from '../components/WeeklySchedule'
import { scheduleBuilder } from '../lib/schedule/scheduleBuilder'

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
	const isProgrammingPage = props.slug === 'programming'

	// adds a Tina component for weekly schedule
	const components = {
		weeklySchedule: () => isProgrammingPage ? (
			<div className="not-prose relative left-1/2 mt-8 w-[80vw] -translate-x-1/2">
				<WeeklySchedule schedule={props.schedule} />
			</div>
		) : null
	}

	return (
		<div>
			<div data-tina-field={tinaField(data.page, 'body')}>
				<div className="mx-auto flex w-full flex-col items-center pb-10">
					<article className="prose prose-lg text-white prose-h1:font-kallisto prose-h1:font-normal prose-h1:text-white prose-h3:text-gray-400 prose-a:text-blue-500 prose-strong:text-slate-700">
						<TinaMarkdown content={content} components={components} />
					</article>
				</div>
			</div>
		</div>
	)
}

// build all the editable static pages ahead of time via github action
export const getStaticPaths = async () => {
	const paths = [{params: {slug: 'programming'}}]

	return {
		paths,
		fallback: 'blocking',
	}
}

// get relevant content via graphql
export const getStaticProps = async (ctx) => {
	try{
		const {data, query, variables} = await client.queries.page({
		relativePath: ctx.params.slug + '.mdx',
		})
		// loads schedule data from csv file (via lib/schedule.js) if on programming page
		// otherwise schedule is null and WeeklySchedule component won't render!
		let schedule = null
		if (ctx.params.slug === 'programming') {
			schedule = await scheduleBuilder()
		}

		return {
			props: {
				data,
				query,
				variables,
				slug: ctx.params.slug,
				schedule,
			},
		}
	}catch (err) {
		// page not found in Tina => return 404
		return { notFound: true };
	}
}
