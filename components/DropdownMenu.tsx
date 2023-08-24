import { Menu } from "@headlessui/react"
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

// the dropdown in the nav bar
const DropdownMenu = () =>  {

    return(
        <div className="">
            <Menu as="div" className="relative">
                <Menu.Button className="inline-flex justify-center w-full   text-white lg:text-black">
                    Listen <IoIosArrowDown size={18} className="ml-1 mt-1"/>
                </Menu.Button>
                <Menu.Items className="origin-top absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-sm shadow-lg bg-neutral-800 md:bg-white ring-1 ring-black ring-opacity-5">
                    <div className="flex justify-center items-center text-medium md:hover:bg-gray-200 hover:rounded-md text-white md:text-black w-full px-4 py-2">
                        <Menu.Item>
                            <a href="https://apps.apple.com/us/app/wxyc-radio/id353182815" target="_blank">
                                iPhone app
                            </a>
                        </Menu.Item>
                    </div>
                    <div className="flex justify-center items-center text-medium md:hover:bg-gray-200 rounded-md text-white md:text-black  w-full px-4 py-2">
                        <Menu.Item>
                            <Link href="/playlist" legacyBehavior={false}>
                                Live playlist
                            </Link>
                        </Menu.Item>
                    </div>
                    <div className="flex justify-center items-center text-medium md:hover:bg-gray-200 rounded-md text-white md:text-black  w-full px-4 py-2">
                        <Menu.Item>
                            <a href="https://open.spotify.com/user/wxyc" target="_blank" >
                                Spotify
                            </a>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu>
        </div>
    )
}

export default DropdownMenu;