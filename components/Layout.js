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
        <link rel="icon" href="https://is4-ssl.mzstatic.com/image/thumb/Purple116/v4/6c/55/f8/6c55f8ad-cfed-ddd7-e63d-9e8c979d7251/source/512x512bb.jpg"/>
        <meta name="apple-itunes-app" content="app-id=353182815" />
      </Head>

      <header className='header'>
        <Header/>
      </header>
     
      <main className >{props.children}</main>
    </div>
  )
}
