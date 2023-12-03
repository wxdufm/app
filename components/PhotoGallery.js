import React, { useState } from "react";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import greta from "../images/greta.jpeg";
import controlRoom from "../images/controlroom.png";
import cradleEvent from "../images/cradleevent.jpeg";
import guyInStation from "../images/guyinstation.jpeg";
import flourescent from "../images/flourescent.jpeg";
import crowdSunglasses from "../images/crowdsunglasses.jpeg";
import kickballBench from "../images/kickballbench.jpeg";
import Image from "next/image";

// to add images to gallery:
// (1) put in images directory
// (2) import them above
// (3) add to this images array
const images = [
  guyInStation,
  greta,
  flourescent,
  crowdSunglasses,
  kickballBench,
  controlRoom,
  cradleEvent,
];

export const PhotoGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full relative flex items-center mb-10">
      <div className="w-full h-full object-cover">
        <Image src={images[currentIndex]} alt="Gallery" sizes={"100vw"} />
      </div>

      <div className="arrows">
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer z-10"
        >
          <IoIosArrowDropleft size={42} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer z-10"
        >
          <IoIosArrowDropright size={42} />
        </button>
      </div>
    </div>
  );
};

export default PhotoGallery;
