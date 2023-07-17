import React, { useState } from 'react';
import Link from "next/link"
import DropdownMenu from "./DropdownMenu";
import photo from "../images/logo.png"
import Image from 'next/image'




const Header = () => {
    
    return (
    
    //Parent Container
     <div> 
    
    {/* Mobile header */}
    <div className="bg-gradient-to-b from-neutral-700 to-neutral-900 drop-shadow-sm fixed z-50 top-0 w-full h-12 px-0 md:hidden">
    
    </div>

    {/* Parent container of entire desktop header  */}
    <div className="flex w-5/6 flex-col items-start justify-center mx-auto md:mb-10 md:pt-2 pt-20">
    
    <Link href="/">
    {/* Header text parent container */}
    <div className="flex w-full flex-col justify-center items-center md:flex-row md:items-end mb-5 ">
        {/* Actual header text */}
            <div className="md:w-2/5  flex flex-col items-center justify-center w-full">
                <Image src={photo} alt="Picture of the author"/>
                <h1 className=" text-6xl text-white font-bold no-underline m-0 mx-auto kallistobold">89.3FM</h1>
                <div className="mt-2">
                <h3 className="w-full poppins md:text-base text-sm md:mx-0 mx-auto">UNC-Chapel Hill's student-run, freeform radio station</h3>
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
            <Link href="/programming" className="nav">
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
            <Link href="/contact">
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
   
                
        
    )
}

export default Header;