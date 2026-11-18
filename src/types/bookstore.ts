export type BookFormat = 'Paperback' | 'Hardcover' | 'eBook';

export type BookSection = 'Recommended for You' | 'Bestsellers this Month' | 'New Launches' | 'Catalogue';

export type ViewMode =
  | 'catalogue'
  | 'pdp'
  | 'checkout'
  | 'payment'
  | 'confirmation'
  | 'orders'
  | 'wishlist'
  | 'writers';

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Writer {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  avatarUrl?: string;
  initials: string;
  accentColor: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  authorId: string;
  authorName: string;
  publisher: string;
  description: string;
  backCoverBlurb: string;
  format: BookFormat;
  availableFormats: BookFormat[];
  categories: string[];
  primaryCategory: string;
  price: number;
  language: 'English' | 'Hindi' | 'Spanish' | 'French';
  deliveryEstimate: string;
  rating: number;
  copiesSold: number;
  section: BookSection;
  coverTheme:
    | 'focus-target'
    | 'learning-bulb'
    | 'success-path'
    | 'midnight-door'
    | 'beneath-stars'
    | 'final-frontier'
    | 'joy-minimalism'
    | 'vanishing-house'
    | 'lost-kitten'
    | 'editorial-crimson'
    | 'editorial-emerald'
    | 'editorial-indigo'
    | 'editorial-amber'
    | 'editorial-slate';
  reviews: Review[];
}

export interface CartItem {
  bookId: string;
  format: BookFormat;
  quantity: number;
}

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  addressLine: string;
  email: string;
  city: string;
  pin: string;
  phoneCode: string;
  phoneNumber: string;
  state: string;
  country: string;
}

export type PaymentMethodType = 'Credit Card' | 'Debit card' | 'UPI' | 'Wallet';

export interface OrderItemSnapshot {
  bookId: string;
  title: string;
  authorName: string;
  description: string;
  format: BookFormat;
  categories: string[];
  price: number;
  quantity: number;
  deliveryEstimate: string;
  coverTheme: Book['coverTheme'];
  isbn: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'Confirmed' | 'Shipped' | 'Delivered';
  paymentMethod: PaymentMethodType;
  items: OrderItemSnapshot[];
  subtotal: number;
  tax: number;
  discount: number;
  pointsRedeemed: number;
  pointsEarned: number;
  totalAmount: number;
  shippingAddress: DeliveryAddress;
}
