import React, {useState} from 'react'
import Link from 'next/link'
import DropdownMenu from './DropdownMenu'
import photo from '../images/logo.png'
import Image from 'next/image'
import AudioPlayerStream from '../components/audioplayers/AudioPlayerStream'
import {AiOutlineMenu, AiOutlineClose} from 'react-icons/ai'
import {Menu} from '@headlessui/react'
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io'

const Header = () => {
	const [submenuOpen, setSubmenuOpen] = useState(false)

	const toggleSubmenu = () => {
		setSubmenuOpen(!submenuOpen)
	}

	const [isOpen, setIsOpen] = useState(false)

	const toggleMenu = () => {
		setIsOpen(!isOpen)
	}

	return (
		//Parent Container
		<div className="h-full">
			{/* MOBILE NAVBAR STARTS HERE */}
			<div className="fixed top-0 z-50 flex h-16 w-full flex-col bg-black/90 backdrop-blur-md lg:hidden ">
				<div className="flex flex-row items-center justify-between">
					{/* Hamburger icon */}
					<button
						onClick={toggleMenu}
						className="hamburger-icon duration-450 h-full transition-all ease-in-out"
					>
						{isOpen ? (
							<AiOutlineClose size={32} className="ml-4 mt-1 md:ml-6" />
						) : (
							<AiOutlineMenu size={32} className="ml-4 mt-1 md:ml-6" />
						)}
					</button>

					<div className="my-auto mr-3">
						<AudioPlayerStream />
					</div>
				</div>

				{/* Collapsible menu for mobile*/}
				{isOpen && (
					<ul className="duration-450 h-screen w-screen flex-col justify-start bg-black/90 backdrop-blur-md transition-all ease-in-out md:gap-6">
						<div className="w-full">
							<Menu as="div" className="relative w-full">
								<Menu.Button
									onClick={toggleSubmenu}
									className="ml-10 mt-16 flex h-8 text-3xl"
								>
									Listen
									{submenuOpen ? (
										<IoIosArrowUp size={24} className="ml-1 mt-2 md:ml-3" />
									) : (
										<IoIosArrowDown size={24} className="ml-1 mt-2 md:ml-3" />
									)}
								</Menu.Button>

								{/* Submenu starts here */}
								<div
									className={`duration-450 my-5 ml-14 overflow-hidden text-2xl transition-all ease-in-out focus:outline-none focus:ring-0 md:text-3xl ${
										submenuOpen ? 'max-h-[400px]' : 'max-h-0'
									}`}
								>
									<div className="mb-2 flex w-full text-nowrap text-white">
										<Menu.Item>
											<Link
												href="https://apps.apple.com/us/app/wxyc-radio/id353182815"
												target="_blank"
											>
												iPhone app
											</Link>
										</Menu.Item>
									</div>
									<div className="mb-2 flex w-full text-nowrap text-white">
										<Menu.Item>
											<Link
												//href="https://audio-mp3.ibiblio.org/wxyc.mp3"
												href="https://stream.wxdu.art/wxdu192.mp3" // TODO: will need to change this to wxdu.org
												target="_blank"
											>
												Streaming
											</Link>
										</Menu.Item>
									</div>
									<div className="mb-2 flex w-full text-nowrap text-white">
										<Menu.Item>
											<Link
												href="http://www.wxyc.info/playlists/recent"
												target="_blank"
											>
												Live playlist
											</Link>
										</Menu.Item>
									</div>
									<div className="mb-2 flex w-full text-nowrap text-white">
										<Menu.Item>
											<Link href="https://archive.wxyc.org" target="_blank">
												Archive
											</Link>
										</Menu.Item>
									</div>
								</div>
								{/* Submenu ends here */}
							</Menu>
						</div>

						<div className="ml-10 flex h-8 text-3xl">
							<Link
								href="/about"
								legacyBehavior={false}
								className="cursor-pointer"
								rel="noopener noreferrer"
								onClick={toggleMenu}
							>
								About
							</Link>
						</div>

						<div className="ml-10 mt-8 flex h-8 text-3xl">
							<Link
								href="/programming"
								legacyBehavior={false}
								className="cursor-pointer"
								rel="noopener noreferrer"
								onClick={toggleMenu}
							>
								Programming
							</Link>
						</div>

						<div className="ml-10 mt-8 flex h-8 text-3xl">
							<Link
								href="/archive"
								legacyBehavior={false}
								className="cursor-pointer"
								rel="noopener noreferrer"
								onClick={toggleMenu}
							>
								Archive
							</Link>
						</div>

						<div className="ml-10 mt-8 flex h-8 text-3xl">
							<Link
								href="/blog"
								legacyBehavior={false}
								className="cursor-pointer"
								rel="noopener noreferrer"
								onClick={toggleMenu}
							>
								Blog
							</Link>
						</div>

						<div className="ml-10 mt-8 flex h-8 text-3xl">
							<Link
								href="/contact"
								legacyBehavior={false}
								className="cursor-pointer"
								rel="noopener noreferrer"
								onClick={toggleMenu}
							>
								Contact
							</Link>
						</div>

						{/* Add more navigation links as needed */}
					</ul>
				)}
			</div>

			{/* Makes the mobile navbar overlap the rest of the header content */}
			<div className="relative z-20">
				{/* END MOBILE NAVBAR */}

				{/* WXYC logo in mobile header */}

				<div className="mx-auto flex w-5/6 flex-col items-start justify-center pt-10 md:mb-10 md:pt-2 lg:hidden ">
					<Link href="/">
						{/* Header text parent container */}
						<div className="mb-20 flex w-full  cursor-pointer flex-col items-center justify-center pt-20 md:flex-row md:items-end md:pt-20 lg:mb-5 lg:pt-1">
							{/* Actual header text */}
							<div className="flex w-full flex-col items-center justify-center md:w-3/4 md:pt-20 lg:w-2/5 lg:pt-1">
								<Image src={photo} alt="Picture of the author" priority />
								<h1 className=" kallistobold m-0 mx-auto text-6xl font-bold text-white no-underline">
									89.3FM
								</h1>
								<div className="mt-2">
									<h3 className="poppins mx-auto w-full text-center text-base md:mx-0  md:text-xl lg:text-base">
										Duke University&apos;s student-run, freeform radio station
									</h3>
								</div>
							</div>
						</div>
					</Link>
				</div>

				{/* Parent container of web navbar */}
				<div className="mb-20 hidden w-full lg:flex">
					{/* Actual navbar */}
					<div className="flex h-14 w-full flex-row justify-between bg-black px-1 py-4 ">
						{/* Logo and player*/}
						<div className="my-auto flex flex-row">
							<Link href="/">
								<div className="my-auto ml-10 flex h-10 w-28 cursor-pointer">
									<Image src={photo} />
								</div>
							</Link>

							<div className="ml-5">
								<AudioPlayerStream />
							</div>
						</div>

						{/* Links*/}
						<div className="my-auto flex w-1/2 flex-row">
							<Link href="/about">
								<a className="flex h-12 grow items-center justify-center">
									<p className="cursor-pointer text-base text-white no-underline hover:text-blue-300">
										About
									</p>
								</a>
							</Link>

							<Link href="/programming">
								<a className="flex h-12 grow items-center justify-center">
									<p className="cursor-pointer text-base text-white no-underline hover:text-blue-300">
										Programming
									</p>
								</a>
							</Link>

							<Link href="/archive">
								<a className="flex h-12 grow items-center justify-center">
									<p className="cursor-pointer text-base text-white no-underline hover:text-blue-300">
										Archive
									</p>
								</a>
							</Link>

							<Link href="/blog">
								<a className="flex h-12 grow items-center justify-center ">
									<p className="cursor-pointer text-base no-underline hover:text-blue-300">
										Blog
									</p>
								</a>
							</Link>

							<Link href="/contact">
								<a className="flex h-12 grow items-center justify-center ">
									<p className="cursor-pointer text-base no-underline hover:text-blue-300">
										Contact
									</p>
								</a>
							</Link>

							<div className="flex h-12 grow items-center justify-center ">
								<DropdownMenu />
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Header
