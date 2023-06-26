import { Fragment } from "react";
import { Menu } from "@headlessui/react"
import Link from "next/link";


const DropdownMenu = () =>  {

    return(
        <div className="w-1/5">
            <Menu as="div" className="relative">
                <Menu.Button className="inline-flex justify-center w-full shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    Listen
                </Menu.Button>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            <a href="https://apps.apple.com/us/app/wxyc-radio/id353182815" target="_blank" className="group-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
                                iPhone app
                            </a>
                        </Menu.Item>
                    </div>
                    <div className="py-1">
                        <Menu.Item>
                            <Link legacyBehavior={false} href="/playlist">
                                <p className="group-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">Listen</p>
                            </Link>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu>
        </div>
    )
}

export default DropdownMenu;