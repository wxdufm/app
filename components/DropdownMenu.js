import {Menu} from '@headlessui/react'
import Link from 'next/link'
import {IoIosArrowDown} from 'react-icons/io'

// the dropdown in the nav bar (under "Listen")
const DropdownMenu = () => {
	return (
		<div>
			<Menu as="div" className="relative">
				<Menu.Button className="inline-flex w-full justify-center text-white  hover:text-blue-300">
					Listen <IoIosArrowDown size={18} className="ml-1 mt-1" />
				</Menu.Button>
				<Menu.Items className="outline-t-2 outline-t-2 outline-t-black absolute left-1/2 mt-4 w-32 origin-top -translate-x-1/2 transform bg-black shadow-lg ring-1 ring-black ring-opacity-5 ">
					<div className="text-medium flex w-full items-center justify-center px-4 py-2 text-white hover:text-blue-300">
						<Menu.Item>
							<a
								href="https://apps.apple.com/us/app/wxyc-radio/id353182815"
								target="_blank"
							>
								iPhone App
							</a>
						</Menu.Item>
					</div>
					<div className="text-medium flex w-full items-center justify-center rounded-md px-4 py-2  text-white hover:text-blue-300">
						<Menu.Item>
							<Link
								href="https://stream.wxdu.art/wxdu192.mp3"
								target="_blank"
								legacyBehavior={false}
							>
								Streaming
							</Link>
						</Menu.Item>
					</div>
					<div className="text-medium flex w-full items-center justify-center rounded-md px-4 py-2  text-white hover:text-blue-300">
						<Menu.Item>
							<Link
								href="http://www.wxyc.info/playlists/recent"
								target="_blank"
								legacyBehavior={false}
							>
								{/* Until new flowsheet is deployed: <Link href="/playlist" legacyBehavior={false}> */}
								Live playlist
							</Link>
						</Menu.Item>
					</div>
					<div className="text-medium flex w-full items-center justify-center rounded-md px-4 py-2  text-white hover:text-blue-300">
						<Menu.Item>
							<a href="https://archive.wxyc.org" target="_blank">
								Archive
							</a>
						</Menu.Item>
					</div>
				</Menu.Items>
			</Menu>
		</div>
	)
}

export default DropdownMenu
