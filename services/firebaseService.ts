import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { AppUser, Product, CartItem, Order, Category } from '../types';
import { DUMMY_PRODUCT_DATA } from '../constants';

// Firebase configuration from the original HTML
const firebaseConfig = {
  apiKey: "AIzaSyAc78M_nj7kJtnRCTqdEdWsiMQeq4oSuDc",
  databaseURL: "https://spin-199a1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spin-199a1",
};

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const auth = firebase.auth();

export const firebaseAuth = auth;
export const firebaseDatabase = database;

export const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
  return auth.onAuthStateChanged(user => {
    if (user) {
      callback({ uid: user.uid, displayName: user.displayName || "User", email: user.email });
    } else {
      callback(null);
    }
  });
};

export const fetchAllProducts = (
  callback: (products: Product[]) => void,
) => {
  const productsRef = database.ref('Products');
  productsRef.on('value', snapshot => {
    const products: Product[] = [];
    snapshot.forEach(childSnapshot => {
      const productData = childSnapshot.val();
      products.push({
        id: childSnapshot.key,
        ...productData,
        // Add dummy data for rating/offer if not present in Firebase
        averageRating: productData.averageRating ?? DUMMY_PRODUCT_DATA.averageRating,
        reviewCount: productData.reviewCount ?? DUMMY_PRODUCT_DATA.reviewCount,
        offerPrice: productData.offerPrice ?? DUMMY_PRODUCT_DATA.offerPrice,
      });
    });
    callback(products);
  });
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  const snapshot = await database.ref('Products/' + productId).once('value');
  if (snapshot.exists()) {
    const productData = snapshot.val();
    return {
      id: snapshot.key as string,
      ...productData,
      averageRating: productData.averageRating ?? DUMMY_PRODUCT_DATA.averageRating,
      reviewCount: productData.reviewCount ?? DUMMY_PRODUCT_DATA.reviewCount,
      offerPrice: productData.offerPrice ?? DUMMY_PRODUCT_DATA.offerPrice,
    };
  }
  return null;
};

export const fetchCategories = (callback: (categories: Category[]) => void) => {
  const categoriesRef = database.ref('Categorys');
  categoriesRef.on('value', snapshot => {
    const categories: Category[] = [];
    snapshot.forEach(childSnapshot => {
      categories.push({ id: childSnapshot.key as string, ...childSnapshot.val() });
    });
    callback(categories);
  });
};

export const fetchProductsByCategory = (categoryName: string, callback: (products: Product[]) => void) => {
  const productsRef = database.ref('Products').orderByChild('categories').equalTo(categoryName);
  productsRef.on('value', snapshot => {
    const products: Product[] = [];
    snapshot.forEach(childSnapshot => {
      const productData = childSnapshot.val();
      products.push({
        id: childSnapshot.key as string,
        ...productData,
        averageRating: productData.averageRating ?? DUMMY_PRODUCT_DATA.averageRating,
        reviewCount: productData.reviewCount ?? DUMMY_PRODUCT_DATA.reviewCount,
        offerPrice: productData.offerPrice ?? DUMMY_PRODUCT_DATA.offerPrice,
      });
    });
    callback(products);
  });
};

export const fetchUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const ordersRef = database.ref('Orders').orderByChild('userId').equalTo(userId);
  ordersRef.on('value', snapshot => {
    const orders: Order[] = [];
    snapshot.forEach(childSnapshot => {
      orders.push({ key: childSnapshot.key as string, ...childSnapshot.val() });
    });
    // Sort orders by date descending
    orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    callback(orders);
  });
};

export const fetchOrderById = async (orderKey: string): Promise<Order | null> => {
  const snapshot = await database.ref('Orders/' + orderKey).once('value');
  if (snapshot.exists()) {
    return { key: snapshot.key as string, ...snapshot.val() };
  }
  return null;
};

export const cancelOrder = async (orderKey: string) => {
  await database.ref('Orders/' + orderKey).remove();
};

export const placeOrder = async (orderData: Omit<Order, 'key'>) => {
  return database.ref('Orders').push(orderData);
};

export const fetchUserWishlist = (userId: string, callback: (productIds: string[]) => void) => {
  database.ref(`wishlists/${userId}`).on('value', snapshot => {
    const productIds: string[] = [];
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        productIds.push(childSnapshot.key as string);
      });
    }
    callback(productIds);
  });
};

export const toggleProductInWishlist = async (userId: string, productId: string, isWishlisted: boolean) => {
  const userWishlistRef = database.ref(`wishlists/${userId}/${productId}`);
  if (isWishlisted) {
    await userWishlistRef.remove();
  } else {
    await userWishlistRef.set(true);
  }
};
