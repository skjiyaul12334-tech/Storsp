import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductViewDialog from './components/dialogs/ProductViewDialog';
import CartDialog from './components/dialogs/CartDialog';
import CheckoutDialog from './components/dialogs/CheckoutDialog';
import OrderTrackDialog from './components/dialogs/OrderTrackDialog';
import SuccessDialog from './components/dialogs/SuccessDialog';
import WishlistDialog from './components/dialogs/WishlistDialog';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Product, NavScreen, DialogType } from './types';
import { firebaseAuth } from './services/firebaseService';


const AppContent: React.FC = () => {
  const { currentUser, loadingAuth } = useAuth();
  const [activeScreen, setActiveScreen] = useState<NavScreen>(NavScreen.Home);
  const [activeDialog, setActiveDialog] = useState<DialogType>(DialogType.None);
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
  const [selectedOrderKeyForTrack, setSelectedOrderKeyForTrack] = useState<string | null>(null);

  useEffect(() => {
    // If user is not authenticated, redirect to login.html
    // This assumes login.html handles the actual login process.
    if (!loadingAuth && !currentUser) {
        window.location.href = 'login.html';
    }
  }, [currentUser, loadingAuth]);

  const handleScreenChange = useCallback((screen: NavScreen) => {
    setActiveScreen(screen);
  }, []);

  const handleOpenDialog = useCallback((type: DialogType, item?: Product | string) => {
    setActiveDialog(type);
    if (type === DialogType.ProductView && typeof item !== 'string') {
      setSelectedProductForView(item as Product);
    } else if (type === DialogType.OrderTrack && typeof item === 'string') {
      setSelectedOrderKeyForTrack(item);
    }
  }, []);

  const handleCloseDialog = useCallback(() => {
    setActiveDialog(DialogType.None);
    setSelectedProductForView(null);
    setSelectedOrderKeyForTrack(null);
  }, []);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-8 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If currentUser is null after loading, it means not authenticated,
  // and useEffect will handle redirection. We can return null or a loading state here.
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {activeScreen === NavScreen.Home && (
        <Header currentUser={currentUser} onOpenWishlist={() => handleOpenDialog(DialogType.Wishlist)} onOpenCart={() => handleOpenDialog(DialogType.Cart)} />
      )}

      <div className="flex-grow">
        {activeScreen === NavScreen.Home && <HomeScreen onOpenDialog={handleOpenDialog} onScreenChange={handleScreenChange} />}
        {activeScreen === NavScreen.Category && <CategoryScreen onOpenDialog={handleOpenDialog} />}
        {activeScreen === NavScreen.MyOrders && <MyOrdersScreen onOpenDialog={handleOpenDialog} />}
        {activeScreen === NavScreen.Profile && <ProfileScreen />}
      </div>

      <BottomNav activeScreen={activeScreen} onScreenChange={handleScreenChange} />

      {/* Dialogs */}
      <ProductViewDialog
        isOpen={activeDialog === DialogType.ProductView}
        onClose={handleCloseDialog}
        product={selectedProductForView}
        onOpenCart={() => handleOpenDialog(DialogType.Cart)}
      />
      <CartDialog
        isOpen={activeDialog === DialogType.Cart}
        onClose={handleCloseDialog}
        onOpenCheckout={() => handleOpenDialog(DialogType.Checkout)}
      />
      <CheckoutDialog
        isOpen={activeDialog === DialogType.Checkout}
        onClose={handleCloseDialog}
        onOrderSuccess={() => handleOpenDialog(DialogType.Success)}
      />
      <OrderTrackDialog
        isOpen={activeDialog === DialogType.OrderTrack}
        onClose={handleCloseDialog}
        orderKey={selectedOrderKeyForTrack}
      />
      <SuccessDialog
        isOpen={activeDialog === DialogType.Success}
        onClose={handleCloseDialog}
      />
      <WishlistDialog
        isOpen={activeDialog === DialogType.Wishlist}
        onClose={handleCloseDialog}
        onOpenProductView={(product) => handleOpenDialog(DialogType.ProductView, product)}
        onOpenCart={() => handleOpenDialog(DialogType.Cart)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;