import React, {useState} from 'react'
import Link from 'next/link'
import DropdownMenu from './DropdownMenu'
import photo from '../images/logo.png'
import Image from 'next/image'
import {AiOutlineMenu, AiOutlineClose} from 'react-icons/ai'
import {Menu} from '@headlessui/react'
import {IoIosArrowDown} from 'react-icons/io'

const Header = () => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	return (
		//Parent Container
		<div className="h-full">
			{/* Mobile header */}
			<div className="fixed top-0 z-50 flex h-16 w-full bg-gradient-to-b from-neutral-600 to-neutral-800 md:h-24 lg:hidden">
				{/* Hamburger icon */}
				<button onClick={toggleMenu} className="hamburger-icon h-full">
					{isOpen ? (
						<AiOutlineClose size={32} className="ml-4 mt-1 md:ml-6" />
					) : (
						<AiOutlineMenu size={32} className="ml-4 mt-1 md:ml-6" />
					)}
				</button>

				{/* Collapsible menu for mobile*/}
				{isOpen && (
					<ul className="-ml-12 mt-16 flex h-screen w-screen flex-col justify-start bg-neutral-800 bg-opacity-95 md:mt-24 md:gap-6">
						<div className=" mt-16 flex h-16 items-center justify-center ">
							<Link href="/about" legacyBehavior={false}>
								<a
									className="cursor-pointer text-xl text-white no-underline md:text-3xl"
									onClick={toggleMenu}
								>
									About
								</a>
							</Link>
						</div>

						<div className="flex h-16 items-center justify-center">
							<Link href="/programming" legacyBehavior={false}>
								<a
									className="cursor-pointer text-xl text-white no-underline md:text-3xl"
									onClick={toggleMenu}
								>
									Programming
								</a>
							</Link>
						</div>

						<div className="flex h-16 items-center justify-center ">
							<Link href="/archive" legacyBehavior={false}>
								<a
									className="cursor-pointer text-xl text-white no-underline md:text-3xl"
									onClick={toggleMenu}
								>
									Archive
								</a>
							</Link>
						</div>

						<div className="flex h-16 items-center justify-center">
							<Link href="/blog" legacyBehavior={false}>
								<a
									className="cursor-pointer text-xl text-white no-underline md:text-3xl"
									onClick={toggleMenu}
								>
									Blog
								</a>
							</Link>
						</div>

						<div className="flex h-16 items-center justify-center ">
							<Link href="/contact" legacyBehavior={false}>
								<a
									className="cursor-pointer text-xl text-white no-underline md:text-3xl"
									onClick={toggleMenu}
								>
									Contact
								</a>
							</Link>
						</div>

						<div className="mb-2 flex h-16 items-center justify-center text-xl text-white">
							{/* nested dropdown for mobile */}
							<div className="">
								<Menu as="div" className="relative">
									<Menu.Button className="inline-flex w-full justify-center text-white  md:text-3xl lg:text-black">
										Listen{' '}
										<IoIosArrowDown
											size={18}
											className="ml-1 mt-1 md:ml-3 md:mt-3"
										/>
									</Menu.Button>
									<Menu.Items className="absolute left-1/2 mt-2 w-48 origin-top -translate-x-1/2 transform rounded-sm bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 md:bg-white">
										<div className="text-medium flex w-full items-center justify-center px-4 py-2 text-white hover:rounded-md md:text-black md:hover:bg-gray-200">
											<Menu.Item>
												<a
													href="https://apps.apple.com/us/app/wxyc-radio/id353182815"
													target="_blank"
												>
													iPhone app
												</a>
											</Menu.Item>
										</div>
										<div className="text-medium flex w-full items-center justify-center px-4 py-2 text-white hover:rounded-md md:text-black md:hover:bg-gray-200">
											<Menu.Item>
												<a
													href="https://play.google.com/store/apps/details?id=org.wxyc.WXYCCH&pcampaignid=web_share"
													target="_blank"
												>
													Android app
												</a>
											</Menu.Item>
										</div>
										<div className="text-medium flex w-full items-center justify-center rounded-md px-4 py-2  text-white md:text-black md:hover:bg-gray-200">
											<Menu.Item>
												<Link
													href="https://audio-mp3.ibiblio.org/wxyc.mp3"
													target="_blank"
													legacyBehavior={false}
												>
													Streaming
												</Link>
											</Menu.Item>
										</div>
										<div className="text-medium flex w-full items-center justify-center rounded-md px-4 py-2  text-white md:text-black md:hover:bg-gray-200">
											<Menu.Item>
												<Link
													href="http://www.wxyc.info/playlists/recent.html"
													target="_blank"
													legacyBehavior={false}
												>
													Live playlist
												</Link>
												{/* <Link href="/playlist" legacyBehavior={false}>
                          <a onClick={toggleMenu}>Live playlist</a>
                        </Link> */}
											</Menu.Item>
										</div>
										<div className="text-medium flex w-full items-center justify-center px-4 py-2 text-white hover:rounded-md md:text-black md:hover:bg-gray-200">
											<Menu.Item>
												<a
													href="https://open.spotify.com/user/wxyc"
													target="_blank"
												>
													Spotify
												</a>
											</Menu.Item>
										</div>
									</Menu.Items>
								</Menu>
							</div>
						</div>

						<div className="flex items-center justify-center  ">
							<Link href="https://merch.wxyc.org/">
								<a
									target="_blank"
									rel="noopener noreferrer"
									className="text-xl text-white no-underline md:text-3xl"
								>
									Merch
								</a>
							</Link>
						</div>
						{/* Add more navigation links as needed */}
					</ul>
				)}
			</div>

			{/* Makes the mobile header overlap the rest of the header content */}
			<div className="relative z-20">
				{/* Parent container of entire desktop header  */}
				<div className="mx-auto flex w-5/6 flex-col items-start justify-center pt-10 md:mb-10 md:pt-2 ">
					<Link href="/">
						{/* Header text parent container */}
						<div className="mb-5 flex  w-full cursor-pointer flex-col items-center justify-center pt-20 md:flex-row md:items-end md:pt-20 lg:pt-1">
							{/* Actual header text */}
							<div className="flex w-full flex-col items-center justify-center md:w-3/4 md:pt-20 lg:w-2/5 lg:pt-1">
								<Image src={photo} alt="Picture of the author" priority />
								<h1 className=" kallistobold m-0 mx-auto text-6xl font-bold text-white no-underline">
									89.3FM
								</h1>
								<div className="mt-2">
									<h3 className="poppins mx-auto w-full text-center text-base md:mx-0  md:text-xl lg:text-base">
										UNC-Chapel Hill&apos;s student-run, freeform radio station
									</h3>
								</div>
							</div>
						</div>
					</Link>

					{/* Parent container of web navbar */}
					<div className="w-full justify-center ">
						{/* Actual navbar */}
						<div className="invisible flex h-12 w-full flex-row items-center justify-around bg-gradient-to-b from-neutral-100 to-neutral-300 py-3 lg:visible">
							<a href="/about" className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
									<p className="cursor-pointer text-base text-black no-underline">
										About
									</p>
							</a>

							<a href="/programming"  className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
									<p className="cursor-pointer text-base text-black no-underline">
										Programming
									</p>
							</a>

							<a href="/archive" className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
									<p className="cursor-pointer text-base text-black no-underline">
										Archive
									</p>
							</a>

							<a href="/blog" className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
									<p className="cursor-pointer text-base text-black no-underline">
										Blog
									</p>
							</a>

							<a href="/contact" className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
									<p className="cursor-pointer text-base text-black no-underline">
										Contact
									</p>
							</a>

							<div className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
								<DropdownMenu />
							</div>

							<a href="https://merch.wxyc.org/" className="flex h-12 grow items-center justify-center hover:bg-neutral-300 ">
								<a href="https://merch.wxyc.org/">
									<a
										className="text-base text-black no-underline"
									>
										Merch
									</a>
								</a>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Header
