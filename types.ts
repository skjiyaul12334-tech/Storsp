export interface Product {
  id: string;
  name: string;
  imag: string; // Renamed from 'image' for consistency with original HTML, though 'image' would be more semantic.
  price: number;
  Description?: string;
  Product_type?: "Selling Products" | "Popular Products" | "Best Offers";
  categories: string;
  offerPrice?: number;
  averageRating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderProduct {
  id: string;
  image: string;
  name: string;
  quantity: number;
  unite: number; // Unit price
  total: number; // Price * quantity
}

export interface Order {
  key: string;
  address: string;
  orderDate: string;
  paymentMethod: string;
  phone: string;
  status: 'Order Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  transactionId: string;
  userId: string;
  userName: string;
  products: OrderProduct[];
}

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export enum NavScreen {
  Home = 'home',
  Category = 'category',
  MyOrders = 'my-orders',
  Profile = 'profile',
}

export enum DialogType {
  None = 'none',
  ProductView = 'productView',
  Cart = 'cart',
  Checkout = 'checkout',
  OrderTrack = 'orderTrack',
  Success = 'success',
  Wishlist = 'wishlist',
}