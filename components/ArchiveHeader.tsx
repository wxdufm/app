import Dropdown from "react-dropdown"
import * as React from "react"
import Link from "next/link";
import { Menu } from "@headlessui/react"


const ArchiveHeader = (props) => {
  return (
      <div>
        <h1>Archive</h1>
        <div className="w-1/5">
            <Menu as="div" className="relative">
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    Filter
                </Menu.Button>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                  <Menu.Item>
                    <Link legacyBehavior={false} href={`/archive/category/events`}>
                      <p className="group-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">Events</p>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Menu as="div" className="relative">
                      <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                        Specialty Shows {'v'}
                      </Menu.Button>
                      <Menu.Items>
                        {props.specialtyShows.map((option) => (
                          <div className="py-1">
                            <Menu.Item>
                              <Link legacyBehavior={false} href={`/archive/category/${option.value}`}>
                                <p className="group-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">{option.label}</p>
                              </Link>
                            </Menu.Item>
                          </div>))}
                      </Menu.Items>
                    </Menu>

                  </Menu.Item>
                </Menu.Items>
            </Menu>
        </div>
    </div>
  )
}

export default ArchiveHeader