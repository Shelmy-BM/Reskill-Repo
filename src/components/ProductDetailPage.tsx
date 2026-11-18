import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { Book, BookFormat, Order, Review, Writer } from '../types/bookstore';
import { BookCard } from './BookCard';
import { BookCoverArt } from './BookCoverArt';

interface ProductDetailPageProps {
  book: Book;
  allBooks: Book[];
  writers: Writer[];
  orders: Order[];
  reviews: Review[];
  inCart: boolean;
  inWishlist: boolean;
  wishlistIds: Set<string>;
  cartBookIds: Set<string>;
  onNavigateHome: () => void;
  onSelectCategory: (category: string) => void;
  onFilterByAuthor: (authorName: string) => void;
  onFilterByPublisher: (publisher: string) => void;
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book, format: BookFormat) => void;
  onGoToCheckout: () => void;
  onToggleWishlist: (bookId: string) => void;
  onSubmitReview: (bookId: string, rating: number, comment: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  book,
  allBooks,
  writers,
  orders,
  reviews,
  inCart,
  inWishlist,
  wishlistIds,
  cartBookIds,
  onNavigateHome,
  onSelectCategory,
  onFilterByAuthor,
  onFilterByPublisher,
  onSelectBook,
  onAddToCart,
  onGoToCheckout,
  onToggleWishlist,
  onSubmitReview,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(book.format);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const writer = useMemo(
    () => writers.find((w) => w.id === book.authorId || w.name === book.authorName),
    [writers, book.authorId, book.authorName]
  );

  // Compute Related Reads + recommendations informed by Order History
  const relatedReads = useMemo(() => {
    const orderedBookIds = new Set(orders.flatMap((o) => o.items.map((i) => i.bookId)));
    const orderedCategories = new Set(orders.flatMap((o) => o.items.flatMap((i) => i.categories)));

    return allBooks
      .filter((candidate) => candidate.id !== book.id)
      .sort((a, b) => {
        const aCatMatch = a.categories.some((c) => book.categories.includes(c)) ? 2 : 0;
        const bCatMatch = b.categories.some((c) => book.categories.includes(c)) ? 2 : 0;
        const aHistoryMatch =
          !orderedBookIds.has(a.id) && a.categories.some((c) => orderedCategories.has(c)) ? 1 : 0;
        const bHistoryMatch =
          !orderedBookIds.has(b.id) && b.categories.some((c) => orderedCategories.has(c)) ? 1 : 0;
        return bCatMatch + bHistoryMatch - (aCatMatch + aHistoryMatch);
      })
      .slice(0, 3);
  }, [allBooks, book, orders]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    onSubmitReview(book.id, reviewRating, reviewText.trim());
    setReviewText('');
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return book.rating;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number(((book.rating + sum / reviews.length) / 2).toFixed(1));
  }, [book.rating, reviews]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] mb-5">
        <button
          type="button"
          onClick={onNavigateHome}
          className="text-[#78A9FF] hover:underline"
        >
          Home
        </button>
        <span className="text-[#6F6F7B]">/</span>
        <button
          type="button"
          onClick={() => onSelectCategory(book.categories[0] || 'All')}
          className="text-[#78A9FF] hover:underline"
        >
          {book.categories[0] || 'Catalogue'}
        </button>
        <span className="text-[#6F6F7B]">/</span>
        <button
          type="button"
          onClick={() => onSelectCategory(book.primaryCategory)}
          className="text-[#78A9FF] hover:underline"
        >
          {book.primaryCategory}
        </button>
        <span className="text-[#6F6F7B]">/</span>
        <span className="text-[#C6C6D0]">{book.title}</span>
      </nav>

      {/* Main Split: Left/Center Product + Right Related Reads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* Contiguous Purchase Module: Front & Back Cover + Buy Controls */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Front + Back Covers Side by Side (Slide 3 signature) */}
            <div className="md:col-span-6 grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <BookCoverArt
                  theme={book.coverTheme}
                  title={book.title}
                  authorName={book.authorName}
                  isbn={book.isbn}
                  publisher={book.publisher}
                  backBlurb={book.backCoverBlurb}
                  side="front"
                />
                <p className="text-[11px] text-[#8E8E9A] text-center">Front Cover</p>
              </div>
              <div className="space-y-1.5">
                <BookCoverArt
                  theme={book.coverTheme}
                  title={book.title}
                  authorName={book.authorName}
                  isbn={book.isbn}
                  publisher={book.publisher}
                  backBlurb={book.backCoverBlurb}
                  side="back"
                />
                <p className="text-[11px] text-[#8E8E9A] text-center">Back Cover</p>
              </div>
            </div>

            {/* Purchase Info Panel */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                  {book.title}
                </h1>
                <p className="text-[13px] text-[#A8A8B3] mt-1">
                  by{' '}
                  <button
                    type="button"
                    onClick={() => onFilterByAuthor(book.authorName)}
                    className="text-[#78A9FF] hover:underline font-medium"
                  >
                    {book.authorName}
                  </button>
                </p>
                <p className="text-[13.5px] text-[#D4D4DC] mt-2.5 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="text-[13px] space-y-1.5">
                <p className="text-[#B4B4BE]">
                  Published by:{' '}
                  <button
                    type="button"
                    onClick={() => onFilterByPublisher(book.publisher)}
                    className="text-[#78A9FF] hover:underline"
                  >
                    {book.publisher}
                  </button>
                </p>

                {/* Format Selection */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[#9A9AA6] text-xs mr-1">Format:</span>
                  {book.availableFormats.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-2.5 py-1 text-xs rounded-sm border transition-colors ${
                        selectedFormat === fmt
                          ? 'bg-[#26262C] border-[#78A9FF] text-white font-medium'
                          : 'bg-[#18181C] border-[#2E2E36] text-[#A8A8B3] hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <p className="pt-1 text-xs">
                  {book.categories.map((cat, idx) => (
                    <React.Fragment key={cat}>
                      <button
                        type="button"
                        onClick={() => onSelectCategory(cat)}
                        className="text-[#78A9FF] hover:underline"
                      >
                        {cat}
                      </button>
                      {idx < book.categories.length - 1 && (
                        <span className="text-[#78A9FF]">, </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="pt-1">
                <p className="text-2xl font-semibold font-mono-num text-white">
                  ₹{book.price}
                </p>
                <p className="text-xs text-[#A8A8B3] mt-0.5">{book.deliveryEstimate}</p>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onAddToCart(book, selectedFormat)}
                  className="px-5 py-2.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-[13px] font-medium rounded-sm flex items-center gap-2.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{inCart ? 'Add Another Copy' : 'Add to Cart'}</span>
                </button>

                {inCart && (
                  <button
                    type="button"
                    onClick={onGoToCheckout}
                    className="px-4 py-2.5 bg-[#24A148]/20 border border-[#24A148]/60 hover:bg-[#24A148]/30 text-[#6FDC8C] text-[13px] font-medium rounded-sm flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Go to Checkout</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleWishlist(book.id)}
                  className={`px-4 py-2.5 text-[13px] font-medium rounded-sm flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                    inWishlist
                      ? 'bg-[#2C2C34] text-[#78A9FF] border border-[#78A9FF]/50'
                      : 'bg-[#52525B] hover:bg-[#63636E] text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Language / Rating / Sells Strip */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#26262C] text-xs">
                <div>
                  <p className="text-[#8E8E9A] mb-1">Language</p>
                  <p className="text-[#78A9FF] font-medium">{book.language}</p>
                </div>
                <div>
                  <p className="text-[#8E8E9A] mb-1">Rating ({averageRating})</p>
                  <div className="flex items-center gap-0.5 text-[#F1C21B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3.5 h-3.5"
                        fill={star <= Math.round(averageRating) ? '#F1C21B' : 'none'}
                        stroke={star <= Math.round(averageRating) ? '#F1C21B' : '#6F6F7B'}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[#8E8E9A] mb-1">Sells</p>
                  <p className="text-white font-mono-num font-medium">
                    {book.copiesSold} copies sold
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* About the Writer Section */}
          <section className="pt-6 border-t border-[#26262C] space-y-4">
            <h2 className="text-[16px] font-medium text-white">About the writer</h2>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {writer?.avatarUrl ? (
                <img
                  src={writer.avatarUrl}
                  alt={book.authorName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border border-[#34343D] shrink-0"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-base font-semibold text-white border border-[#34343D] shrink-0"
                  style={{ backgroundColor: writer?.accentColor || '#2C2C34' }}
                >
                  {writer?.initials || book.authorName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onFilterByAuthor(book.authorName)}
                    className="text-[14px] font-semibold text-white hover:text-[#78A9FF] transition-colors"
                  >
                    {book.authorName}
                  </button>
                  {writer && (
                    <span className="text-xs text-[#8E8E9A]">
                      · {writer.role} · {writer.location}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#C6C6D0] leading-relaxed max-w-3xl">
                  {writer?.bio ||
                    `${book.authorName} is a published author with ${book.publisher}, crafting thoughtful works in ${book.categories.join(', ')}.`}
                </p>
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="pt-6 border-t border-[#26262C] space-y-4">
            <h2 className="text-[16px] font-medium text-white">Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Leave Your Review Form */}
              <form onSubmit={handleReviewSubmit} className="md:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#A8A8B3]">
                  <label htmlFor="review-textarea">Leave Your Review</label>
                  <span className="font-mono-num">{reviewText.length}/150</span>
                </div>
                <textarea
                  id="review-textarea"
                  rows={4}
                  maxLength={150}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share what resonated with you..."
                  className="w-full bg-[#222227] border border-[#34343D] focus:border-[#0F62FE] rounded-sm p-3 text-[13px] text-white placeholder-[#73737E] focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1" role="group" aria-label="Select rating">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = star <= (hoverRating || reviewRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          aria-label={`Rate ${star} stars`}
                          className="p-0.5 text-[#F1C21B]"
                        >
                          <Star
                            className="w-4 h-4"
                            fill={active ? '#F1C21B' : 'none'}
                            stroke={active ? '#F1C21B' : '#6F6F7B'}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={!reviewText.trim()}
                    className="px-4 py-2 bg-[#0F62FE] hover:bg-[#0353E9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-sm flex items-center gap-2 transition-colors"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {reviewSubmitted && (
                  <p className="text-xs text-[#42BE65]">Your review has been posted.</p>
                )}
              </form>

              {/* Customer Reviews List */}
              <div className="md:col-span-7 space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-[#8E8E9A] py-4">
                    No reader reviews yet. Be the first to review {book.title}.
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="pb-4 border-b border-[#26262C] last:border-b-0 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-medium text-white">{rev.reviewerName}</p>
                        <span className="text-[11px] text-[#8E8E9A]">{rev.date}</span>
                      </div>
                      <p className="text-[13px] text-[#C6C6D0] leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center gap-0.5 pt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-3.5 h-3.5"
                            fill={star <= rev.rating ? '#F1C21B' : 'none'}
                            stroke={star <= rev.rating ? '#F1C21B' : '#6F6F7B'}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Related Reads (informed by Order History) */}
        <aside className="lg:col-span-4 xl:col-span-3 lg:border-l lg:border-[#26262C] lg:pl-6 space-y-4">
          <div>
            <h2 className="text-[16px] font-medium text-white">Related Reads</h2>
            {orders.length > 0 && (
              <p className="text-[11.5px] text-[#8E8E9A] mt-0.5">
                Includes picks based on your order history
              </p>
            )}
          </div>
          <div className="space-y-3">
            {relatedReads.map((rel) => (
              <BookCard
                key={rel.id}
                book={rel}
                compact
                inCart={cartBookIds.has(rel.id)}
                inWishlist={wishlistIds.has(rel.id)}
                onSelectBook={onSelectBook}
                onFilterByAuthor={onFilterByAuthor}
                onFilterByCategory={onSelectCategory}
                onQuickAddToCart={(b) => onAddToCart(b, b.format)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
