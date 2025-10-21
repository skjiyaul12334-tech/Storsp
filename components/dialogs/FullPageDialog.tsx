import React, { ReactNode } from 'react';
import SVGIcon from '../SVGIcon';
import { SVG_PATHS } from '../../constants';

interface FullPageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  showCartAndSearch?: boolean; // New prop for custom header icons
  onCartClick?: () => void;
  onSearchClick?: () => void;
}

const FullPageDialog: React.FC<FullPageDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCartAndSearch = false,
  onCartClick,
  onSearchClick,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center p-4 text-xl font-semibold border-b border-gray-200 shadow-sm relative">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none">
          <SVGIcon path={SVG_PATHS.CLOSE} className="w-6 h-6 stroke-2" fill="none" />
        </button>
        <span className="flex-grow text-center">{title}</span>
        {showCartAndSearch && (
          <div className="flex items-center space-x-4">
            <button onClick={onSearchClick} className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <SVGIcon path={SVG_PATHS.SEARCH} className="w-6 h-6" />
            </button>
            <button onClick={onCartClick} className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              <SVGIcon path={SVG_PATHS.CART} className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto p-4">{children}</div>
      {footer && (
        <div className="p-4 bg-white shadow-lg border-t border-gray-200">{footer}</div>
      )}
    </div>
  );
};

export default FullPageDialog;