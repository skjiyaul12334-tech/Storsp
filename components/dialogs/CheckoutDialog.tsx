import React, { useState, useEffect } from 'react';
import FullPageDialog from './FullPageDialog';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { placeOrder } from '../../services/firebaseService';
import { OrderProduct } from '../../types';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, cartGrandTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pre-fill with user info if available or from a saved profile
      setFullName(currentUser?.displayName || '');
      // Clear address fields for new entry, or load from saved profile if implemented
      setPhoneNumber('');
      setFullAddress('');
    }
  }, [isOpen, currentUser]);

  const handleConfirmOrder = async () => {
    if (!fullName || !phoneNumber || !fullAddress) {
      alert('Please fill in all shipping details.');
      return;
    }
    if (!currentUser) {
      alert('Authentication error. Please log in again.');
      return;
    }

    setIsLoading(true);
    try {
      const productsData: OrderProduct[] = cart.map(item => ({
        id: item.id,
        image: item.imag,
        name: item.name,
        quantity: item.quantity,
        unite: item.price,
        total: item.price * item.quantity,
      }));

      const orderData = {
        address: fullAddress,
        orderDate: new Date().toISOString(),
        paymentMethod: "Cash on Delivery", // Hardcoded as per original
        phone: phoneNumber,
        // Fix: Explicitly cast the status to the literal type to satisfy the interface.
        status: "Order Confirmed" as const, // Initial status
        transactionId: `TXN${Date.now()}`,
        userId: currentUser.uid,
        userName: currentUser.displayName || "Guest User",
        products: productsData,
      };

      await placeOrder(orderData);
      clearCart();
      onClose();
      onOrderSuccess();
    } catch (error: any) {
      alert('Order failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <div className="space-y-4">
      <div className="flex justify-between text-xl font-bold text-gray-900">
        <span>Total</span>
        <span>৳{cartGrandTotal.toFixed(2)}</span>
      </div>
      <button
        className="w-full py-4 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
        onClick={handleConfirmOrder}
        disabled={isLoading || cart.length === 0}
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          'Confirm Order'
        )}
      </button>
    </div>
  );

  return (
    <FullPageDialog isOpen={isOpen} onClose={onClose} title="Checkout" footer={footer}>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="checkout-name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-800"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="checkout-phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-800"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">
              Full Address
            </label>
            <input
              type="text"
              id="checkout-address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-gray-800"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              required
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mt-6">Order Summary</h3>
        <div className="space-y-2 text-gray-700">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-base">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>৳{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </FullPageDialog>
  );
};

export default CheckoutDialog;