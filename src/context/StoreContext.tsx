import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppView,
  Book,
  BookFormat,
  BookReview,
  CartItem,
  Order,
  OrderItem,
  PaymentMethod,
  PromoCode,
  ShippingAddress,
  ShippingMethod,
} from '../types/bookstore';
import { BOOKS, FREE_SHIPPING_THRESHOLD, INITIAL_ORDERS, PROMO_CODES } from '../data/books';

interface ToastState {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface StoreContextValue {
  books: Book[];
  activeView: AppView;
  selectedBookId: string | null;
  activeCollectionFilter: string | null;
  isBagOpen: boolean;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  appliedPromo: PromoCode | null;
  promoError: string | null;
  toast: ToastState | null;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  shippingEstimate: number;
  hasPhysicalItemsInCart: boolean;
  navigateTo: (view: AppView, bookId?: string) => void;
  openBook: (bookId: string) => void;
  selectCollectionAndBrowse: (collectionId: string | null) => void;
  setIsBagOpen: (open: boolean) => void;
  addToCart: (bookId: string, format: BookFormat, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (bookId: string, format: BookFormat, quantity: number) => void;
  removeFromCart: (bookId: string, format: BookFormat) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  toggleWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
  addReview: (bookId: string, review: Omit<BookReview, 'id' | 'date' | 'verifiedPurchase'>) => void;
  placeOrder: (params: {
    address: ShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    giftWrap: boolean;
    giftMessage?: string;
  }) => Order;
  reorderOrder: (order: Order) => void;
  dismissToast: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  CART: 'alder_page_cart_v1',
  WISHLIST: 'alder_page_wishlist_v1',
  ORDERS: 'alder_page_orders_v1',
  REVIEWS: 'alder_page_reviews_v1',
  PROMO: 'alder_page_promo_v1',
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<AppView>('storefront');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [activeCollectionFilter, setActiveCollectionFilter] = useState<string | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => safeLoad<CartItem[]>(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() =>
    safeLoad<string[]>(STORAGE_KEYS.WISHLIST, ['book-01', 'book-03'])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeLoad<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [customReviews, setCustomReviews] = useState<Record<string, BookReview[]>>(() =>
    safeLoad<Record<string, BookReview[]>>(STORAGE_KEYS.REVIEWS, {})
  );
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(() =>
    safeLoad<PromoCode | null>(STORAGE_KEYS.PROMO, null)
  );
  const [promoError, setPromoError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore storage quota issues
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(customReviews));
    } catch {
      // Ignore
    }
  }, [customReviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(appliedPromo));
    } catch {
      // Ignore
    }
  }, [appliedPromo]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const books = useMemo(() => {
    return BOOKS.map((book) => {
      const added = customReviews[book.id] || [];
      if (added.length === 0) return book;
      const mergedReviews = [...added, ...book.reviews];
      const baseTotalRating = book.rating * book.reviewCount;
      const addedTotalRating = added.reduce((sum, r) => sum + r.rating, 0);
      const newCount = book.reviewCount + added.length;
      const newAvg = Number(((baseTotalRating + addedTotalRating) / newCount).toFixed(1));
      return {
        ...book,
        reviews: mergedReviews,
        reviewCount: newCount,
        rating: newAvg,
      };
    });
  }, [customReviews]);

  const showToast = (message: string, actionLabel?: string, onAction?: () => void) => {
    setToast({ id: Date.now(), message, actionLabel, onAction });
  };

  const navigateTo = (view: AppView, bookId?: string) => {
    setActiveView(view);
    if (bookId) {
      setSelectedBookId(bookId);
    } else if (view !== 'book') {
      setSelectedBookId(null);
    }
    setIsBagOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBook = (bookId: string) => {
    navigateTo('book', bookId);
  };

  const selectCollectionAndBrowse = (collectionId: string | null) => {
    setActiveCollectionFilter(collectionId);
    setActiveView('storefront');
    setSelectedBookId(null);
    window.setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const addToCart = (
    bookId: string,
    format: BookFormat,
    quantity = 1,
    openDrawer = false
  ) => {
    const book = books.find((b) => b.id === bookId);
    const variant = book?.variants.find((v) => v.format === format);
    if (!book || !variant || variant.stockCount <= 0) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.bookId === bookId && i.format === format);
      if (existing) {
        const nextQty = Math.min(variant.stockCount, existing.quantity + quantity);
        return prev.map((i) =>
          i.bookId === bookId && i.format === format ? { ...i, quantity: nextQty } : i
        );
      }
      return [...prev, { bookId, format, quantity: Math.min(variant.stockCount, quantity) }];
    });

    if (openDrawer) {
      setIsBagOpen(true);
    } else {
      showToast(`Added "${book.title}" (${format}) to bag`, 'View Bag', () => setIsBagOpen(true));
    }
  };

  const updateCartQuantity = (bookId: string, format: BookFormat, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    const book = books.find((b) => b.id === bookId);
    const variant = book?.variants.find((v) => v.format === format);
    const maxStock = variant?.stockCount ?? 99;
    const clamped = Math.min(maxStock, quantity);

    setCart((prev) =>
      prev.map((i) =>
        i.bookId === bookId && i.format === format ? { ...i, quantity: clamped } : i
      )
    );
  };

  const removeFromCart = (bookId: string, format: BookFormat) => {
    setCart((prev) => prev.filter((i) => !(i.bookId === bookId && i.format === format)));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoError(null);
  };

  const applyPromoCode = (rawCode: string): boolean => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) {
      setPromoError('Please enter a promo code.');
      return false;
    }
    const found = PROMO_CODES.find((p) => p.code === normalized);
    if (!found) {
      setPromoError('Invalid code. Try READ10, FOLIO15, or FREESHIP.');
      return false;
    }
    setAppliedPromo(found);
    setPromoError(null);
    showToast(`Promo "${found.code}" applied — ${found.label}`);
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const toggleWishlist = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    setWishlist((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        if (book) showToast(`Removed "${book.title}" from wishlist`);
        return prev.filter((id) => id !== bookId);
      }
      if (book) showToast(`Saved "${book.title}" to wishlist`, 'Wishlist', () => navigateTo('wishlist'));
      return [bookId, ...prev];
    });
  };

  const isWishlisted = (bookId: string) => wishlist.includes(bookId);

  const addReview = (
    bookId: string,
    review: Omit<BookReview, 'id' | 'date' | 'verifiedPurchase'>
  ) => {
    const newReview: BookReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      verifiedPurchase: true,
    };
    setCustomReviews((prev) => ({
      ...prev,
      [bookId]: [newReview, ...(prev[bookId] || [])],
    }));
    showToast('Thank you! Your review has been published.');
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const book = books.find((b) => b.id === item.bookId);
      const variant = book?.variants.find((v) => v.format === item.format);
      return sum + (variant ? variant.price * item.quantity : 0);
    }, 0);
  }, [cart, books]);

  const hasPhysicalItemsInCart = useMemo(
    () => cart.some((item) => item.format !== 'E-Book'),
    [cart]
  );

  const cartDiscount = useMemo(() => {
    if (!appliedPromo || appliedPromo.type !== 'percent') return 0;
    return Number(((cartSubtotal * appliedPromo.value) / 100).toFixed(2));
  }, [appliedPromo, cartSubtotal]);

  const shippingEstimate = useMemo(() => {
    if (cart.length === 0 || !hasPhysicalItemsInCart) return 0;
    if (appliedPromo?.type === 'shipping') return 0;
    if (cartSubtotal - cartDiscount >= FREE_SHIPPING_THRESHOLD) return 0;
    return 4.99;
  }, [cart.length, hasPhysicalItemsInCart, appliedPromo, cartSubtotal, cartDiscount]);

  const placeOrder = ({
    address,
    shippingMethod,
    paymentMethod,
    giftWrap,
    giftMessage,
  }: {
    address: ShippingAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
    giftWrap: boolean;
    giftMessage?: string;
  }): Order => {
    const orderItems: OrderItem[] = cart.map((item) => {
      const book = books.find((b) => b.id === item.bookId)!;
      const variant = book.variants.find((v) => v.format === item.format)!;
      return {
        bookId: book.id,
        title: book.title,
        author: book.author,
        format: item.format,
        unitPrice: variant.price,
        quantity: item.quantity,
        coverImage: book.coverImage,
        coverStyle: book.coverStyle,
      };
    });

    const shippingCost =
      !hasPhysicalItemsInCart || shippingMethod === 'digital'
        ? 0
        : shippingMethod === 'express'
          ? 12.99
          : appliedPromo?.type === 'shipping' ||
              cartSubtotal - cartDiscount >= FREE_SHIPPING_THRESHOLD
            ? 0
            : 4.99;

    const giftWrapCost = giftWrap && hasPhysicalItemsInCart ? 3.5 : 0;
    const taxable = Math.max(0, cartSubtotal - cartDiscount + giftWrapCost);
    const tax = Number((taxable * 0.08).toFixed(2));
    const total = Number((taxable + shippingCost + tax).toFixed(2));

    const deliveryDate = new Date();
    deliveryDate.setDate(
      deliveryDate.getDate() + (shippingMethod === 'digital' ? 0 : shippingMethod === 'express' ? 2 : 5)
    );

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date().toISOString(),
      estimatedDelivery:
        shippingMethod === 'digital'
          ? 'Instant Digital Delivery'
          : deliveryDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
      status: shippingMethod === 'digital' ? 'Delivered' : 'Confirmed',
      items: orderItems,
      subtotal: Number(cartSubtotal.toFixed(2)),
      discount: cartDiscount,
      promoCode: appliedPromo?.code,
      shippingCost,
      giftWrapCost,
      tax,
      total,
      shippingMethod,
      paymentMethod,
      giftMessage: giftMessage?.trim() || undefined,
      address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const reorderOrder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.bookId, item.format, item.quantity, false);
    });
    setIsBagOpen(true);
  };

  const dismissToast = () => setToast(null);

  return (
    <StoreContext.Provider
      value={{
        books,
        activeView,
        selectedBookId,
        activeCollectionFilter,
        isBagOpen,
        cart,
        wishlist,
        orders,
        appliedPromo,
        promoError,
        toast,
        cartCount,
        cartSubtotal,
        cartDiscount,
        shippingEstimate,
        hasPhysicalItemsInCart,
        navigateTo,
        openBook,
        selectCollectionAndBrowse,
        setIsBagOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        toggleWishlist,
        isWishlisted,
        addReview,
        placeOrder,
        reorderOrder,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
