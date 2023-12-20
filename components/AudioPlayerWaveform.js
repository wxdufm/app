import React, {Component} from 'react'
import WaveSurfer from 'wavesurfer.js'

// audio player for embedding hosted mp3s in blog posts, waveform (uses wavesurfer library)
class AudioPlayerWaveform extends Component {
	wavesurfer2 = null

	state = {
		playing: false,
	}

	componentDidMount({url}) {
		this.wavesurfer2 = WaveSurfer.create({
			barWidth: 3,
			height: 100,
			container: '#waveform2',
			waveColor: '#EFEFEF',
			progressColor: '#2D5BFF',
			backend: 'MediaElement',
			url: url,
		})
	}

	handlePlay = () => {
		this.setState({playing: !this.state.playing})
		this.wavesurfer2.playPause()
	}

	render() {
		return (
			<div className="flex h-24 w-full flex-row items-center justify-center bg-transparent">
				<button
					className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-none bg-gray-300 pb-1 outline-none hover:bg-gray-500"
					onClick={this.handlePlay}
				>
					{!this.state.playing ? 'Play' : 'Pause'}
				</button>
				{/* container for waveform */}
				<div className="h-20 w-full" id="waveform2" />
			</div>
		)
	}
}

export default AudioPlayerWaveform
