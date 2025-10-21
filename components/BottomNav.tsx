import React from 'react';
import SVGIcon from './SVGIcon';
import { SVG_PATHS } from '../constants';
import { NavScreen } from '../types';

interface BottomNavProps {
  activeScreen: NavScreen;
  onScreenChange: (screen: NavScreen) => void;
}

const navItems = [
  { id: NavScreen.Home, label: 'Home', icon: SVG_PATHS.HOME },
  { id: NavScreen.Category, label: 'Category', icon: SVG_PATHS.CATEGORY },
  { id: NavScreen.MyOrders, label: 'My Orders', icon: SVG_PATHS.ORDERS },
  { id: NavScreen.Profile, label: 'Profile', icon: SVG_PATHS.PROFILE },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onScreenChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg flex justify-around py-2 px-2 border-t border-gray-200 h-16">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center justify-center flex-1 text-xs font-medium transition-colors duration-200 ${
            activeScreen === item.id ? 'text-red-600' : 'text-gray-500 hover:text-red-500'
          }`}
          onClick={() => onScreenChange(item.id)}
        >
          <SVGIcon
            path={item.icon}
            className={`w-6 h-6 mb-1 ${activeScreen === item.id ? 'text-red-600' : 'text-gray-500'}`}
          />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;