import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

export const Layout = (props) => {
	return (
		<div>
			<Head>
				<title>WXDU</title>
				<meta
					name="description"
					content="Duke and Durham's alternative, non-commercial radio station"
				/>
        {/* comments out wxyc favicon
				<link
					rel="icon"
					href="https://is4-ssl.mzstatic.com/image/thumb/Purple116/v4/6c/55/f8/6c55f8ad-cfed-ddd7-e63d-9e8c979d7251/source/512x512bb.jpg"
				/>
                */}
				{/* app download banner on iphone */}
				<meta name="apple-itunes-app" content="app-id=353182815" />
			</Head>

			<header className="header">
				<Header />
			</header>

			<main>{props.children}</main>
			<Footer />
		</div>
	)
}
