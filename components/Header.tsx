import React from 'react';
import SVGIcon from './SVGIcon';
import { SVG_PATHS } from '../constants';
import { useCart } from '../contexts/CartContext';
import { AppUser } from '../types';

interface HeaderProps {
  currentUser: AppUser | null;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onOpenWishlist, onOpenCart }) => {
  const { cartTotalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-red-600 text-white p-4 flex items-center justify-between gap-4 shadow-md">
      <div className="flex items-center space-x-3">
        <img
          src="https://i.pravatar.cc/150" // Placeholder for user avatar
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
        />
        {currentUser && <span className="font-semibold hidden sm:block">{currentUser.displayName}</span>}
      </div>

      <div className="flex-grow bg-white rounded-full px-4 py-2 flex items-center shadow-inner max-w-sm mx-auto">
        <SVGIcon path={SVG_PATHS.SEARCH} className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search for products..."
          className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
          onClick={() => alert('Search clicked!')} // Original functionality preserved
          readOnly // Prevent actual typing for now
        />
      </div>

      <div className="flex items-center space-x-3">
        <button className="relative p-1" onClick={onOpenWishlist}>
          <SVGIcon path={SVG_PATHS.HEART} className="w-6 h-6 text-white" />
        </button>

        <button className="relative p-1" onClick={onOpenCart}>
          <SVGIcon path={SVG_PATHS.CART} className="w-6 h-6 text-white" />
          {cartTotalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-red-600 animate-pulse">
              {cartTotalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;