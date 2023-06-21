import React from "react";
import Link from "next/link"

const Header = () => {

    return (
        <div>
            <Link href="/">
            <div>
                <h1 className="title">WXYC 89.3FM</h1>
                <h3>UNC-Chapel Hill's student-run, freeform radio station</h3>
            </div>
            
            </Link>
    
            <div className="navbar">
                <Link href="/about">
                    <p className="navb">About</p>
                </Link>
                {/* <Link href="/schedule" className="nav">DJ Schedule</Link> */}
                <Link href="/programming" className="nav">
                    <p className="navb">Programming</p>
                </Link>
                <Link href="/archive">
                    <p className="navb">Archive</p>
                </Link>
                <Link href="/blog">
                    <p className="navb">Blog</p>
                </Link>
                <Link href="/contact">
                    <p className="navb">Contact</p>
                </Link>
                <Link href="/listen">
                    <p className="navb">Listen</p>
                </Link>
                <Link href="https://wxyc.bigcartel.com/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" className="navb">Merch</a>
                </Link>
            </div>
        </div>
    )
}

export default Header;