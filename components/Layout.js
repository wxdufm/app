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
        <link rel="icon" href="https://wxyc.org/wp-content/uploads/2022/12/10144964.png"/>
        <meta name="apple-itunes-app" content="app-id=353182815" />
      </Head>

      <header className='header'>
        <Header/>
      </header>
     
      <main className >{props.children}</main>
    </div>
  )
}
