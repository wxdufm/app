import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'

// sidebar menu for about subpages
const AboutLayout = ({children}) => {
	const currentRoute = useRouter().asPath

	return (
		<div className="mx-auto flex w-full flex-col pb-10 text-white md:w-5/6 md:flex-row">
			{/* active route is about */}
			{currentRoute === '/about' && (
				<div className="kallisto mx-auto mb-10 ml-2 mr-2 flex h-14 w-full flex-row justify-between bg-gradient-to-b from-neutral-900 to-black text-xl md:mx-0 md:mb-0 md:ml-2 md:mr-2 md:h-full md:w-1/5 md:flex-col">
					<div className="w-full bg-neutral-700 px-6 py-4 text-center hover:bg-neutral-500 md:text-left">
						<Link href="/about">About</Link>
					</div>
					<div className="w-full px-6 py-4 text-center text-neutral-400 hover:bg-neutral-500 hover:text-white md:text-left">
						<Link href="/about/history">History</Link>
					</div>
					<div className="w-full px-6 py-4 text-center text-neutral-400 hover:bg-neutral-500 hover:text-white md:text-left">
						<Link href="/about/mission">Mission</Link>
					</div>
				</div>
			)}
			{/* active route is history */}
			{currentRoute === '/about/history' && (
				<div className="kallisto mx-auto mb-10 ml-2 mr-2 flex h-14 w-full flex-row justify-between bg-gradient-to-b from-neutral-900 to-black text-xl md:mx-0 md:mb-0 md:ml-2 md:mr-2 md:h-full md:w-1/5 md:flex-col">
					<div className="w-full px-6 py-4 text-center text-neutral-400 hover:bg-neutral-500 hover:text-white md:text-left">
						<Link href="/about">About</Link>
					</div>
					<div className="w-full bg-neutral-700 px-6 py-4 text-center hover:bg-neutral-500 md:text-left">
						<Link href="/about/history">History</Link>
					</div>
					<div className="w-full px-6 py-4 text-center text-neutral-400 hover:bg-neutral-500 hover:text-white md:text-left">
						<Link href="/about/mission">Mission</Link>
					</div>
				</div>
			)}
			{/* active route is mission */}
			{currentRoute === '/about/mission' && (
				<div className="kallisto mx-auto mb-10 ml-2 mr-2 flex h-14 w-full flex-row justify-between bg-gradient-to-b from-neutral-900 to-black text-xl md:mx-0 md:mb-0 md:ml-2 md:mr-2 md:h-full md:w-1/5 md:flex-col">
					<div className="w-full px-6 py-4 text-center text-neutral-400 hover:bg-neutral-500 hover:text-white md:text-left">
						<Link href="/about">About</Link>
					</div>
					<div className="w-full px-6 py-4 text-center text-neutral-400 hover:bg-neutral-500 hover:text-white md:text-left">
						<Link href="/about/history">History</Link>
					</div>
					<div className="w-full bg-neutral-700 px-6 py-4 text-center hover:bg-neutral-500 md:text-left">
						<Link href="/about/mission">Mission</Link>
					</div>
				</div>
			)}
			{children}
		</div>
	)
}

export default AboutLayout
