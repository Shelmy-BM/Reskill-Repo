import { useEffect, useMemo, useState } from 'react';
import {
  BOOKS,
  DEFAULT_SAVED_ADDRESS,
  INITIAL_CART,
  INITIAL_ORDERS,
  INITIAL_WISHLIST,
  WRITERS,
} from './data/bookstoreData';
import {
  Book,
  BookFormat,
  CartItem,
  DeliveryAddress,
  Order,
  OrderItemSnapshot,
  PaymentMethodType,
  Review,
  ViewMode,
} from './types/bookstore';
import { Header } from './components/Header';
import { CataloguePage } from './components/CataloguePage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { PaymentModal } from './components/PaymentModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { OrdersPage } from './components/OrdersPage';
import { WishlistPage } from './components/WishlistPage';
import { WritersPage } from './components/WritersPage';

const STORAGE_KEYS = {
  CART: 'bookworm_cart_v1',
  WISHLIST: 'bookworm_wishlist_v1',
  ORDERS: 'bookworm_orders_v1',
  REVIEWS: 'bookworm_reviews_v1',
  POINTS: 'bookworm_gift_points_v1',
};

interface PendingCheckoutPayload {
  address: DeliveryAddress;
  subtotal: number;
  tax: number;
  discount: number;
  pointsRedeemed: number;
  totalAmount: number;
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('catalogue');
  const [selectedBookId, setSelectedBookId] = useState<string>(BOOKS[6].id); // Joy of Minimalism default
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState<string | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<string>('All Publishers');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? (JSON.parse(saved) as CartItem[]) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? (JSON.parse(saved) as string[]) : INITIAL_WISHLIST;
    } catch {
      return INITIAL_WISHLIST;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? (JSON.parse(saved) as Order[]) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviewsByBook, setReviewsByBook] = useState<Record<string, Review[]>>(() => {
    const initial: Record<string, Review[]> = {};
    for (const b of BOOKS) {
      initial[b.id] = b.reviews;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) {
        return { ...initial, ...(JSON.parse(saved) as Record<string, Review[]>) };
      }
    } catch {
      // ignore storage parse error
    }
    return initial;
  });

  const [giftPoints, setGiftPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POINTS);
      return saved ? Number(saved) : 450;
    } catch {
      return 450;
    }
  });

  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckoutPayload | null>(null);
  const [latestConfirmedOrder, setLatestConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviewsByBook));
    } catch {
      // ignore
    }
  }, [reviewsByBook]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POINTS, String(giftPoints));
    } catch {
      // ignore
    }
  }, [giftPoints]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartBookIds = useMemo(() => new Set(cart.map((c) => c.bookId)), [cart]);
  const wishlistIds = useMemo(() => new Set(wishlist), [wishlist]);

  const selectedBook = useMemo(
    () => BOOKS.find((b) => b.id === selectedBookId) || BOOKS[0],
    [selectedBookId]
  );

  const handleOpenBook = (book: Book) => {
    setSelectedBookId(book.id);
    setActiveView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByAuthor = (authorName: string) => {
    setSelectedCategory('All');
    setSelectedPublisher('All Publishers');
    setSelectedAuthorFilter(authorName);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterByPublisher = (publisher: string) => {
    setSelectedCategory('All');
    setSelectedAuthorFilter(null);
    setSelectedPublisher(publisher);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    setSelectedAuthorFilter(null);
    setSelectedPublisher('All Publishers');
    setSelectedCategory(category);
    setActiveView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (book: Book, format: BookFormat = book.format) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.bookId === book.id);
      if (existing) {
        return prev.map((item) =>
          item.bookId === book.id ? { ...item, quantity: item.quantity + 1, format } : item
        );
      }
      return [...prev, { bookId: book.id, format, quantity: 1 }];
    });
    showToast(`Added "${book.title}" to cart`);
  };

  const handleUpdateCartQuantity = (bookId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.bookId === bookId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.bookId !== bookId));
  };

  const handleToggleWishlist = (bookId: string) => {
    const book = BOOKS.find((b) => b.id === bookId);
    setWishlist((prev) => {
      if (prev.includes(bookId)) {
        if (book) showToast(`Removed "${book.title}" from wishlist`);
        return prev.filter((id) => id !== bookId);
      }
      if (book) showToast(`Saved "${book.title}" to wishlist`);
      return [...prev, bookId];
    });
  };

  const handleSubmitReview = (bookId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      reviewerName: `${DEFAULT_SAVED_ADDRESS.firstName} ${DEFAULT_SAVED_ADDRESS.lastName}`,
      rating,
      comment,
      date: 'Just now',
    };
    setReviewsByBook((prev) => ({
      ...prev,
      [bookId]: [newReview, ...(prev[bookId] || [])],
    }));
  };

  const handleProceedToPayment = (payload: PendingCheckoutPayload) => {
    setPendingCheckout(payload);
    setActiveView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompletePayment = (method: PaymentMethodType) => {
    if (!pendingCheckout) return;

    const orderItems: OrderItemSnapshot[] = cart
      .map((ci) => {
        const b = BOOKS.find((item) => item.id === ci.bookId);
        if (!b) return null;
        return {
          bookId: b.id,
          title: b.title,
          authorName: b.authorName,
          description: b.description,
          format: ci.format,
          categories: b.categories,
          price: b.price,
          quantity: ci.quantity,
          deliveryEstimate: b.deliveryEstimate,
          coverTheme: b.coverTheme,
          isbn: b.isbn,
        };
      })
      .filter((x): x is OrderItemSnapshot => Boolean(x));

    const pointsEarned = Math.max(10, Math.round(pendingCheckout.totalAmount * 0.1));
    const newOrder: Order = {
      id: `BW-2026-${Math.floor(5000 + Math.random() * 4999)}`,
      createdAt: 'Today',
      status: 'Confirmed',
      paymentMethod: method,
      items: orderItems,
      subtotal: pendingCheckout.subtotal,
      tax: pendingCheckout.tax,
      discount: pendingCheckout.discount,
      pointsRedeemed: pendingCheckout.pointsRedeemed,
      pointsEarned,
      totalAmount: pendingCheckout.totalAmount,
      shippingAddress: pendingCheckout.address,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setGiftPoints((prev) => Math.max(0, prev - pendingCheckout.pointsRedeemed + pointsEarned));
    setCart([]);
    setLatestConfirmedOrder(newOrder);
    setPendingCheckout(null);
    setActiveView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyAgain = (item: OrderItemSnapshot) => {
    const book = BOOKS.find((b) => b.id === item.bookId);
    if (!book) return;
    handleAddToCart(book, item.format);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121214] text-[#F4F4F4]">
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        ordersCount={orders.length}
        giftPoints={giftPoints}
        savedAddress={DEFAULT_SAVED_ADDRESS}
      />

      <div className="flex-1">
        {activeView === 'catalogue' && (
          <CataloguePage
            books={BOOKS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedAuthorFilter={selectedAuthorFilter}
            onClearAuthorFilter={() => setSelectedAuthorFilter(null)}
            selectedPublisher={selectedPublisher}
            onSelectPublisher={setSelectedPublisher}
            cartBookIds={cartBookIds}
            wishlistIds={wishlistIds}
            onSelectBook={handleOpenBook}
            onFilterByAuthor={handleFilterByAuthor}
            onQuickAddToCart={(b) => handleAddToCart(b, b.format)}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'pdp' && (
          <ProductDetailPage
            key={selectedBook.id}
            book={selectedBook}
            allBooks={BOOKS}
            writers={WRITERS}
            orders={orders}
            reviews={reviewsByBook[selectedBook.id] || []}
            inCart={cartBookIds.has(selectedBook.id)}
            inWishlist={wishlistIds.has(selectedBook.id)}
            wishlistIds={wishlistIds}
            cartBookIds={cartBookIds}
            onNavigateHome={() => setActiveView('catalogue')}
            onSelectCategory={handleSelectCategory}
            onFilterByAuthor={handleFilterByAuthor}
            onFilterByPublisher={handleFilterByPublisher}
            onSelectBook={handleOpenBook}
            onAddToCart={handleAddToCart}
            onGoToCheckout={() => setActiveView('checkout')}
            onToggleWishlist={handleToggleWishlist}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutPage
            cartItems={cart}
            books={BOOKS}
            savedAddress={DEFAULT_SAVED_ADDRESS}
            giftPoints={giftPoints}
            onNavigateHome={() => setActiveView('catalogue')}
            onSelectBook={handleOpenBook}
            onFilterByAuthor={handleFilterByAuthor}
            onSelectCategory={handleSelectCategory}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {activeView === 'payment' && pendingCheckout && (
          <PaymentModal
            payableAmount={pendingCheckout.totalAmount}
            onBackToCheckout={() => setActiveView('checkout')}
            onCompletePayment={handleCompletePayment}
          />
        )}

        {activeView === 'confirmation' && latestConfirmedOrder && (
          <ConfirmationModal
            order={latestConfirmedOrder}
            onContinueShopping={() => {
              setSelectedCategory('All');
              setSelectedAuthorFilter(null);
              setSelectedPublisher('All Publishers');
              setActiveView('catalogue');
            }}
            onViewOrders={() => setActiveView('orders')}
          />
        )}

        {activeView === 'orders' && (
          <OrdersPage
            orders={orders}
            allBooks={BOOKS}
            cartBookIds={cartBookIds}
            wishlistIds={wishlistIds}
            onBuyAgain={handleBuyAgain}
            onSelectBook={handleOpenBook}
            onFilterByAuthor={handleFilterByAuthor}
            onSelectCategory={handleSelectCategory}
            onQuickAddToCart={(b) => handleAddToCart(b, b.format)}
            onToggleWishlist={handleToggleWishlist}
            onBrowseCatalogue={() => setActiveView('catalogue')}
          />
        )}

        {activeView === 'wishlist' && (
          <WishlistPage
            books={BOOKS}
            wishlistIds={wishlistIds}
            cartBookIds={cartBookIds}
            onSelectBook={handleOpenBook}
            onMoveToCart={(b) => handleAddToCart(b, b.format)}
            onToggleWishlist={handleToggleWishlist}
            onBrowseCatalogue={() => setActiveView('catalogue')}
          />
        )}

        {activeView === 'writers' && (
          <WritersPage
            writers={WRITERS}
            books={BOOKS}
            onFilterByAuthor={handleFilterByAuthor}
            onFilterByPublisher={handleFilterByPublisher}
            onSelectBook={handleOpenBook}
          />
        )}
      </div>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#26262C] border border-[#0F62FE] text-white text-xs font-medium px-4 py-2.5 rounded-sm shadow-xl"
        >
          {toastMessage}
        </div>
      )}

      {/* Clean Minimal Footer */}
      <footer className="border-t border-[#222228] bg-[#121214] py-4 px-4 sm:px-6 text-xs text-[#7E7E8A]">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <span>Book Worm — Curated Online Bookstore</span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveView('catalogue')}
              className="hover:text-[#D4D4DC] transition-colors"
            >
              Catalogue
            </button>
            <button
              type="button"
              onClick={() => setActiveView('orders')}
              className="hover:text-[#D4D4DC] transition-colors"
            >
              My Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveView('writers')}
              className="hover:text-[#D4D4DC] transition-colors"
            >
              Writers &amp; Publishers
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
