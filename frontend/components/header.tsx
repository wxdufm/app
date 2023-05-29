import Link from "next/link"

const navStyle = {
    color: "black",
    fontSize: "16px",
    fontFamily: "Poppins",
}

const Header = () => {
    return (
        <div style={{marginLeft: "5%", marginTop: "20px"}}>
            <Link href="/">
            <h1 style={{color: "white", fontFamily: "Poppins", fontSize:"50px", margin: "5px", fontWeight: "bolder"}}>WXYC 89.3FM</h1>
            </Link>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent:"space-between", alignItems: "center", backgroundColor: 'white', padding: '15px 0px 15px 100px', width: "95%" }}>
                <Link href="/about" style={navStyle}>About</Link>
                <Link href="/history" style={navStyle}>History</Link>
                <Link href="/schedule" style={navStyle}>DJ Schedule</Link>
                <Link href="/programming" style={navStyle}>Specialty Programming</Link>
                <Link href="/archive" style={navStyle}>Archive</Link>
                <Link href="/blog" style={navStyle}>Blog</Link>
                <Link href="/contact" style={navStyle}>Contact</Link>
                <Link href="/listen" style={navStyle}>Listen</Link>
                <Link href="https://wxyc.bigcartel.com/" legacyBehavior style={navStyle}>
                    <a target="_blank" rel="noopener noreferrer">Merch</a>
                </Link>
            </div>
        </div>
    )
}

export default Header