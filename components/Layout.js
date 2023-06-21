import Link from 'next/link'
import Head from 'next/head'
import Header from './Header'

export const Layout = (props) => {
  return (
    <div>
      <Head>
        <title>Tina App</title>
        <meta name="description" content="A TinaCMS Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='header'>
        <Header/>
      </header>
      <main>{props.children}</main>
    </div>
  )
}
