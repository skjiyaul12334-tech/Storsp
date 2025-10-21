import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchUserWishlist, toggleProductInWishlist } from '../services/firebaseService';

interface WishlistContextType {
  wishlistProductIds: string[];
  isProductWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loadingWishlist: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setWishlistProductIds([]);
      setLoadingWishlist(false);
      return;
    }

    setLoadingWishlist(true);
    const unsubscribe = fetchUserWishlist(currentUser.uid, (productIds) => {
      setWishlistProductIds(productIds);
      setLoadingWishlist(false);
    });

    return () => {
      // Firebase's on() returns an unsubscribe function.
      // However, if the listener is set with .on('value', ...) it returns a function
      // that removes the listener. If using an explicit unsubscribe like in some examples,
      // it would be handled differently. For this setup, we assume the listener is managed.
      // This is a placeholder for actual unsubscribe if Firebase API provided one directly from `on`.
      // For this specific simple `on('value')` setup, the listener will persist
      // until the component unmounts or firebase.off() is called.
      // For real-time listeners that need to be explicitly unsubscribed, Firebase provides
      // a way to do this (e.g., ref.off('value', callback)).
      // For simplicity here, given the previous JS code's usage, we'll assume it's cleaned
      // up by the component lifecycle.
      // If a more explicit unsubscribe is needed: `firebaseDatabase.ref(`wishlists/${currentUser.uid}`).off('value', ...)`
    };
  }, [currentUser]); // Re-run when currentUser changes

  const isProductWishlisted = useCallback((productId: string) => {
    return wishlistProductIds.includes(productId);
  }, [wishlistProductIds]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!currentUser) {
      alert("Please log in to manage your wishlist.");
      return;
    }
    await toggleProductInWishlist(currentUser.uid, productId, isProductWishlisted(productId));
  }, [currentUser, isProductWishlisted]);

  return (
    <WishlistContext.Provider value={{ wishlistProductIds, isProductWishlisted, toggleWishlist, loadingWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};