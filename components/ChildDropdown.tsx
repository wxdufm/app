import React, { useState } from 'react';

function ChildDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="child-dropdown">
      <button onClick={handleToggle}>Toggle Nested Menu</button>
      {isOpen && (
        <ul>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )}
    </div>
  );
}

export default ChildDropdown;
