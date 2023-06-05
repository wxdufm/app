import React from "react";
import Link from "next/link"

const Header = () => {
    return (
        <div className="header">
            <Link href="/">
            <h1 className="title">WXYC 89.3FM</h1>
            </Link>
            <div className="navbar">
                <Link href="/about" className="nav">About</Link>
                <Link href="/history" className="nav">History</Link>
                <Link href="/schedule" className="nav">DJ Schedule</Link>
                <Link href="/programming" className="nav">Specialty Programming</Link>
                <Link href="/archive" className="nav">Archive</Link>
                <Link href="/blog" className="nav">Blog</Link>
                <Link href="/contact" className="nav">Contact</Link>
                <Link href="/listen" className="nav">Listen</Link>
                <Link href="https://wxyc.bigcartel.com/" legacyBehavior className="nav">
                    <a target="_blank" rel="noopener noreferrer">Merch</a>
                </Link>
            </div>
        </div>
    )
}

export default Header;