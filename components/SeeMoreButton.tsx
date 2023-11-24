import React from 'react';
import { IoIosArrowDown } from "react-icons/io";

// See more button on blog and archive pages, after scrolling 
const SeeMoreButton = ({ onClick }) => {
  return (
    <div className="flex justify-center my-6 cursor-pointer">
      <button className="text-white hover:underline text-2xl kallisto mr-2" onClick={onClick}>
        See More 
      </button>
      <IoIosArrowDown size={24} className="flex my-auto" onClick={onClick}/>
    </div>
  );
};

export default SeeMoreButton;