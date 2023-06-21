import React, { useState } from 'react';
import ChildDropdown from './ChildDropdown';

function ParentDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="parent-dropdown">
      <button onClick={handleToggle}>Toggle Menu</button>
      {isOpen && <ChildDropdown />}
    </div>
  );
}

export default ParentDropdown;
