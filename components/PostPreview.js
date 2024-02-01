import Link from 'next/link'
import {useRouter} from 'next/router'

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
					className="mb-5 flex w-72 cursor-pointer flex-col gap-2 lg:w-[23rem]"
				>
					<img
						src={props.cover}
						className="h-72 w-72 object-cover lg:h-[23rem] lg:w-[23rem]"
						alt=""
					/>
					<a className="h-12 text-center text-xl font-bold">{props.title}</a>
					<p>{props.subtitle}...</p>
				</div>
			</Link>
		)
	} else {
		return (
			<Link href={`/blog/${props.slug}`}>
				<div
					key={props.id}
					className="mb-5 flex w-72 cursor-pointer flex-col gap-2 lg:w-[21rem]"
				>
					<img
						src={props.cover}
						className="h-72 w-72 object-cover lg:h-[21rem] lg:w-[21rem]"
						alt=""
					/>
					<a className="h-12 text-center text-xl font-bold">{props.title}</a>
					<p>{props.subtitle}...</p>
				</div>
			</Link>
		)
	}
}

export default PostPreview
