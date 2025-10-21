import React from 'react';
import { Product } from '../types';
import SVGIcon from './SVGIcon';
import { SVG_PATHS } from '../constants';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import RatingStars from './RatingStars';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const { isProductWishlisted, toggleWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    alert(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const displayPrice = product.offerPrice && product.offerPrice < product.price
    ? product.offerPrice.toFixed(2)
    : product.price.toFixed(2);
  const showOffer = product.offerPrice && product.offerPrice < product.price;

  return (
    <div
      className="relative flex flex-col bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onProductClick(product)}
    >
      <div
        className={`absolute top-2 right-2 p-1.5 rounded-full bg-white bg-opacity-80 cursor-pointer z-10`}
        onClick={handleToggleWishlist}
      >
        <SVGIcon
          path={SVG_PATHS.HEART}
          className={`w-5 h-5 transition-colors ${
            isProductWishlisted(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
          }`}
        />
      </div>

      <img src={product.imag} alt={product.name} className="w-full h-32 object-cover" />

      <div className="p-3 flex-grow flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">{product.name}</h3>
        {showOffer && (
          <p className="text-xs text-gray-500 line-through">৳{product.price.toFixed(2)}</p>
        )}
        <p className="text-base font-bold text-red-600">৳{displayPrice}</p>

        {(product.averageRating !== undefined && product.reviewCount !== undefined) && (
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <RatingStars rating={product.averageRating} />
            <span className="ml-1 text-xs">({product.reviewCount} Reviews)</span>
          </div>
        )}

        <button
          className="mt-3 bg-red-500 text-white text-xs font-medium py-2 px-3 rounded-full hover:bg-red-600 transition-colors self-start"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;