import React from 'react';

const SeeMoreButton = ({ onClick }) => {
  return (
    <div className="flex justify-center mt-4">
      <button className="text-blue-500 hover:underline" onClick={onClick}>
        See More
      </button>
    </div>
  );
};

export default SeeMoreButton;