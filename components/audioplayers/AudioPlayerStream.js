import React, {useState, useRef} from 'react'
import {FaPlay, FaPause} from 'react-icons/fa'
import soundwaves from '../../images/soundwaves.gif'
import nosoundwaves from '../../images/staticsoundwave.png'
import Image from 'next/image'

// audio player for radio broadcast aka infinite stream
const AudioPlayerStream = () => {
	const [isPlaying, setIsPlaying] = useState(false)

	const audioPlayer = useRef() // ref to audio player

	const togglePlayPause = () => {
		const prevValue = isPlaying
		setIsPlaying(!prevValue)
		if (!prevValue) {
			audioPlayer.current.play()
		} else {
			audioPlayer.current.pause()
		}
	}

	return (
		<div className="flex h-24 max-w-sm items-center justify-center">
			<div className="flex flex-row">
				<audio
					ref={audioPlayer}
					src="https://audio-mp3.ibiblio.org/wxyc.mp3"
				></audio>
				<button
					className="rounded-lg bg-transparent p-2 text-gray-200"
					onClick={togglePlayPause}
				>
					{isPlaying ? (
						<FaPause size={36} />
					) : (
						<FaPlay size={36} className="relative pl-0.5" />
					)}
				</button>

				{/* render moving waves vs still waves based on playing state */}
				<div className="w-54">
					{isPlaying && (
						<div className="pt-0.5">
							<Image src={soundwaves} />
						</div>
					)}
					{!isPlaying && (
						<div className="pt-1">
							<Image src={nosoundwaves} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default AudioPlayerStream
