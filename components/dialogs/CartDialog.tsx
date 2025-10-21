import React from 'react';
import FullPageDialog from './FullPageDialog';
import { useCart } from '../../contexts/CartContext';
import SVGIcon from '../SVGIcon';
import { SVG_PATHS } from '../../constants';

interface CartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

const CartDialog: React.FC<CartDialogProps> = ({ isOpen, onClose, onOpenCheckout }) => {
  const { cart, updateCartQuantity, removeCartItem, cartSubtotal, cartShipping, cartGrandTotal } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }
    onOpenCheckout();
  };

  const footer = (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 text-gray-700">
        <div className="flex justify-between text-base">
          <span>Subtotal</span>
          <span>৳{cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base">
          <span>Shipping</span>
          <span>৳{cartShipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-dashed border-gray-300 text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>৳{cartGrandTotal.toFixed(2)}</span>
        </div>
      </div>
      <button
        className="w-full py-4 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-400"
        onClick={handleCheckout}
        disabled={cart.length === 0}
      >
        Continue to checkout
      </button>
    </div>
  );

  return (
    <FullPageDialog isOpen={isOpen} onClose={onClose} title="My Cart" footer={footer}>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {cart.map((item, index) => (
            <div key={item.id} className="flex items-center py-4 relative">
              <img src={item.imag} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
              <div className="flex-grow">
                <p className="text-base font-semibold text-gray-800">{item.name}</p>
                <p className="text-lg font-bold text-gray-900">৳{(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    className="w-7 h-7 bg-red-500 text-white text-xl rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    onClick={() => updateCartQuantity(index, -1)}
                  >
                    -
                  </button>
                  <span className="font-bold text-gray-800 text-lg w-6 text-center">{item.quantity}</span>
                  <button
                    className="w-7 h-7 bg-red-500 text-white text-xl rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    onClick={() => updateCartQuantity(index, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="absolute top-3 right-0 text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => removeCartItem(index)}
              >
                <SVGIcon path={SVG_PATHS.CLOSE} className="w-5 h-5 stroke-2" fill="none" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FullPageDialog>
  );
};

export default CartDialog;