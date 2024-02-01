import PostPreview from '../PostPreview'
import Link from 'next/link'

const BlogCarouselFull = (props) => {
	return (
		<div className="-mt-5 flex flex-col md:-mt-10 md:mr-10 lg:mt-5 lg:w-full lg:max-w-screen-xl">
			<p className="kallisto mx-auto mb-2 whitespace-nowrap text-3xl text-white md:mx-0 md:mb-4 lg:text-5xl">
				Blog Posts
			</p>

			<div className="mx-auto md:mx-0">
				<div className="scrollbar mx-auto mb-10 mt-6 flex snap-mandatory flex-col gap-6 md:mt-0 md:flex-row md:items-start md:gap-4 md:overflow-x-auto">
					{props.posts.map((post) => (
						<div key={post.node.id}>
							<PostPreview
								id={post.node.id}
								title={post.node.title}
								slug={post.node._sys.filename}
								cover={post.node.cover}
								subtitle={
									post.node.description
										? post.node.description
										: post.node.body.children[0].children[0].text.substring(
												0,
												75
											)
								}
							/>
						</div>
					))}
				</div>
				<div className="w-1/8 mx-16 rounded-3xl flex bg-neutral-800 px-3 py-2 md:mx-0 md:mb-20 md:ml-auto md:inline-block md:bg-transparent md:px-0 md:py-0 lg:w-full justify-center lg:justify-start">
					<Link href="/blog">
						<h2 className="my-1 cursor-pointer hover:underline">
							Older blog posts {'>'}
						</h2>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default BlogCarouselFull
