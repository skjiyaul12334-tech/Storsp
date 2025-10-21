import React from 'react';

interface SVGIconProps {
  path: string;
  className?: string;
  viewBox?: string;
  fill?: string;
  stroke?: string; // Add stroke prop
  strokeWidth?: string; // Add strokeWidth prop
  onClick?: () => void;
}

const SVGIcon: React.FC<SVGIconProps> = ({ path, className = "w-6 h-6", viewBox = "0 0 24 24", fill = "currentColor", stroke, strokeWidth, onClick }) => {
  return (
    <svg className={className} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} onClick={onClick}>
      <path d={path} />
    </svg>
  );
};

export default SVGIcon;