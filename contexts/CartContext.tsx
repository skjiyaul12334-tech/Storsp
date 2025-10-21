import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { fetchProductById } from '../services/firebaseService';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartQuantity: (index: number, change: number) => void;
  removeCartItem: (index: number) => void;
  cartTotalItems: number;
  cartSubtotal: number;
  cartShipping: number;
  cartGrandTotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    const product = await fetchProductById(productId);
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === productId);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  }, []);

  const updateCartQuantity = useCallback((index: number, change: number) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity += change;
      if (newCart[index].quantity < 1) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  }, []);

  const removeCartItem = useCallback((index: number) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartShipping = cartSubtotal > 0 ? 50.00 : 0;
  const cartGrandTotal = cartSubtotal + cartShipping;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartQuantity,
      removeCartItem,
      cartTotalItems,
      cartSubtotal,
      cartShipping,
      cartGrandTotal,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};