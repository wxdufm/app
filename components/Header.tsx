import React from "react";
import Link from "next/link"
import DropdownMenu from "./DropdownMenu";

const Header = () => {
    return (
    //Entire flex container
    <div className="flex w-5/6 flex-col items-start justify-center mx-auto mb-10">
            
    <Link href="/">
    {/* Header text parent container */}
    <div className="flex mb-5">
        {/* Actual header text */}
        <div>
                <h1 className=" text-6xl text-white font-bold no-underline m-0">WXYC 89.3FM</h1>
                <h3>UNC-Chapel Hill's student-run, freeform radio station</h3>
        </div>
    </div>

            
            
            </Link>
    {/* Parent container of navbar */}
    <div className="w-full justify-center ">
    {/* Actual navbar */}
        <div className="w-full flex flex-row justify-around items-center bg-white py-3">
            <Link href="/about">
                    <p className="text-black text-base no-underline">About</p>
                </Link>
                
                <Link href="/programming" className="nav">
                    <p className="text-black text-base no-underline">Programming</p>
                </Link>
                <Link href="/archive">
                    <p className="text-black text-base no-underline">Archive</p>
                </Link>
                <Link href="/blog">
                    <p className="text-black text-base no-underline">Blog</p>
                </Link>
                <Link href="/contact">
                    <p className="text-black text-base no-underline">Contact</p>
                </Link>

                <DropdownMenu/>
 
                <Link href="https://wxyc.bigcartel.com/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="text-black text-base no-underline">Merch</a>
                </Link>
            </div>  
    </div>
    
    </div>
                
        
    )
}

export default Header;