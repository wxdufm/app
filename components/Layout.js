import Link from 'next/link'
import Head from 'next/head'
import Header from './Header'
// import photo from '../images/10144964.png'

export const Layout = (props) => {
  return (
    <div>
      <Head>
        <title>WXYC</title>
        <meta name="description" content="WXYC's website" />
        <link rel="icon" href="/10144964.png"/>
        {/* <link rel="icon" href="../public/favicon.ico"/> */}
      </Head>

      <header className='header'>
        <Header/>
      </header>
     
      <main className >{props.children}</main>
    </div>
  )
}
