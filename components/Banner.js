import React, {useState} from 'react'

const Banner = ({children}) => {
	const [isClosed, setIsClosed] = useState(false)

	if (isClosed) {
		return null // Don't render the banner if it's closed
	}

	return (
		<div className="bg-blue-500 p-4">
			<button
				className="float-right font-bold text-white"
				onClick={() => setIsClosed(true)}
			>
				X
			</button>
			{children}
		</div>
	)
}

export default Banner
