import React, { useState, useEffect } from 'react';
import FullPageDialog from './FullPageDialog';
import { useWishlist } from '../../contexts/WishlistContext';
import { fetchProductById } from '../../services/firebaseService';
import { Product } from '../../types';
import ProductCard from '../ProductCard'; // Use ProductCard for consistent display

interface WishlistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductView: (product: Product) => void;
  onOpenCart: () => void;
}

const WishlistDialog: React.FC<WishlistDialogProps> = ({ isOpen, onClose, onOpenProductView, onOpenCart }) => {
  const { wishlistProductIds, loadingWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (isOpen && wishlistProductIds.length > 0) {
        setLoadingProducts(true);
        const fetchedProducts = await Promise.all(
          wishlistProductIds.map(id => fetchProductById(id))
        );
        setWishlistProducts(fetchedProducts.filter(Boolean) as Product[]);
        setLoadingProducts(false);
      } else if (isOpen && wishlistProductIds.length === 0) {
        setWishlistProducts([]);
        setLoadingProducts(false);
      }
    };

    if (isOpen) {
      loadWishlistProducts();
    }
  }, [isOpen, wishlistProductIds]);

  const handleSearchClick = () => {
    alert('Search functionality (Wishlist) coming soon!');
    // In a real app, this would likely open a search dialog or navigate to a search page
  };

  if (!isOpen) return null;

  return (
    <FullPageDialog
      isOpen={isOpen}
      onClose={onClose}
      title="My Wishlist"
      showCartAndSearch={true} // Enable cart and search icons in header
      onCartClick={onOpenCart}
      onSearchClick={handleSearchClick}
    >
      {loadingWishlist || loadingProducts ? (
        <div className="flex justify-center items-center h-full">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} onProductClick={onOpenProductView} />
          ))}
        </div>
      )}
    </FullPageDialog>
  );
};

export default WishlistDialog;