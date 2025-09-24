import {AiFillInstagram, AiFillTwitterCircle} from 'react-icons/ai'
import {FaTiktok} from 'react-icons/fa'
import {FiMail} from 'react-icons/fi'
import {BsSpotify} from 'react-icons/bs'
import applebadge from '/images/apple_badge.svg'
import androidbadge from '/images/android_badge.svg'
import Image from 'next/image'
import {FaPhone} from 'react-icons/fa6'
import {FaBluesky} from 'react-icons/fa6'
import {AiFillGithub} from 'react-icons/ai'

const Footer = () => {
	return (
		// Footer is formatted as a column on phone screen and as a row on tablet+desktop screens
		<div className="mx-auto mb-3 mt-10 flex flex-col px-2 md:flex-row md:justify-around lg:mt-36 lg:px-24">
			<div className=" px-5">
				<p className=" text-lg font-bold md:text-xl">Connect</p>
				<div className="mt-2 flex w-full items-start justify-start gap-8 pb-5 lg:gap-10">
					<a target="_blank" href="https://instagram.com/wxdu">
						<AiFillInstagram size={32} className=" mt-0.5" />
					</a>
					<a target="_blank" href="https://bsky.app/profile/wxyc.org">
						<FaBluesky size={32} className="ml-.5 mt-0.5" />
					</a>
					<a target="_blank" href="https://tiktok.com/@wxyc893">
						<FaTiktok size={32} className="ml-.5 mt-0.5" />
					</a>
					<a target="_blank" href="https://open.spotify.com/user/wxyc">
						{' '}
						<BsSpotify size={32} className="ml-;5 mt-0.5" />
					</a>
					<a target="_blank" href="https://github.com/wxdu">
						<AiFillGithub size={32} className="ml-.5 mt-0.5" />
					</a>
				</div>
			</div>

			<div className="flex flex-col px-5">
				<p className=" w-5/6 text-lg font-bold md:text-xl">Listen</p>
				<div className=" flex items-center justify-start gap-4 ">
					<a
						target="_blank"
						href="https://play.google.com/store/apps/details?id=org.wxyc.WXYCCH&pcampaignid=web_share"
						className="w-36"
					>
						<Image
							src={androidbadge}
							alt="Link to the WXYC Android mobile app"
						/>
					</a>

					<div className="w-36 md:ml-10">
						<a
							target="_blank"
							href="https://apps.apple.com/us/app/wxyc-radio/id353182815"
						>
							<Image src={applebadge} alt="Link to the WXYC Apple mobile app" />
						</a>
					</div>
				</div>
			</div>

			<div className="px-5">
				<p className="text-lg font-bold md:text-xl">Contact</p>

				<a target="_blank" href="mailto:gm@wxdu.org">
					<div className="mt-2 flex items-center ">
						<FiMail size={20} className="mr-2" />
						<p>gm@wxdu.org</p>
					</div>
				</a>
				<a target="_blank" href="tel:9196848870">
					<div className="mt-2 flex items-center ">
						<FaPhone size={20} className="mr-2" />

						<p>(919) 684-8870</p>
					</div>
				</a>

				<p className="mt-5">
					WXDU 88.7FM <br></br>
					PO Box 90689 <br></br>
					Duke Station <br></br>
					Durham, NC 27708
				</p>
			</div>
		</div>
	)
}

export default Footer
