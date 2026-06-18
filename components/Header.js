import React, {useState} from 'react'
import Link from 'next/link'
import DropdownMenu from './DropdownMenu'
import photo from '../images/logo.png'
import Image from 'next/image'
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
			<div className="fixed top-10 z-50 flex h-16 w-full flex-col bg-black/90 backdrop-blur-md lg:hidden ">
				<div className="flex flex-row items-center justify-between">
					{/* Hamburger icon */}
						<button
							onClick={toggleMenu}
							className="hamburger-icon duration-450 h-full transition-all ease-in-out"
							aria-label={isOpen ? 'Close main menu' : 'Open main menu'}
						>
						{isOpen ? (
							<AiOutlineClose size={32} className="ml-4 mt-1 md:ml-6" />
						) : (
							<AiOutlineMenu size={32} className="ml-4 mt-1 md:ml-6" />
						)}
					</button>
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
												// webstream moved to its own page!
												href="/listen"
											>
												Listen Here
											</Link>
										</Menu.Item>
									</div>
									<div className="mb-2 flex w-full text-nowrap text-white">
											<Menu.Item>
												<Link
													href="https://wxdu.org"
													target="_blank"
													rel="noopener noreferrer"
												>
													Mobile app (wip)
												</Link>
										</Menu.Item>
									</div>
									{/* <div className="mb-2 flex w-full text-nowrap text-white">
										<Menu.Item>
											<Link
												href="http://www.wxyc.info/playlists/recent"
												target="_blank"
											>
												Live playlist
											</Link>
										</Menu.Item>
									</div> */}
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

						<div className="ml-10 my-8 flex h-8 text-3xl">
							<Link
								href="/charts"
								legacyBehavior={false}
								className="cursor-pointer"
								rel="noopener noreferrer"
								onClick={toggleMenu}
								>
									Charts
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


				{/* Parent container of web navbar */}
				<div className="mb-20 hidden w-full lg:flex mt-10">
					{/* Actual navbar */}
					<div className="flex h-14 w-full flex-row justify-between bg-black px-1 py-4 ">
							{/* Logo and player*/}
							<div className="my-auto flex flex-row">
								{/* Keep logo as a semantic anchor target for keyboard users. */}
								<Link href="/" legacyBehavior>
									<a className="my-auto ml-10 flex h-10 w-28 cursor-pointer">
										<Image src={photo} alt="WXDU logo" />
									</a>
								</Link>
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

							<Link href="/charts">
								<a className="flex h-12 grow items-center justify-center">
									<p className="cursor-pointer text-base text-white no-underline hover:text-blue-300">
										Charts
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
