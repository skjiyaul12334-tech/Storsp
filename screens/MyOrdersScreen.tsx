import React, { useState, useEffect } from 'react';
import { Order, DialogType, Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserOrders, cancelOrder } from '../services/firebaseService';
import SVGIcon from '../components/SVGIcon';
import { SVG_PATHS } from '../constants';

interface MyOrdersScreenProps {
  onOpenDialog: (type: DialogType, orderKey?: string) => void;
}

const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({ onOpenDialog }) => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = fetchUserOrders(currentUser.uid, (fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => {
      // If `fetchUserOrders` provided an unsubscribe function, call it here.
    };
  }, [currentUser]);

  const handleCancelOrder = async (orderKey: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderKey);
        alert("Order cancelled successfully.");
      } catch (error: any) {
        alert("Error: " + error.message);
      }
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Order Confirmed': return 'text-blue-600';
      case 'Shipped': return 'text-yellow-600';
      case 'Out for Delivery': return 'text-purple-600';
      case 'Delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4 text-center text-gray-600 min-h-screen-minus-header-nav flex items-center justify-center">
        Please log in to view your orders.
      </div>
    );
  }

  return (
    <main className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <SVGIcon path={SVG_PATHS.ORDERS} className="w-7 h-7 text-gray-700" /> My Orders
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const firstItem = order.products[0];
            const totalOrderAmount = order.products.reduce((acc, p) => acc + p.total, 0) + 50; // Add fixed shipping
            const canCancel = order.status === 'Order Confirmed';

            return (
              <div key={order.key} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-500">ID: {order.transactionId}</span>
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>

                <div className="flex items-center border-t border-gray-200 pt-3">
                  <img src={firstItem.image} alt={firstItem.name} className="w-14 h-14 object-cover rounded-md mr-3" />
                  <div>
                    <p className="text-base font-medium text-gray-800">
                      <strong>{firstItem.name}</strong>
                      {order.products.length > 1 ? ` & ${order.products.length - 1} more` : ''}
                    </p>
                    <p className="text-sm text-gray-600">Items: {order.products.reduce((acc, p) => acc + p.quantity, 0)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                  <span className="text-lg font-bold text-gray-900">৳{totalOrderAmount.toFixed(2)}</span>
                  <div className="flex space-x-2">
                    {canCancel && (
                      <button
                        className="px-4 py-2 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition-colors"
                        onClick={() => handleCancelOrder(order.key)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition-colors"
                      onClick={() => onOpenDialog(DialogType.OrderTrack, order.key)}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyOrdersScreen;