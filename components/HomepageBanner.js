import React, {useState} from 'react'
import {IoIosCloseCircle} from 'react-icons/io'

const Banner = ({children}) => {
	const [isClosed, setIsClosed] = useState(false)

	if (isClosed) {
		return null // Don't render the banner if it's closed
	}

	return (
		<div className="mx-auto mb-10 flex  h-12 w-5/6 flex-row items-center justify-between rounded-3xl bg-neutral-800 md:h-14 lg:mb-1 lg:h-12">
			<p className="ml-5 py-2 text-xs md:text-base lg:text-base">
				NEW: The WXYC Android app is now available to download on Google Play!
			</p>
			<button
				className="mr-2 font-bold md:mr-5 lg:mr-10"
				onClick={() => setIsClosed(true)}
			>
				<IoIosCloseCircle size={32} />
			</button>
			{children}
		</div>
	)
}

export default Banner
