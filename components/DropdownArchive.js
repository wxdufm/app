import Link from "next/link";
import { Menu } from "@headlessui/react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

{
  /* dropdown in archive index page */
}

// this looks like a mess b/c of all the nested menus but it is simple i promise
const ArchiveDropdown = (props) => {
  return (
    <div>
      <div>
        <div className="w-32 mx-auto md:mx-0">
          <div>
            <Menu as="div" className="relative">
              {/* filter -> on click opens dropdown */}
              <Menu.Button className="w-full">
                {({ open }) => (
                  <p className="inline-flex w-full justify-center text-white kallisto py-2 ">
                    Filter <IoIosArrowDown size={18} className="ml-1 mt-0.5" />
                  </p>
                )}
              </Menu.Button>

              <Menu.Items className="origin-top absolute -ml-6 md:-ml-0 bg-black bg-opacity-50  my-4  left-1/2 transform -translate-x-1/2 mt-0 w-full">
                {/* option 1: events */}
                <Menu.Item>
                  <Link
                    legacyBehavior={false}
                    href={`/archive/events`}
                    passHref
                    scroll={false}
                  >
                    <p className="inline-flex justify-center hover:bg-neutral-600 hover:bg-opacity-50 items-center w-full py-2    text-white kallisto">
                      Events
                    </p>
                  </Link>
                </Menu.Item>

                {/* option 2: specialty shows */}
                <Menu.Item>
                  <Menu as="div" className="relative">
                    <Menu.Button className="inline-flex pt-2 pb-1 hover:bg-neutral-600 hover:bg-opacity-70 justify-center w-full  shadow-sm  text-white kallisto">
                      Specialty Shows{" "}
                      <IoIosArrowForward size={20} className="my-auto" />
                    </Menu.Button>
                    <Menu.Items className="origin-right absolute left-full ml-1  bg-black bg-opacity-70  top-0 -mt-10 md:-mt-0 w-32 kallisto">
                      {/* page for all specialty shows */}
                      <Menu.Item>
                        <Link
                          legacyBehavior={false}
                          href="/archive/specialty-shows/"
                          scroll={false}
                        >
                          <p className="group-flex items-center px-4 py-2 hover:bg-neutral-600 hover:bg-opacity-50  text-sm text-white ">
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
                              <p className="group-flex items-center px-4 py-2 ml text-sm text-white hover:bg-neutral-600 hover:bg-opacity-50 hover:text-white">
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
  );
};

export default ArchiveDropdown;
