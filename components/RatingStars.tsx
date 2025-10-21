import React from 'react';
import SVGIcon from './SVGIcon';
import { SVG_PATHS } from '../constants';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxRating = 5, className }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    if (i <= rating) {
      stars.push(
        <SVGIcon key={i} path={SVG_PATHS.STAR_FILLED} className="w-4 h-4 text-yellow-500 fill-current" />
      );
    } else if (i - 0.5 === rating) {
      // This case handles half stars if a more complex SVG path for half star is available.
      // For simplicity, we'll treat it as empty or use a filled if close enough.
      // To truly represent half, a different SVG or a masking approach would be needed.
      // For now, let's just make it visually distinct or fallback.
      stars.push(
        <SVGIcon key={i} path={SVG_PATHS.STAR_EMPTY} className="w-4 h-4 text-yellow-400 fill-current" /> // Or a specific half-star SVG
      );
    } else {
      stars.push(
        <SVGIcon key={i} path={SVG_PATHS.STAR_EMPTY} className="w-4 h-4 text-gray-300 fill-current" />
      );
    }
  }

  return (
    <div className={`flex items-center space-x-0.5 ${className}`}>
      {stars}
    </div>
  );
};

export default RatingStars;