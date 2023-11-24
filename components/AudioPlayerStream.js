import React, { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import soundwaves from "images/soundwaves.gif";
import nosoundwaves from "images/staticsoundwave.png";
import Image from "next/image";

const AudioPlayerStream = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayer = useRef();

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
    } else {
      audioPlayer.current.pause();
    }
  };

  return (
    <div className="flex items-center justify-center h-24 max-w-sm">
      <div className="flex flex-row">
        <audio
          ref={audioPlayer}
          src="https://audio-mp3.ibiblio.org/wxyc.mp3"
        ></audio>
        <button
          className="bg-transparent text-gray-200 rounded-lg p-2"
          onClick={togglePlayPause}
        >
          {isPlaying ? <FaPause size={36}/> : <FaPlay size={36} className="relative pl-0.5" />}
        </button>

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
  );
};

export default AudioPlayerStream;
