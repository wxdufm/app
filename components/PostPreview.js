import Link from 'next/link'

// used for any pages of lists of blog posts
const PostPreview = (props) => {
	return (
		<Link href={`/blog/${props.slug}`}>
			<div
				key={props.id}
				className="flex w-80 cursor-pointer flex-col gap-2 lg:w-[22rem]"
			>
				<img
					src={props.cover}
					className="h-80 w-80 object-cover lg:h-[22rem] lg:w-[22rem]"
					alt=""
				/>
				<a className="h-12 text-center text-xl font-bold">{props.title}</a>
				<p>{props.subtitle}...</p>
			</div>
		</Link>
	)
}

export default PostPreview
