import React, { useState, useEffect } from 'react';
import FullPageDialog from './FullPageDialog';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import RatingStars from '../RatingStars';

interface ProductViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onOpenCart: () => void;
}

const ProductViewDialog: React.FC<ProductViewDialogProps> = ({ isOpen, onClose, product, onOpenCart }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setQuantity(1); // Reset quantity when dialog opens
    }
  }, [isOpen]);

  if (!product) return null;

  const updateQuantity = (change: number) => {
    setQuantity(prevQty => Math.max(1, prevQty + change));
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    alert(`${product.name} (x${quantity}) added to cart!`);
    onClose();
    onOpenCart();
  };

  const displayPrice = product.offerPrice && product.offerPrice < product.price
    ? product.offerPrice.toFixed(2)
    : product.price.toFixed(2);
  const showOffer = product.offerPrice && product.offerPrice < product.price;

  const footer = (
    <button
      className="w-full py-4 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-colors"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );

  return (
    <FullPageDialog isOpen={isOpen} onClose={onClose} title="Product Details" footer={footer}>
      <div className="flex flex-col items-center">
        <img src={product.imag} alt={product.name} className="w-full h-64 object-contain mb-4 rounded-lg shadow-md" />
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{product.name}</h2>

        <div className="flex items-center justify-between w-full max-w-sm mb-4">
          <div className="flex flex-col">
            {showOffer && (
              <p className="text-base text-gray-500 line-through">৳{product.price.toFixed(2)}</p>
            )}
            <span className="text-3xl font-bold text-red-600">৳{displayPrice}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="w-10 h-10 bg-red-500 text-white text-2xl rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              onClick={() => updateQuantity(-1)}
            >
              -
            </button>
            <span className="text-xl font-bold text-gray-800 w-8 text-center">{quantity}</span>
            <button
              className="w-10 h-10 bg-red-500 text-white text-2xl rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              onClick={() => updateQuantity(1)}
            >
              +
            </button>
          </div>
        </div>

        {(product.averageRating !== undefined && product.reviewCount !== undefined) && (
          <div className="flex items-center mb-4 text-lg text-gray-700">
            <RatingStars rating={product.averageRating} className="mr-2" />
            <span className="text-sm">({product.reviewCount} Reviews)</span>
          </div>
        )}

        <p className="text-gray-700 leading-relaxed text-center">{product.Description || 'No description available.'}</p>
      </div>
    </FullPageDialog>
  );
};

export default ProductViewDialog;