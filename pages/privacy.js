// privacy policy
const Privacy = () => {
	return (
		<div className="m-5 flex justify-center align-middle">
			<div className="flex-column prose text-white">
				<h1 className="font-kallisto text-5xl font-normal text-white">
					Privacy Policy
				</h1>
				<p className="text-white">Last updated: March 18, 2025</p>
				<h2 className="text-white">1. Introduction</h2>
				<p>
					WXYC is dedicated to respecting the privacy of our listeners. This
					Privacy Policy explains the data practices of our website, Android
					app, and iOS app.
				</p>

				<h2 className="text-white">2. Information Collection</h2>
				<p>
					Our website, Android app, and iOS app collect anonymous analytics data
					to help us understand performance and usage trends. This data does not
					include personally identifiable information.
				</p>

				<h2 className="text-white">3. Data Usage</h2>
				<p>
					The anonymous analytics data we collect is used solely for improving
					our services, including app performance and user experience. No
					personally identifiable information is collected or used for marketing
					or advertising.
				</p>

				<h2 className="text-white">4. Third-Party Services</h2>
				<p>
					We use{' '}
					<a href="https://posthog.com/" className="text-white">
						PostHog
					</a>{' '}
					to collect and analyze anonymous analytics data. No personally
					identifiable information is shared with PostHog or any other third
					parties.
				</p>

				<h2 className="text-white">5. Changes to This Privacy Policy</h2>
				<p>
					We may update our Privacy Policy from time to time. We will notify you
					of any changes by posting the new Privacy Policy on this page.
				</p>

				<h2 className="text-white">6. Contact Us</h2>
				<p>
					If you have any questions about this Privacy Policy, please contact us
					at{' '}
					<a className="text-white" href="mailto:privacy@wxyc.org">
						privacy@wxyc.org
					</a>
					.
				</p>
			</div>
		</div>
	)
}

export default Privacy
