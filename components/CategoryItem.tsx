import React from 'react';
import { Category } from '../types';

interface CategoryItemProps {
  category: Category;
  onClick: (category: Category) => void;
  isActive?: boolean;
  type: 'home' | 'sidebar';
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onClick, isActive, type }) => {
  const handleClick = () => {
    onClick(category);
  };

  if (type === 'home') {
    return (
      <div
        className="flex flex-col items-center text-center cursor-pointer flex-shrink-0 w-20"
        onClick={handleClick}
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mb-2 bg-white p-0.5 shadow-sm"
        />
        <span className="text-xs font-medium text-gray-600 truncate w-full">{category.name}</span>
      </div>
    );
  }

  // type === 'sidebar'
  return (
    <div
      className={`relative flex flex-col items-center py-3 px-1 cursor-pointer text-center text-sm transition-all duration-200 ${
        isActive ? 'bg-white text-purple-700 font-semibold shadow-inner' : 'text-gray-700 hover:bg-gray-50'
      }`}
      onClick={handleClick}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-600 rounded-r-md"></div>
      )}
      <img
        src={category.image}
        alt={category.name}
        className="w-10 h-10 rounded-full object-cover mb-1.5 shadow-sm"
      />
      <span className={`text-xs ${isActive ? 'text-purple-700 font-bold' : 'text-gray-600'}`}>{category.name}</span>
    </div>
  );
};

export default CategoryItem;