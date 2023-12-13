import React from 'react'
import '/styles/globals.css'
import {Layout} from '../components/Layout'

const App = ({Component, pageProps}) => {
	return (
		<div className="flex flex-col lg:items-center">
			<div className="w-92 m-0 flex h-full max-w-screen-2xl flex-col overflow-hidden bg-black font-poppins text-base text-white">
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</div>
		</div>
	)
}

export default App
