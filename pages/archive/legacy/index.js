import Link from 'next/link'
import ArchiveLayout from '../../../components/ArchiveLayout'

export default function ArchiveHistoryIndex() {
	return (
		<ArchiveLayout>
			<div className="mx-auto mt-6 w-full max-w-4xl">
				<h1 className="text-4xl lg:text-5xl">Historical Collections</h1>
				<p className="mt-4 text-base text-gray-200 md:text-lg">
					Old stuff yeah
				</p>

				{/* each new historical collection goes in one of these and gets a <name>.js redirect file*/}
				<div className="mt-8 rounded border border-white/30 p-5">
					<h2 className="text-2xl font-semibold underline text-m hover:no-underline">
						<Link
							href="/archive/legacy/seize"
						>
							Seizing the Sound
						</Link>
					</h2>
					<p className="mt-2 text-sm text-gray-300 md:text-base">
						College Radio and Cultural Conflict in the University Environment.
					</p>
				</div>

				<div className="mt-8 rounded border border-white/30 p-5">
					<h2 className="text-2xl font-semibold underline text-m hover:no-underline">
						<Link
							href="/archive/legacy/blogger"
						>
							ancient blog posts and such
						</Link>
					</h2>
					<p className="mt-2 text-sm text-gray-300 md:text-base">
						yeah that's a smart statement right there.
					</p>
				</div>

				<div className="mt-8 rounded border border-white/30 p-5">
					<h2 className="text-2xl font-semibold underline text-m hover:no-underline">
						<Link
							href="/archive/legacy/weeklycharts"
						>
							old charts
						</Link>
					</h2>
					<p className="mt-2 text-sm text-gray-300 md:text-base">
						top plays and such
					</p>
				</div>

			</div>
		</ArchiveLayout>
	)
}
