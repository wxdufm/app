import Link from "next/link";
import { Menu } from "@headlessui/react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

const ArchiveDropdown = (props) => {

  return (
    <div className="">
      {/* dropdown in archive pages */}
      <div className="">

        <div className="w-32 mx-auto md:mx-0">
          <div className="">
          <Menu as="div" className="relative">
            <Menu.Button className="w-full">
              {({ open }) => (
                <p className="inline-flex w-full justify-center text-white kallisto py-2 ">
              Filter <IoIosArrowDown size={18} className="ml-1 mt-0.5" />
              </p>)}

            </Menu.Button>
            <Menu.Items className="origin-top absolute -ml-6 md:-ml-0 bg-black bg-opacity-50  my-4  left-1/2 transform -translate-x-1/2 mt-0 w-full">
              <Menu.Item>
                <Link
                  legacyBehavior={false}
                  href={`/archive/events`}
                  passHref
                  scroll={false}
                >
                  <p
                    className="inline-flex justify-center hover:bg-neutral-600 hover:bg-opacity-50 items-center w-full py-2    text-white kallisto"
                  >
                    Events
                  </p>
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex pt-2 pb-1 hover:bg-neutral-600 hover:bg-opacity-70 justify-center w-full  shadow-sm  text-white kallisto">
                    Specialty Shows{" "}
                    <IoIosArrowForward size={20} className="my-auto" />
                  </Menu.Button>
                  <Menu.Items className="origin-right absolute left-full ml-1  bg-black bg-opacity-70  top-0 -mt-10 md:-mt-0 w-32 kallisto">
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