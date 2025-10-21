import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseAuth } from '../services/firebaseService';
import SVGIcon from '../components/SVGIcon';
import { SVG_PATHS } from '../constants';

const ProfileScreen: React.FC = () => {
  const { currentUser, loadingAuth } = useAuth();

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      // Redirect to login page is handled by AuthProvider
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen-minus-header-nav">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="p-4 text-center text-gray-600 min-h-screen-minus-header-nav flex items-center justify-center">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <main className="p-4 pb-20 flex flex-col items-center justify-center min-h-screen-minus-header-nav">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <SVGIcon path={SVG_PATHS.PROFILE} className="w-7 h-7 text-gray-700" /> My Profile
      </h2>
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center w-full max-w-md">
        <img
          src="https://i.pravatar.cc/150" // Placeholder for user avatar
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-red-200 mb-6"
        />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentUser.displayName || 'User'}</h3>
        <p className="text-gray-600 text-lg mb-8">{currentUser.email}</p>

        <button
          className="w-full py-3 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 transition-colors shadow-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default ProfileScreen;