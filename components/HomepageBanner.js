import React, {useState} from 'react'
import {IoIosCloseCircle} from 'react-icons/io'

const Banner = ({children}) => {
	const [isClosed, setIsClosed] = useState(false)

	if (isClosed) {
		return null // Don't render the banner if it's closed
	}

	return (
		<div className="mx-auto px-1 mb-10 flex  h-24 md:h-18 lg:h-12 w-11/12 md:w-5/6 flex-row items-center justify-between rounded-full bg-neutral-800 lg:mb-1 ">
			<p className="ml-5 w-4/5 md:w-full py-2 text-small md:text-xl lg:text-base">
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
