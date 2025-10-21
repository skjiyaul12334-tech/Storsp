import React, { useState, useEffect, useCallback } from 'react';
import BannerSlider from '../components/BannerSlider';
import CategoryItem from '../components/CategoryItem';
import ProductCard from '../components/ProductCard';
import { Product, Category, DialogType, NavScreen } from '../types';
import { fetchAllProducts, fetchCategories } from '../services/firebaseService';
import SVGIcon from '../components/SVGIcon';
import { SVG_PATHS } from '../constants';

interface HomeScreenProps {
  onOpenDialog: (type: DialogType, product?: Product) => void;
  // Fix: Change 'category' to NavScreen to match the type of function passed from App.tsx
  onScreenChange: (screen: NavScreen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenDialog, onScreenChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeCategories = fetchCategories(setCategories);
    const unsubscribeProducts = fetchAllProducts(setProducts);

    setLoading(false); // Set loading to false once data fetching starts

    // Firebase's on() returns an unsubscribe function.
    // For simplicity, we assume these listeners are cleaned up by React's lifecycle.
    // In a more robust app, you might explicitly unsubscribe here.
    return () => {
      // unsubscribeCategories(); // If fetchCategories returned an unsubscribe
      // unsubscribeProducts(); // If fetchAllProducts returned an unsubscribe
    };
  }, []);

  const getGroupedProducts = useCallback(() => {
    const grouped: { [key: string]: Product[] } = {};
    products.forEach(p => {
      if (p.Product_type) {
        if (!grouped[p.Product_type]) {
          grouped[p.Product_type] = [];
        }
        grouped[p.Product_type].push(p);
      }
    });
    return grouped;
  }, [products]);

  const productSectionTypes = {
    "Selling Products": { icon: <SVGIcon path={SVG_PATHS.TOP_SELLING} className="w-6 h-6 text-red-500" />, title: "Top Selling" },
    "Popular Products": { icon: <SVGIcon path={SVG_PATHS.POPULAR_PICKS} className="w-6 h-6 text-blue-500" />, title: "Popular Picks" },
    "Best Offers": { icon: <SVGIcon path={SVG_PATHS.BEST_OFFERS} className="w-6 h-6 text-yellow-500" />, title: "Best Offers For You" }
  };

  const handleProductClick = (product: Product) => {
    onOpenDialog(DialogType.ProductView, product);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen-minus-header">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const groupedProducts = getGroupedProducts();

  return (
    <main className="p-4 pb-20">
      <section className="mb-6">
        <BannerSlider />
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            Categories
          </h2>
          <button
            className="px-4 py-1.5 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
            onClick={() => onScreenChange(NavScreen.Category)} // Navigate to category screen
          >
            View All
          </button>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              onClick={() => onScreenChange(NavScreen.Category)} // Navigate to category screen
              type="home"
            />
          ))}
        </div>
      </section>

      {Object.keys(productSectionTypes).map(typeName => {
        const sectionProducts = groupedProducts[typeName as keyof typeof productSectionTypes];
        if (sectionProducts && sectionProducts.length > 0) {
          const sectionInfo = productSectionTypes[typeName as keyof typeof productSectionTypes];
          return (
            <section key={typeName} className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                  {sectionInfo.icon} {sectionInfo.title}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sectionProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </section>
          );
        }
        return null;
      })}
    </main>
  );
};

export default HomeScreen;