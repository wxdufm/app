import Link from 'next/link'
import {useRouter} from 'next/router'
import {AiFillTag} from 'react-icons/ai'

// used for any pages of lists of blog posts
const PostPreview = (props) => {
	const currentRoute = useRouter().asPath

	if (
		currentRoute === '/blog' ||
		currentRoute === '/blog/category/album-review' ||
		currentRoute === '/blog/category/show-review' ||
		currentRoute === '/blog/category/artist-interview'
	) {
		return (
			<Link href={`/blog/${props.slug}`}>
				<div
					key={props.id}
					className="mb-5 flex w-72 cursor-pointer flex-col gap-2 lg:w-[23.5rem]"
				>
					<img
						src={props.cover}
						className="h-72 w-72 object-cover lg:h-[23.5rem] lg:w-[23.5rem]"
						alt=""
					/>
					<a className="text-left text-xl font-bold">{props.title}</a>
					<p>{props.subtitle}</p>
				</div>
			</Link>
		)
	} else {
		// home page

		let displayCategories 
		if (props.categories) {
			displayCategories = props.categories.filter(category => category.category._sys.filename !== 'specialty-show');
		}
	
	
		return (
			<Link href={`/blog/${props.slug}`}>
				<div
					key={props.id}
					className="mb-5  flex w-72 cursor-pointer flex-col gap-2 md:w-[22rem]"
				>
					<img
						src={props.cover}
						className="h-72 w-72 object-cover md:h-[22rem] md:w-[22rem]"
						alt=""
					/>
					<a className="text-left text-xl font-bold md:h-14">{props.title}</a>
					<p>{props.subtitle}</p>
					{displayCategories && displayCategories.map((category) => (
						<div key={category.category._sys.filename} className="my-2 flex cursor-pointer justify-start whitespace-nowrap">
							
							<div className="flex rounded-full border border-slate-400 pl-1 pr-3 py-1 text-sm text-slate-100"><AiFillTag size={18} className="mr-3 mt-0.5" />{category.category.title}</div>
						</div>
					))}
				</div>
			</Link>
		)
	}
}

export default PostPreview
