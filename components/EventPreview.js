import Link from 'next/link'
import {AiFillTag} from 'react-icons/ai'

const EventPreview = (props) => {
	// rendered on the archive tabs
	if (!props.published) {
		return (
			<div className=" flex w-full" key={props.id}>
				<Link href={`/archive/${props.slug}`}>
					<div className="mb-5 flex w-72 cursor-pointer flex-col gap-2 lg:w-[22rem]">
						<img
							src={props.cover}
							alt=""
							className="h-72 w-72 object-cover lg:h-[22rem] lg:w-[22rem]"
						/>
						<a className="text-center text-xl font-bold">{props.title}</a>
					</div>
				</Link>
			</div>
		)
	}

	//   format date as xx/xx
	const date = new Date(props.published).toISOString()
	const arr = date.split('-')
	const arrTime = arr[2].split('T')
	const displayDate = `${arr[1]}/${arrTime[0]}`

	let displayCategories = props.categories.filter(category => category.category._sys.filename !== 'specialty-show');
	// rendered on home page with "xx/xx" before title
	return (
		<div key={props.id}>
			<Link href={`/archive/${props.slug}`}>
				<div className="mb-5 flex w-72 cursor-pointer flex-col gap-2 md:w-[22rem]">
					<img
						src={props.cover}
						alt=""
						className="h-72 w-72 object-cover md:h-[22rem] md:w-[22rem]"
					/>
					<p className="text-left text-2xl font-extrabold">{displayDate}</p>
					<p className="text-left text-xl font-bold md:h-14">{props.title}</p>
					{displayCategories.map((category) => (
						<div key={category.category._sys.filename} className="w-2/3 md:w-1/2 my-2 mr-3 flex cursor-pointer justify-start whitespace-nowrap rounded-2xl border border-slate-400 px-2 py-1">
							<AiFillTag size={18} className="mr-2" />
							<div className="text-sm text-slate-300">{category.category.title}</div>
						</div>
					))}
				</div>
			</Link>
		</div>
	)
}

export default EventPreview
