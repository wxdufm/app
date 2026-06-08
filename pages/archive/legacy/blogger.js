// little thing to redirect to head of seize files, because Next.js expects a .js file for every path but the old stuff is .htmls

import Head from 'next/head'
import Link from 'next/link'
import {useEffect} from 'react'

const index_path = '/archive/legacy/blogger/blog.html'

export default function Entry() {
	useEffect(() => {
		window.location.replace(index_path)
	}, [])

	return (
		<>
			<Head>
				<title>Blogger archive</title>
				<meta httpEquiv="refresh" content={`0; url=${index_path}`} />
			</Head>
			<div className="mx-auto mt-32 w-5/6 text-white">
				<p>Redirecting to ancient blog land...</p>
				<p className="mt-4">
					If you are not redirected, click{' '}
					<Link href={index_path} className="underline">
						here
					</Link>
					.
				</p>
			</div>
		</>
	)
}
