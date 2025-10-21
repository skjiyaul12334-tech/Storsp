import React, { useEffect, useState } from 'react';
import { BANNER_IMAGES } from '../constants';

interface Banner {
  imgUrl: string;
}

const BannerSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % BANNER_IMAGES.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden relative rounded-lg shadow-md">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {BANNER_IMAGES.map((banner, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img src={banner.imgUrl} alt={`Banner ${index + 1}`} className="w-full h-40 object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
        {BANNER_IMAGES.map((_, index) => (
          <span
            key={index}
            className={`block w-2 h-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;