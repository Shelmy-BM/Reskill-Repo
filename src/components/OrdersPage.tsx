import React, { useMemo } from 'react';
import { Package, RotateCcw } from 'lucide-react';
import { Book, Order, OrderItemSnapshot } from '../types/bookstore';
import { BookCard } from './BookCard';
import { BookCoverArt } from './BookCoverArt';

interface OrdersPageProps {
  orders: Order[];
  allBooks: Book[];
  cartBookIds: Set<string>;
  wishlistIds: Set<string>;
  onBuyAgain: (item: OrderItemSnapshot) => void;
  onSelectBook: (book: Book) => void;
  onFilterByAuthor: (author: string) => void;
  onSelectCategory: (cat: string) => void;
  onQuickAddToCart: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  onBrowseCatalogue: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  allBooks,
  cartBookIds,
  wishlistIds,
  onBuyAgain,
  onSelectBook,
  onFilterByAuthor,
  onSelectCategory,
  onQuickAddToCart,
  onToggleWishlist,
  onBrowseCatalogue,
}) => {
  // Recommend unread titles sharing categories with user's past orders
  const recommendedFromHistory = useMemo(() => {
    const purchasedIds = new Set(orders.flatMap((o) => o.items.map((i) => i.bookId)));
    const purchasedCategories = new Set(
      orders.flatMap((o) => o.items.flatMap((i) => i.categories))
    );

    return allBooks
      .filter((b) => !purchasedIds.has(b.id))
      .sort((a, b) => {
        const scoreA = a.categories.filter((c) => purchasedCategories.has(c)).length;
        const scoreB = b.categories.filter((c) => purchasedCategories.has(c)).length;
        return scoreB - scoreA || b.rating - a.rating;
      })
      .slice(0, 3);
  }, [orders, allBooks]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#26262C] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-white">My Orders</h1>
          <p className="text-xs text-[#9A9AA6] mt-1">
            Review past purchases, track deliveries, or reorder favorite titles in one click.
          </p>
        </div>
        <button
          type="button"
          onClick={onBrowseCatalogue}
          className="px-4 py-2 bg-[#222227] hover:bg-[#2E2E36] border border-[#34343D] text-xs font-medium text-white rounded-sm transition-colors"
        >
          Back to Catalogue
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#1B1B1F] border border-[#2C2C34] rounded-md p-10 text-center space-y-3">
          <Package className="w-8 h-8 text-[#78A9FF] mx-auto" />
          <h2 className="text-base font-medium text-white">No orders placed yet</h2>
          <p className="text-xs text-[#9A9AA6]">
            Once you complete a purchase, your order history and quick reorder options appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <section
              key={order.id}
              className="bg-[#1A1A1E] border border-[#2A2A32] rounded-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-5 py-3.5 bg-[#202026] border-b border-[#2A2A32] flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-[#8E8E9A] block">Order ID</span>
                    <span className="font-mono-num font-semibold text-white">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E9A] block">Placed On</span>
                    <span className="text-[#E4E4E7]">{order.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E9A] block">Payment</span>
                    <span className="text-[#E4E4E7]">{order.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E9A] block">Total</span>
                    <span className="font-mono-num font-semibold text-white">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-medium text-[#42BE65]">
                  {order.status} · +{order.pointsEarned} gift pts
                </span>
              </div>

              {/* Order Items */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {order.items.map((item) => {
                  const catalogBook = allBooks.find((b) => b.id === item.bookId);
                  return (
                    <div
                      key={`${order.id}-${item.bookId}-${item.format}`}
                      className="flex gap-4 items-start"
                    >
                      <button
                        type="button"
                        onClick={() => catalogBook && onSelectBook(catalogBook)}
                        className="w-[78px] shrink-0 text-left rounded-sm focus-visible:outline-2 focus-visible:outline-[#0F62FE]"
                      >
                        <BookCoverArt
                          theme={item.coverTheme}
                          title={item.title}
                          authorName={item.authorName}
                          isbn={item.isbn}
                        />
                      </button>

                      <div className="flex-1 min-w-0 space-y-1">
                        <button
                          type="button"
                          onClick={() => catalogBook && onSelectBook(catalogBook)}
                          className="text-left text-[14.5px] font-semibold text-white hover:text-[#78A9FF] transition-colors truncate block w-full"
                        >
                          {item.title}
                        </button>
                        <p className="text-xs text-[#78A9FF]">by {item.authorName}</p>
                        <p className="text-xs text-[#A8A8B3]">
                          {item.format} · Qty {item.quantity} ·{' '}
                          <span className="font-mono-num text-white">₹{item.price}</span>
                        </p>
                        <p className="text-[11px] text-[#8E8E9A]">{item.deliveryEstimate}</p>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => onBuyAgain(item)}
                            className="px-3.5 py-1.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium rounded-sm inline-flex items-center gap-1.5 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Buy It Again</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Recommendations Based on Order History */}
      {recommendedFromHistory.length > 0 && (
        <section className="pt-4 border-t border-[#26262C] space-y-3">
          <div>
            <h2 className="text-[16px] font-medium text-white">
              Recommended Based on Your Order History
            </h2>
            <p className="text-xs text-[#8E8E9A] mt-0.5">
              Curated from the genres and themes of your previous purchases.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendedFromHistory.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                inCart={cartBookIds.has(book.id)}
                inWishlist={wishlistIds.has(book.id)}
                onSelectBook={onSelectBook}
                onFilterByAuthor={onFilterByAuthor}
                onFilterByCategory={onSelectCategory}
                onQuickAddToCart={onQuickAddToCart}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
