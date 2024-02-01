import {AiFillInstagram, AiFillTwitterCircle} from 'react-icons/ai'
import {FaTiktok} from 'react-icons/fa'
import {FiMail} from 'react-icons/fi'
import {BsSpotify} from 'react-icons/bs'
import applebadge from '/images/apple_badge.svg'
import androidbadge from '/images/android_badge.svg'
import Image from 'next/image'

const Footer = () => {
	return (
		<div>
			<div className="mt-12 flex w-full items-center justify-center gap-8 pb-10 md:gap-24">
				<a target="_blank" href="https://instagram.com/wxyc893">
					<AiFillInstagram size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="https://twitter.com/wxyc">
					<AiFillTwitterCircle size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="https://tiktok.com/@wxyc893">
					<FaTiktok size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="mailto:info@wxyc.org">
					{' '}
					<FiMail size={44} className="ml-.5 mt-0.5" />
				</a>
				<a target="_blank" href="https://open.spotify.com/user/wxyc">
					{' '}
					<BsSpotify size={44} className="ml-;5 mt-0.5" />
				</a>
			</div>

			<div className="flex w-full flex-col">
				<p className=" mx-auto w-5/6 text-center text-sm">
					Listen on our mobile app, available for Apple and Android
				</p>
				<div className="mx-auto mb-10 flex h-full flex-col items-center justify-center md:flex-row">
					<a
						target="_blank"
						href="https://play.google.com/store/apps/details?id=org.wxyc.WXYCCH&pcampaignid=web_share"
					>
						<Image
							src={androidbadge}
							alt="Link to the WXYC Android mobile app"
						/>
					</a>

					<div className="md:ml-10">
						<a
							target="_blank"
							href="https://apps.apple.com/us/app/wxyc-radio/id353182815"
						>
							<Image src={applebadge} alt="Link to the WXYC Apple mobile app" />
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Footer
