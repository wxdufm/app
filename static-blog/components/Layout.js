import Link from 'next/link'
import Head from 'next/head'
import Header from './Header'
import { GoogleFonts } from 'next-google-fonts';
import "@fontsource/poppins";


export const Layout = (props) => {
  return (
    <div>
      <Head>
        <title>Tina App</title>
        <meta name="description" content="A TinaCMS Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <GoogleFonts href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" /> */}
      <header className='header'>
        <Header/>
      </header>
      <main style={{fontFamily: "Poppins"}}>{props.children}</main>
    </div>
  )
}
