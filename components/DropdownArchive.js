import Link from 'next/link'
import {Menu} from '@headlessui/react'
import {IoIosArrowForward, IoIosArrowDown} from 'react-icons/io'

{
	/* dropdown in archive index page */
}

// this looks like a mess b/c of all the nested menus but it is simple i promise
const ArchiveDropdown = (props) => {
	return (
		<div>
			<div>
				<div className="mx-auto w-32 md:mx-0">
					<div>
						<Menu as="div" className="relative">
							{/* filter -> on click opens dropdown */}
							<Menu.Button className="w-full">
								{({open}) => (
									<p className="kallisto inline-flex w-full justify-center py-2 text-white ">
										Filter <IoIosArrowDown size={18} className="ml-1 mt-0.5" />
									</p>
								)}
							</Menu.Button>

							<Menu.Items className="absolute left-1/2 my-4 -ml-6 mt-0 w-full  origin-top  -translate-x-1/2 transform bg-black bg-opacity-50 md:-ml-0">
								{/* option 1: events */}
								<Menu.Item>
									<Link
										legacyBehavior={false}
										href={`/archive/events`}
										passHref
										scroll={false}
									>
										<p className="kallisto inline-flex w-full items-center justify-center py-2 text-white    hover:bg-neutral-600 hover:bg-opacity-50">
											Events
										</p>
									</Link>
								</Menu.Item>

								{/* option 2: specialty shows */}
								<Menu.Item>
									<Menu as="div" className="relative">
										<Menu.Button className="kallisto inline-flex w-full justify-center pb-1 pt-2 text-white  shadow-sm  hover:bg-neutral-600 hover:bg-opacity-70">
											Specialty Shows{' '}
											<IoIosArrowForward size={20} className="my-auto" />
										</Menu.Button>
										<Menu.Items className="kallisto absolute left-full top-0  -mt-10 ml-1  w-32 origin-right bg-black bg-opacity-70 md:-mt-0">
											{/* page for all specialty shows */}
											<Menu.Item>
												<Link
													legacyBehavior={false}
													href="/archive/specialty-shows/"
													scroll={false}
												>
													<p className="group-flex items-center px-4 py-2 text-sm text-white  hover:bg-neutral-600 hover:bg-opacity-50 ">
														All
													</p>
												</Link>
											</Menu.Item>
											{/* make a menu item for each archive category that admin indicates is a specialty show */}
											{props.specialtyShows.map((option) => (
												<div key={option.value} className="py-1">
													<Menu.Item>
														<Link
															legacyBehavior={false}
															href={`/archive/specialty-shows/${option.value}`}
															scroll={false}
														>
															<p className="group-flex ml items-center px-4 py-2 text-sm text-white hover:bg-neutral-600 hover:bg-opacity-50 hover:text-white">
																{option.label}
															</p>
														</Link>
													</Menu.Item>
												</div>
											))}
										</Menu.Items>
									</Menu>
								</Menu.Item>
							</Menu.Items>
						</Menu>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ArchiveDropdown
