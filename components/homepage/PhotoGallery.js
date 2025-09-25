import React, {useState} from 'react'
import {IoIosArrowDropright, IoIosArrowDropleft} from 'react-icons/io'
import slamDanceBracket from '../../images/Slam_Dance_2012.jpg'
import slamDanceLogo from '../../images/WXDUslamdance.jpg'
import getSome from '../../images/get_some.jpg'
import ostraca from '../../images/ostraca.jpg'
import cardinals from '../../images/cardinals.jpg'
import djing from '../../images/djing.jpg'
import bivins from '../../images/bivins.jpg'
import djNight from '../../images/dj_night.jpg'
import wdbsCollage from '../../images/wdbs-collage.jpg'
import Image from 'next/image'

// to add images to gallery:
// (1) put in images directory
// (2) import them above
// (3) add to this images array
const images = [
    djNight,
    cardinals,
    djing,
    bivins,
    slamDanceLogo,
    slamDanceBracket,
    wdbsCollage,
    getSome,
]

export const PhotoGallery = () => {
	const [currentIndex, setCurrentIndex] = useState(0)

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		)
	}

	const goToNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		)
	}

	return (
		<div className="relative mb-10 flex w-full items-center">
			<div className="h-full w-full object-cover">
				<Image src={images[currentIndex]} alt="Gallery" sizes={'100vw'} />
			</div>

			<div className="arrows">
				<button
					onClick={goToPrevious}
					className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer text-2xl"
				>
					<IoIosArrowDropleft size={42} />
				</button>
				<button
					onClick={goToNext}
					className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer text-2xl"
				>
					<IoIosArrowDropright size={42} />
				</button>
			</div>
		</div>
	)
}

export default PhotoGallery
