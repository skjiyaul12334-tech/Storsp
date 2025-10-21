import React, { useState, useEffect, useCallback } from 'react';
import { Category, Product, DialogType } from '../types';
import { fetchCategories, fetchProductsByCategory } from '../services/firebaseService';
import CategoryItem from '../components/CategoryItem';
import ProductCard from '../components/ProductCard';

interface CategoryScreenProps {
  onOpenDialog: (type: DialogType, product?: Product) => void;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({ onOpenDialog }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);
    const unsubscribe = fetchCategories(fetchedCategories => {
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0 && !activeCategory) {
        setActiveCategory(fetchedCategories[0]); // Set first category as active initially
      }
      setLoadingCategories(false);
    });

    return () => {
      // If `fetchCategories` provided an unsubscribe function, call it here.
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const loadProducts = () => {
      if (activeCategory) {
        setLoadingProducts(true);
        // Ensure the listener is properly managed to prevent memory leaks or stale data
        const unsubscribeProducts = fetchProductsByCategory(activeCategory.name, fetchedProducts => {
          setProducts(fetchedProducts);
          setLoadingProducts(false);
        });
        // This is a placeholder for actual unsubscribe if Firebase API provided one directly from `on`.
        // For simple `on('value')` setup, the listener will persist.
      } else {
        setProducts([]);
      }
    };
    loadProducts();
  }, [activeCategory]); // Re-run when activeCategory changes

  const handleCategoryClick = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  const handleProductClick = (product: Product) => {
    onOpenDialog(DialogType.ProductView, product);
  };

  return (
    <div className="flex h-screen-minus-header-nav">
      {/* Category List Sidebar */}
      <div className="w-24 bg-gray-50 overflow-y-auto border-r border-gray-200 shadow-sm scrollbar-hide">
        {loadingCategories ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : categories.map(category => (
          <CategoryItem
            key={category.id}
            category={category}
            onClick={handleCategoryClick}
            isActive={activeCategory?.id === category.id}
            type="sidebar"
          />
        ))}
      </div>

      {/* Product Display Area */}
      <div className="flex-grow overflow-y-auto p-4 pb-20 bg-white">
        {loadingProducts ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryScreen;