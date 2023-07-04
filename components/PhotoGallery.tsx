import React, { useState } from 'react';
import {IoIosArrowDropright, IoIosArrowDropleft} from "react-icons/io"

export const PhotoGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="w-full relative flex items-center mb-10">
 
      <img src={images[currentIndex]} alt="Gallery" className='w-full object-cover'/>

      <div className="arrows">
        <button onClick={goToPrevious} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer z-10">
            <IoIosArrowDropleft size={42}/>
        </button>
        <button onClick={goToNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer z-10">
            <IoIosArrowDropright size={42}/>
        </button>
      </div>
    </div>
  );
};

export default PhotoGallery;
