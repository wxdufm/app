import React from 'react'
import {IoIosArrowDown} from 'react-icons/io'

// See more button on blog and archive pages, after scrolling
const SeeMoreButton = ({onClick}) => {
	return (
		<div className="my-6 flex justify-center">
			{/* Keep one button for both text and icon so mouse/keyboard behavior matches. */}
			<button
				className="kallisto inline-flex items-center gap-2 text-2xl text-white hover:underline"
				onClick={onClick}
			>
				See More
				<IoIosArrowDown size={24} className="my-auto flex" aria-hidden="true" />
			</button>
		</div>
	)
}

export default SeeMoreButton
