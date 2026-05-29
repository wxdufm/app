import React from 'react'
import '/styles/globals.css'
import {Layout} from '../components/Layout'
import {PostHogProvider} from 'posthog-js/react'
import {useEffect} from 'react'
import {Router} from 'next/router'
import posthog from 'posthog-js'
import { AudioProvider } from '../components/AudioContext'
import NavPlayer from '../components/audioplayers/NavPlayer'
import DJRequestWidget from '../components/DJRequestWidget'

const App = ({Component, pageProps}) => {
	useEffect(() => {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host:
				process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
			person_profiles: 'identified_only',
			// Enable debug mode in development
			loaded: (posthog) => {
				if (process.env.NODE_ENV === 'development') posthog.debug()
			},
		})

		const handleRouteChange = () => posthog?.capture('$pageview')

		Router.events.on('routeChangeComplete', handleRouteChange)

		return () => {
			Router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [])
	return (
		<PostHogProvider client={posthog}>
			<AudioProvider>
				<div className="flex flex-col lg:items-center">
					<div className="m-0 flex h-full w-full flex-col overflow-hidden bg-black font-poppins text-base text-white">
						<NavPlayer />
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</div>
				</div>
				<DJRequestWidget />
			</AudioProvider>
		</PostHogProvider>
	)
}

export default App
