import React, { useState, useEffect } from 'react';
import FullPageDialog from './FullPageDialog';
import { Order } from '../../types';
import { fetchOrderById } from '../../services/firebaseService';
import SVGIcon from '../SVGIcon';
import { SVG_PATHS } from '../../constants';

interface OrderTrackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderKey: string | null;
}

const OrderTrackDialog: React.FC<OrderTrackDialogProps> = ({ isOpen, onClose, orderKey }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (isOpen && orderKey) {
        setLoading(true);
        const fetchedOrder = await fetchOrderById(orderKey);
        setOrder(fetchedOrder);
        setLoading(false);
      } else if (!isOpen) {
        setOrder(null); // Clear order data when dialog closes
      }
    };
    loadOrder();
  }, [isOpen, orderKey]);

  if (!order) return null; // Or show a loading spinner

  const statuses = ['Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  const renderTrackerStep = (status: string, index: number, iconPath: string) => {
    const isCompleted = index <= currentStatusIndex;
    return (
      <li className={`relative flex items-start pb-8 ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
        <div
          className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
          }`}
        >
          {/* Fix: Pass strokeWidth prop */}
          <SVGIcon path={iconPath} className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" />
        </div>
        <div className="ml-4 pt-1">
          <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-700'}`}>{status}</p>
        </div>
        {index < statuses.length - 1 && (
          <div
            className={`absolute left-4 top-8 h-full border-l-2 ${
              isCompleted ? 'border-green-500' : 'border-dashed border-gray-300'
            }`}
          ></div>
        )}
      </li>
    );
  };

  return (
    <FullPageDialog isOpen={isOpen} onClose={onClose} title="Track Order">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-lg text-gray-700">Order ID: <strong className="text-gray-900">{order.transactionId}</strong></p>

          <ul className="list-none p-0 relative">
            {renderTrackerStep('Order Confirmed', 0, SVG_PATHS.CHECKMARK_CONFIRMED)}
            {renderTrackerStep('Shipped', 1, SVG_PATHS.CHECKMARK_SHIPPED)}
            {renderTrackerStep('Out for Delivery', 2, SVG_PATHS.CHECKMARK_OUT_FOR_DELIVERY)}
            {renderTrackerStep('Delivered', 3, SVG_PATHS.CHECKMARK_DELIVERED)}
          </ul>

          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-center shadow-inner">
            <p>Live Location Map (Simulation)</p>
          </div>
        </div>
      )}
    </FullPageDialog>
  );
};

export default OrderTrackDialog;