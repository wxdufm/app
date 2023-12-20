import React from 'react'
import {IoIosArrowDown} from 'react-icons/io'

// See more button on blog and archive pages, after scrolling
const SeeMoreButton = ({onClick}) => {
	return (
		<div className="my-6 flex cursor-pointer justify-center">
			<button
				className="kallisto mr-2 text-2xl text-white hover:underline"
				onClick={onClick}
			>
				See More
			</button>
			<IoIosArrowDown size={24} className="my-auto flex" onClick={onClick} />
		</div>
	)
}

export default SeeMoreButton
