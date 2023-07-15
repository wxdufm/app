import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/router";
import { IoIosArrowForward, IoIosArrowDown, IoMdClose } from "react-icons/io";

const ArchiveDropdown = (props) => {

  // const currentRoute = useRouter().asPath;

  return (
    <div className="w-full mx-auto">
      {/* dropdown in archive pages */}
      <div className="flex flex-row gap-16">
        <div className="w-1/5">
          <Menu as="div" className="relative">
            <Menu.Button className="ui-open:bg-green-300">
              Filter <IoIosArrowDown size={18} className="ml-1 mt-0.5" />
            </Menu.Button>
            <Menu.Items className="origin-top absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <Menu.Item>
                <Link
                  legacyBehavior={false}
                  href={`/archive/events`}
                  passHref
                  scroll={false}
                >
                  <p
                    className="inline-flex justify-center items-center w-full rounded-md px-4 py-2 text-sm text-gray-700"
                  >
                    Events
                  </p>
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    Specialty Shows{" "}
                    <IoIosArrowForward size={18} className="ml-1 mt-0.5" />
                  </Menu.Button>
                  <Menu.Items className="origin-right absolute left-full top-0 mt-0 ml-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <Menu.Item>
                      <Link
                        legacyBehavior={false}
                        href="/archive/specialty-shows/"
                        scroll={false}
                      >
                        <p className="group-flex items-center px-4 py-2 text-sm text-red-400 hover:bg-indigo-500 hover:rounded-sm hover:text-white">
                          All
                        </p>
                      </Link>
                    </Menu.Item>
                    {props.specialtyShows.map((option) => (
                      <div key={option.value} className="py-1">
                        <Menu.Item>
                          <Link
                            legacyBehavior={false}
                            href={`/archive/specialty-shows/${option.value}`}
                            scroll={false}
                          >
                            <p className="group-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
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

        {/* {currentRoute !== "/archive" && (
          <Link href="/archive">
            <p className="flex hover:cursor-pointer">
              <IoMdClose size={22} className="mt-0.5" /> clear
            </p>
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default ArchiveDropdown;
