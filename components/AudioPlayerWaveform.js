import React, { Component } from "react";
import WaveSurfer from "wavesurfer.js";

// audio player for embedding hosted mp3s in blog posts, waveform (uses wavesurfer library)
class AudioPlayerWaveform extends Component {
  wavesurfer2 = null;

  state = {
    playing: false,
  };

  componentDidMount({ url }) {
    this.wavesurfer2 = WaveSurfer.create({
      barWidth: 3,
      height: 100,
      container: "#waveform2",
      waveColor: "#EFEFEF",
      progressColor: "#2D5BFF",
      backend: "MediaElement",
      url: url,
    });
  }

  handlePlay = () => {
    this.setState({ playing: !this.state.playing });
    this.wavesurfer2.playPause();
  };

  render() {
    return (
      <div className="flex flex-row items-center justify-center h-24 w-full bg-transparent">
        <button
          className="flex justify-center items-center w-16 h-16 bg-gray-300 rounded-full border-none outline-none cursor-pointer pb-1 hover:bg-gray-500"
          onClick={this.handlePlay}
        >
          {!this.state.playing ? "Play" : "Pause"}
        </button>
        {/* container for waveform */}
        <div className="w-full h-20" id="waveform2" />
      </div>
    );
  }
}

export default AudioPlayerWaveform;
