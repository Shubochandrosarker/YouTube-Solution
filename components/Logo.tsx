import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M20 20 C 40 20, 50 80, 60 100 C 70 80, 80 50, 80 50 C 80 50, 90 80, 100 100 C 110 80, 115 20, 115 20" 
      stroke="#00BF63" 
      strokeWidth="18" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M85 20 L 115 20 L 100 60 Z" 
      fill="#00BF63"
    />
  </svg>
);