// Button.jsx
import React from 'react';

const GenButton = ({
  text, 
  onClick, 
  bgColor = 'bg-blue-500', 
  textColor = 'text-white', 
  borderRadius = 'rounded-md', 
  size = 'py-2 px-4', 
  className = '', 
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${textColor} ${borderRadius} ${size} ${className} transition-all shadow-md hover:shadow-lg focus:bg-opacity-90 active:bg-opacity-80`}
    >
      {text}
    </button>
  );
};

export default GenButton;
