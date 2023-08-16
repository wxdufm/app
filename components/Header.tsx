import React, { useState } from 'react';
import Link from "next/link"
import DropdownMenu from "./DropdownMenu";
import photo from "../images/logo.png"
import Image from 'next/image'
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Menu } from "@headlessui/react"
import { IoIosArrowDown } from "react-icons/io";


const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    return (
    
    //Parent Container
    <div className="h-full"> 
    
    {/* Mobile header */}
    <div className="flex fixed w-full bg-gradient-to-b from-neutral-600 to-neutral-800 z-50 h-16 md:hidden">
      {/* Hamburger icon */}
      <button onClick={toggleMenu} className="hamburger-icon h-full">
        {isOpen ? (
          <AiOutlineClose size={32} className="ml-4 mt-1" />
        ) : (
          <AiOutlineMenu size={32} className="ml-4 mt-1" />
        )}
      </button>

      {/* Collapsible menu */}
      {isOpen && (
        <ul className="h-screen flex flex-col justify-center bg-neutral-800 bg-opacity-95 mt-16 w-screen -ml-12 ">
          
            <div className=" flex items-center justify-center h-16 -mt-10 ">
                <Link href="/about" legacyBehavior={false}>
                    <a className="text-white text-xl no-underline cursor-pointer" onClick={toggleMenu}>
                        About
                    </a>
                    {/* <p className="text-white text-xl no-underline cursor-pointer">About</p> */}
                </Link>
            </div>

            <div className="flex items-center justify-center h-16">
                <Link href="page/programming" legacyBehavior={false}>
                    <a className="text-white text-xl no-underline cursor-pointer" onClick={toggleMenu}>Programming</a>
                </Link>
            </div>

            <div className="flex justify-center items-center h-16 ">
                <Link href="/archive" legacyBehavior={false}>
                    <a className="text-white text-xl no-underline cursor-pointer" onClick={toggleMenu}>Archive</a>
                </Link>
            </div>

            <div className="flex justify-center items-center h-16">
                <Link href="/blog" legacyBehavior={false}>
                    <a className="text-white text-xl no-underline cursor-pointer" onClick={toggleMenu}>Blog</a>
                </Link>
            </div>
            
            <div className="flex justify-center items-center h-16 ">
                <Link href="/page/contact" legacyBehavior={false}>
                    <a className="text-white text-xl no-underline cursor-pointer" onClick={toggleMenu}>Contact</a>
                </Link>
            </div>   
               
            <div className="flex justify-center items-center h-16 text-white text-xl mb-2">

                {/* nested dropdown for mobile */}
                <div className="">
                    <Menu as="div" className="relative">
                        <Menu.Button className="inline-flex justify-center w-full   text-white md:text-black">
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
                                        <a onClick={toggleMenu}>Live playlist</a>
                                    </Link>
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>   
                
            <div className="flex justify-center items-center  ">
                <Link href="https://wxyc.bigcartel.com/">
                    <a target="_blank" rel="noopener noreferrer" className="text-white text-xl no-underline">Merch</a>
                </Link>
            </div> 
          {/* Add more navigation links as needed */}
        </ul>
      )}
    </div>

{/* Makes the mobile header overlap the rest of the header content */}
<div className="relative z-20">

    {/* Parent container of entire desktop header  */}
    <div className="flex w-5/6 flex-col items-start justify-center mx-auto md:mb-10 md:pt-2 pt-20">
    
    <Link href="/">
    {/* Header text parent container */}
    <div className="flex w-full flex-col justify-center items-center md:flex-row md:items-end mb-5 pt-3 md:pt-0">
        {/* Actual header text */}
            <div className="md:w-2/5  flex flex-col items-center justify-center w-full">
                <Image src={photo} alt="Picture of the author" priority/>
                <h1 className=" text-6xl text-white font-bold no-underline m-0 mx-auto kallistobold">89.3FM</h1>
                <div className="mt-2">
                <h3 className="w-full poppins md:text-base text-sm md:mx-0 mx-auto whitespace-nowrap">UNC-Chapel Hill's student-run, freeform radio station</h3>
                </div>
            </div>
            
    </div>        
    </Link>

    
    {/* Parent container of navbar */}
    <div className="w-full justify-center ">
    {/* Actual navbar */}
        <div className="invisible md:visible w-full flex flex-row justify-around items-center bg-gradient-to-b from-neutral-100 to-neutral-300 h-12 py-3">
            <div className="hover:bg-neutral-300 h-12 flex items-center justify-center grow ">
                <Link href="/about">
                    <p className="text-black text-base no-underline cursor-pointer">About</p>
                </Link>
            </div>

            <div className="hover:bg-neutral-300 h-12 flex items-center justify-center grow ">
                <Link href="/page/programming" className="nav">
                    <p className="text-black text-base no-underline cursor-pointer">Programming</p>
                </Link>
            </div>

            <div className="hover:bg-neutral-300 h-12 flex justify-center items-center grow ">
                <Link href="/archive">
                    <p className="text-black text-base no-underline cursor-pointer">Archive</p>
                </Link>
            </div>

            <div className="hover:bg-neutral-300 h-12 flex justify-center items-center grow ">
                <Link href="/blog">
                    <p className="text-black text-base no-underline cursor-pointer">Blog</p>
                </Link>
            </div>
            
            <div className="hover:bg-neutral-300 h-12 flex justify-center items-center grow ">
                <Link href="/page/contact">
                    <p className="text-black text-base no-underline cursor-pointer">Contact</p>
                </Link>
            </div>   
               
            <div className="hover:bg-neutral-300 h-12 flex justify-center items-center grow ">
                <DropdownMenu/>
            </div>   
                
            <div className="hover:bg-neutral-300 h-12 flex justify-center items-center grow ">
            <Link href="https://wxyc.bigcartel.com/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="text-black text-base no-underline">Merch</a>
                </Link>
                </div>    

                
 
                
            </div>  
    </div>
    
    </div>
    </div>
     </div>
   
                
        
    )
}

export default Header;