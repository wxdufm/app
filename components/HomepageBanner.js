import React, {useState} from 'react'
import {IoIosCloseCircle} from 'react-icons/io'
import logo from '../images/logo.png'

const Banner = ({columns = [], aboveLogo = [], belowLogo = []}) => {
	const [isClosed, setIsClosed] = useState(false)

	if (isClosed || columns.length === 0) {
		return null
	}

	const midIndex = Math.floor(columns.length / 2)
	const leftColumns = columns.slice(0, midIndex)
	const rightColumns = columns.slice(midIndex)

	return (
		<div className="mx-auto mb-1 lg:mb-10 w-11/12 md:w-5/6 lg:w-full rounded-3xl bg-black p-2 lg:p-4 text-white shadow-lg shadow-black/20">
			

			<div className="flex gap-2 md:gap-4 items-stretch h-[15rem] sm:h-[28rem] md:h-[26rem] lg:h-[45rem]">
				<div
					className="flex-1 flex gap-1 md:gap-4 overflow-hidden"
					style={{
						maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
						WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
					}}
				>
					{leftColumns.map((column, colIndex) => (
						<div key={colIndex} className={`flex-1 flex flex-col gap-1 md:gap-3 ${colIndex > 0 ? 'hidden lg:flex' : ''}`}>
							{column.images?.map((item, imgIndex) => (
								<div key={imgIndex} className="flex-shrink-0 overflow-hidden rounded-lg md:rounded-3xl bg-neutral-800">
									<img
										src={item.image}
										alt={item.alt || `Image ${imgIndex + 1}`}
										className="w-full h-auto rounded-lg md:rounded-3xl"
									/>
								</div>
							))}
						</div>
					))}
				</div>

				<div
					className="flex-none w-[55%] md:w-[55%] lg:w-[45%] grid overflow-hidden"
					style={{
						gridTemplateRows: '1fr auto 1fr',
						maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
						WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
					}}
				>
					{/* Top row: above-logo images, pinned to the bottom of this area (closest to logo) */}
					<div className="flex flex-col justify-end gap-1 md:gap-3 overflow-hidden">
						{aboveLogo.length > 0 && (
							<div className="flex gap-1 md:gap-3 w-full">
								{aboveLogo.map((column, colIndex) => (
									<div key={colIndex} className="flex-1 flex flex-col-reverse gap-1 md:gap-3">
										{column.images?.map((item, imgIndex) => (
											<div key={imgIndex} className="flex-shrink-0 overflow-hidden rounded-lg md:rounded-3xl bg-neutral-800">
												<img src={item.image} alt={item.alt || `Image ${imgIndex + 1}`} className="w-full h-auto rounded-lg md:rounded-3xl" />
											</div>
										))}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Middle row: logo + subheader, always fixed at the true center */}
					<div className="flex flex-col items-center py-2">
						<img src={logo.src} alt="WXDU Logo" className="w-full h-auto object-contain" />
						<h1 className="courier-prime w-full text-center text-[0.6rem] sm:text-xs md:text-lg lg:text-3xl mt-2 leading-tight md:leading-normal">
							Duke and Durham&#39;s alternative, non-commercial radio station
						</h1>
					</div>

					{/* Bottom row: below-logo images, pinned to the top of this area (closest to logo) */}
					<div className="flex flex-col gap-1 md:gap-3 overflow-hidden">
						{belowLogo.length > 0 && (
							<div className="flex gap-1 md:gap-3 w-full">
								{belowLogo.map((column, colIndex) => (
									<div key={colIndex} className="flex-1 flex flex-col gap-1 md:gap-3">
										{column.images?.map((item, imgIndex) => (
											<div key={imgIndex} className="flex-shrink-0 overflow-hidden rounded-lg md:rounded-3xl bg-neutral-800">
												<img src={item.image} alt={item.alt || `Image ${imgIndex + 1}`} className="w-full h-auto rounded-lg md:rounded-3xl" />
											</div>
										))}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div
					className="flex-1 flex gap-1 md:gap-4 overflow-hidden"
					style={{
						maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
						WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 90%, transparent 100%)',
					}}
				>
					{rightColumns.map((column, colIndex) => (
						<div key={colIndex} className={`flex-1 flex flex-col gap-1 md:gap-3 ${colIndex > 0 ? 'hidden lg:flex' : ''}`}>
							{column.images?.map((item, imgIndex) => (
								<div key={imgIndex} className="flex-shrink-0 overflow-hidden rounded-lg md:rounded-3xl bg-neutral-800">
									<img
										src={item.image}
										alt={item.alt || `Image ${imgIndex + 1}`}
										className="w-full h-auto rounded-lg md:rounded-3xl"
									/>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Banner
