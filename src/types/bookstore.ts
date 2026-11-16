export type BookGenre =
  | 'Literary Fiction'
  | 'Science & Nature'
  | 'Design & Architecture'
  | 'History & Biography'
  | 'Speculative'
  | 'Essays & Poetry';

export type BookFormat = 'Hardcover' | 'Paperback' | 'E-Book';

export interface BookVariant {
  format: BookFormat;
  price: number;
  originalPrice?: number;
  stockCount: number;
  sku: string;
}

export interface BookReview {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export type CoverMotif =
  | 'botanical'
  | 'horizon'
  | 'architectural'
  | 'celestial'
  | 'geometric'
  | 'archive';

export interface CoverStyle {
  bg: string;
  accent: string;
  ink: string;
  motif: CoverMotif;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio: string;
  genre: BookGenre;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  isbn: string;
  coverImage?: string;
  coverStyle: CoverStyle;
  editionNote?: 'Staff Pick' | 'New Edition' | 'Limited Print' | 'Bestseller';
  isFeatured?: boolean;
  collectionIds: string[];
  rating: number;
  reviewCount: number;
  synopsis: string;
  excerptTitle: string;
  excerptParagraphs: string[];
  variants: BookVariant[];
  reviews: BookReview[];
}

export interface CuratedCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  curator: string;
}

export interface CartItem {
  bookId: string;
  format: BookFormat;
  quantity: number;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'shipping';
  value: number;
  label: string;
}

export type ShippingMethod = 'standard' | 'express' | 'digital';
export type PaymentMethod = 'card' | 'cod';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  format: BookFormat;
  unitPrice: number;
  quantity: number;
  coverImage?: string;
  coverStyle: CoverStyle;
}

export type OrderStatus = 'Confirmed' | 'Packed' | 'In Transit' | 'Delivered';

export interface Order {
  id: string;
  createdAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shippingCost: number;
  giftWrapCost: number;
  tax: number;
  total: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  giftMessage?: string;
  address: ShippingAddress;
}

export type AppView = 'storefront' | 'book' | 'wishlist' | 'orders' | 'checkout';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
