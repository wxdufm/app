import React, { useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";

const Banner = ({ children }) => {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) {
    return null; // Don't render the banner if it's closed
  }

  return (
    <div className="mx-auto bg-neutral-800 w-5/6  h-12 md:h-14 lg:h-12 rounded-3xl flex flex-row justify-between items-center mb-10 lg:mb-1">
        <p className="ml-5 text-xs md:text-base py-2 lg:text-base">NEW: The WXYC Android app is now available to download on Google Play!</p>
      <button
        className="font-bold mr-2 md:mr-5 lg:mr-10"
        onClick={() => setIsClosed(true)}
      >
        <IoIosCloseCircle size={32} />
      </button>
      {children}
    </div>
  );
};

export default Banner;