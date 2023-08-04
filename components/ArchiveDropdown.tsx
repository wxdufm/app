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

        <div className="md:w-1/5 w-5/6">
          <div className="w-1/2">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full ">
              {({ open }) => (
                <p 
                  //Makes the "filter" button have rounded bottom corners when not open, and hard corners when open to blend in with the rest of the menu
                  className={`${
                    open ? "w-full inline-flex justify-center rounded-b-none rounded-2xl  shadow-sm px-4 py-2 bg-neutral-700 text-sm font-medium texfocust-white hover:bg-neutral-600" : "inline-flex w-full justify-center rounded-2xl  shadow-sm px-4 py-2 bg-neutral-700 text-sm font-medium text-white hover:bg-neutral-600  :outline-none"
                  }`}>
              Filter <IoIosArrowDown size={18} className="ml-1 mt-0.5" />
              </p>)}

            </Menu.Button>
            <Menu.Items className="origin-top absolute rounded-b-2xl left-1/2 transform -translate-x-1/2 mt-0 w-full shadow-lg bg-neutral-700 ring-1 ring-black ring-opacity-5">
              <Menu.Item>
                <Link
                  legacyBehavior={false}
                  href={`/archive/events`}
                  passHref
                  scroll={false}
                >
                  <p
                    className="inline-flex justify-center items-center w-full px-4 py-2 text-sm text-white hover:bg-neutral-600"
                  >
                    Events
                  </p>
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex rounded-b-2xl justify-center w-full  shadow-sm px-4 py-2 bg-neutral-700 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none">
                    Specialty Shows{" "}
                    <IoIosArrowForward size={18} className="ml-1 mt-0.5" />
                  </Menu.Button>
                  <Menu.Items className="origin-right absolute left-full top-0 mt-0 ml-2 w-48 rounded-md shadow-lg bg-neutral-700 ring-1 ring-black ring-opacity-5">
                    <Menu.Item>
                      <Link
                        legacyBehavior={false}
                        href="/archive/specialty-shows/"
                        scroll={false}
                      >
                        <p className="group-flex items-center px-4 py-2 text-sm text-white hover:bg-neutral-600 hover:rounded-sm hover:text-white">
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
                            <p className="group-flex items-center px-4 py-2 text-sm text-white hover:bg-neutral-600 hover:text-white">
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
