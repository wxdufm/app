// privacy policy
const Privacy = () => {
	return (
		<div className="m-5 flex justify-center align-middle">
			<div className="flex-column prose text-white">
				<h1 className="font-kallisto text-5xl font-normal text-white">
					Privacy Policy
				</h1>
				<h2 className="text-white">1. Introduction</h2>
				<p>
					WXYC is dedicated to respecting the privacy of our listeners. This
					Privacy Policy explains the data practices of our Android and iOS
					apps.
				</p>

				<h2 className="text-white">2. Information Collection</h2>
				<p>
					Our app does not require users to log in and does not collect any
					personal data or usage logs from its users.
				</p>

				<h2 className="text-white">3. Data Usage</h2>
				<p>
					As we do not collect any personal data, there is no usage of data for
					any purposes including marketing, advertising, or analytics.
				</p>

				<h2 className="text-white">4. Third-Party Services</h2>
				<p>
					Our app does not share any data with third-party services as no
					personal data is collected.
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
