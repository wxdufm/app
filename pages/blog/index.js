import {client} from '../../tina/__generated__/client'
import PostPreview from '../../components/PostPreview.js'
// import LazyLoad from 'react-lazyload';
import BlogLayout from '../../components/BlogLayout'
import photo from '/images/concert.jpg'
import mobilephoto from '/images/concertmobile.jpg'
import Image from 'next/image'
import React, {useState} from 'react'
import Link from 'next/link'
import SeeMoreButton from '../../components/SeeMoreButton.js'

//blog home page
export default function PostList(props) {
	const [postsToShow, setPostsToShow] = useState(18)

	const loadMorePosts = () => {
		setPostsToShow(postsToShow + 18)
	}

	const postsList = props.data.blogConnection.edges

	return (
		<BlogLayout>
			<div>
				<div className="mx-auto flex h-32 w-5/6 flex-col items-center justify-between pt-3 md:h-24 md:flex-row md:pt-0">
					<div className="kallisto text-4xl lg:text-5xl">WXYC PRESS</div>

					{/* Desktop blog nav */}
					<div className="z-20 hidden  h-1/2  w-full flex-row items-center justify-center text-center  text-lg lg:flex lg:h-1/2 lg:w-1/2 lg:justify-end">
						<div className="kallisto mx-2 flex h-full flex-col   justify-center px-2 hover:underline md:mr-0 md:whitespace-nowrap ">
							<Link href="/blog/category/show-review">Show Reviews</Link>
						</div>

						<div className="kallisto mx-2 flex h-full flex-col  justify-center px-2 hover:underline md:mr-0 md:whitespace-nowrap">
							<Link href="/blog/category/album-review">Album Reviews</Link>
						</div>

						<div className="kallisto mx-2 flex h-full flex-col justify-center px-2 hover:underline md:mr-0 md:whitespace-nowrap">
							<Link href="/blog/category/artist-interview">
								Artist Interviews
							</Link>
						</div>
					</div>
				</div>

				<div className="relative z-20 mx-auto mb-10 w-5/6 ">
					<p className="-mt-12  text-center md:-mt-2 md:text-left">
						Read reviews and interviews by WXYC DJs.
					</p>
				</div>

				{/* Desktop banner image */}
				<div className="relative z-10 mx-auto -mt-20 mb-5 hidden w-5/6 md:block">
					<Image src={photo} alt="A crowded dancefloor at a WXYC event." />
				</div>

				{/* Mobile banner image */}
				<div className="relative z-10 mx-auto -mt-20 mb-5 w-5/6 md:-mt-20 md:hidden">
					<Image
						src={mobilephoto}
						alt="A crowded dancefloor at a WXYC event."
					/>
				</div>

				{/* Mobile blog nav */}
				<div className="z-20 mx-auto  mb-2 flex  h-1/2 w-5/6 flex-row  items-center justify-center text-center text-lg lg:hidden">
					<div className="kallisto mx-2 flex h-full flex-col   justify-center px-2 hover:underline md:mr-0 md:whitespace-nowrap ">
						<Link href="/blog/category/show-review">Show Reviews</Link>
					</div>

					<div className="kallisto mx-2 flex h-full flex-col  justify-center px-2 hover:underline md:mr-0 md:whitespace-nowrap">
						<Link href="/blog/category/album-review">Album Reviews</Link>
					</div>

					<div className="kallisto mx-2 flex h-full flex-col justify-center px-2 hover:underline md:mr-0 md:whitespace-nowrap">
						<Link href="/blog/category/artist-interview">
							Artist Interviews
						</Link>
					</div>
				</div>
			</div>

			<div className="mx-auto grid w-5/6 grid-cols-1 justify-around gap-4 pb-10 md:grid-cols-2  lg:grid-cols-3">
				{postsList.slice(0, postsToShow).map((post) => (
					// <LazyLoad height={200} once={true} key={post.node.id}>
					<div className="mb-8 flex justify-center" key={post.node.id}>
						<PostPreview
							id={post.node.id}
							title={post.node.title}
							slug={post.node._sys.filename}
							cover={post.node.cover}
							subtitle={
								post.node.description
									? post.node.description
									: post.node.body.children[0].children[0].text.substring(0, 75)
							}
						/>
					</div>
					// </LazyLoad>
				))}
			</div>

			{postsToShow < postsList.length && (
				<SeeMoreButton onClick={loadMorePosts} />
			)}
		</BlogLayout>
	)
}

export const getStaticProps = async () => {
	const length = await client.request({
		query: `{
      blogConnection {
        totalCount
      }
    }`,
	})

	const {data} = await client.request({
		query: `
    query getContent($postCount: Float)
    {
      blogConnection(sort: "published", last: $postCount, before: "cG9zdCNkYXRlIzE2NTc4Njg0MDAwMDAjY29udGVudC9wb3N0cy9hbm90aGVyUG9zdC5qc29u"){
        edges {
          node {
            id
            title
            cover
            published
            description
            body
            _sys {
              filename
            }
          }
        }
      }
    }
    `,
		variables: {
			postCount: length.data.blogConnection.totalCount,
		},
	})

	return {
		props: {
			data,
		},
	}
}
