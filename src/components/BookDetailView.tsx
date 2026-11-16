import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { BookFormat } from '../types/bookstore';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

export function BookDetailView() {
  const {
    books,
    selectedBookId,
    navigateTo,
    openBook,
    addToCart,
    toggleWishlist,
    isWishlisted,
    addReview,
  } = useStore();

  const book = books.find((b) => b.id === selectedBookId) ?? books[0];

  const [selectedFormat, setSelectedFormat] = useState<BookFormat>('Hardcover');
  const [quantity, setQuantity] = useState(1);
  const [excerptOpen, setExcerptOpen] = useState(false);
  const [readerTextSize, setReaderTextSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const firstAvailable = book.variants.find((v) => v.stockCount > 0)?.format ?? 'Hardcover';
    setSelectedFormat(firstAvailable);
    setQuantity(1);
    setExcerptOpen(false);
  }, [book.id]);

  const activeVariant =
    book.variants.find((v) => v.format === selectedFormat) ?? book.variants[0];
  const saved = isWishlisted(book.id);

  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.genre === book.genre || b.collectionIds.some((c) => book.collectionIds.includes(c))))
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewTitle.trim() || !reviewComment.trim()) {
      setReviewError('Please complete your name, review headline, and comment.');
      return;
    }
    setReviewError(null);
    addReview(book.id, {
      authorName: reviewName.trim(),
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });
    setReviewName('');
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
  };

  const handleAddToBag = () => {
    if (activeVariant.stockCount <= 0) return;
    addToCart(book.id, activeVariant.format, quantity, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5C5A54] mb-8">
        <button
          type="button"
          onClick={() => navigateTo('storefront')}
          className="inline-flex items-center gap-1.5 font-medium text-[#141413] hover:text-[#1D4E3E] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Catalog</span>
        </button>
        <span aria-hidden="true">/</span>
        <span>{book.genre}</span>
        <span aria-hidden="true">/</span>
        <span className="text-[#141413] truncate">{book.title}</span>
      </nav>

      {/* Main 2-Column Contiguous PDP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Cover Stage & Excerpt Trigger */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-[#F2F1EC] border border-[#E6E4DC] rounded-xl p-8 sm:p-12 flex flex-col items-center">
            <div className="w-60 sm:w-72">
              <BookCover book={book} size="lg" />
            </div>

            <button
              type="button"
              onClick={() => setExcerptOpen(true)}
              className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[#D8D5CB] bg-white text-[#141413] text-sm font-medium hover:bg-[#FAFAF8] hover:border-[#1D4E3E] transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#1D4E3E]" aria-hidden="true" />
              <span>Read Chapter 1 Excerpt</span>
            </button>
          </div>

          {/* Edition Specifications */}
          <dl className="mt-6 grid grid-cols-2 gap-4 bg-white border border-[#E6E4DC] rounded-xl p-5 text-xs">
            <div>
              <dt className="text-[#5C5A54]">Publisher</dt>
              <dd className="font-medium text-[#141413] mt-0.5">{book.publisher}</dd>
            </div>
            <div>
              <dt className="text-[#5C5A54]">Published</dt>
              <dd className="font-mono-num font-medium text-[#141413] mt-0.5">
                {book.publishedYear}
              </dd>
            </div>
            <div>
              <dt className="text-[#5C5A54]">Extent</dt>
              <dd className="font-mono-num font-medium text-[#141413] mt-0.5">
                {book.pages} pages
              </dd>
            </div>
            <div>
              <dt className="text-[#5C5A54]">ISBN-13</dt>
              <dd className="font-mono-num font-medium text-[#141413] mt-0.5">{book.isbn}</dd>
            </div>
          </dl>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#5C5A54] mb-2">
            <span>{book.genre}</span>
            {book.editionNote && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1D4E3E] font-semibold">{book.editionNote}</span>
              </>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#141413] leading-tight">
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="text-lg text-[#5C5A54] mt-2">{book.subtitle}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-[#141413] font-medium">By {book.author}</span>
            <span className="text-[#D8D5CB]" aria-hidden="true">
              |
            </span>
            <a
              href="#reviews-section"
              className="inline-flex items-center gap-1.5 text-[#5C5A54] hover:text-[#141413]"
            >
              <Star className="w-4 h-4 text-[#B45309] fill-[#B45309]" aria-hidden="true" />
              <span className="font-semibold text-[#141413] tabular-nums">
                {book.rating.toFixed(1)}
              </span>
              <span className="tabular-nums">({book.reviewCount} reader reviews)</span>
            </a>
          </div>

          <p className="mt-6 text-base text-[#141413] leading-relaxed">{book.synopsis}</p>

          {/* Author Bio Box */}
          <div className="mt-6 p-4 rounded-lg bg-[#F2F1EC] border border-[#E6E4DC]">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5C5A54] mb-1">
              About the Author
            </p>
            <p className="text-sm text-[#141413] leading-relaxed">{book.authorBio}</p>
          </div>

          {/* Contiguous Edition & Purchase Box */}
          <div className="mt-8 bg-white border border-[#E6E4DC] rounded-xl p-6">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#5C5A54]">
                  Selected Format: {activeVariant.format}
                </p>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="font-mono-num text-3xl font-medium text-[#141413]">
                    ${activeVariant.price.toFixed(2)}
                  </span>
                  {activeVariant.originalPrice && (
                    <span className="font-mono-num text-base text-[#8A877E] line-through">
                      ${activeVariant.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    activeVariant.stockCount === 0
                      ? 'text-[#991B1B]'
                      : activeVariant.stockCount <= 5
                        ? 'text-[#B45309]'
                        : 'text-[#1D4E3E]'
                  }`}
                >
                  {activeVariant.stockCount > 0 && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                  {activeVariant.stockCount === 0
                    ? 'Currently Out of Stock'
                    : activeVariant.format === 'E-Book'
                      ? 'Instant Digital Download'
                      : activeVariant.stockCount <= 5
                        ? `Low Stock · Only ${activeVariant.stockCount} remaining`
                        : 'In Stock · Ships in 24h'}
                </span>
                <p className="font-mono-num text-[11px] text-[#5C5A54] mt-0.5">
                  SKU: {activeVariant.sku}
                </p>
              </div>
            </div>

            {/* Format Variant Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {book.variants.map((variant) => {
                const isSelected = variant.format === selectedFormat;
                const unavailable = variant.stockCount <= 0;
                return (
                  <button
                    key={variant.format}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(variant.format);
                      setQuantity(1);
                    }}
                    className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#1D4E3E] bg-[#1D4E3E]/[0.05] ring-1 ring-[#1D4E3E]'
                        : 'border-[#E6E4DC] bg-white hover:border-[#8A877E]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#141413]">
                        {variant.format}
                      </span>
                      <span className="font-mono-num text-sm font-medium text-[#141413]">
                        ${variant.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C5A54] mt-1">
                      {unavailable
                        ? 'Out of stock'
                        : variant.format === 'E-Book'
                          ? 'EPUB & PDF'
                          : `${variant.stockCount} available`}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quantity Stepper + Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {activeVariant.stockCount > 0 && activeVariant.format !== 'E-Book' && (
                <div className="inline-flex items-center justify-between border border-[#D8D5CB] rounded-lg bg-[#FAFAF8] h-12 px-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-[#141413] hover:bg-[#E6E4DC] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono-num w-10 text-center text-sm font-medium text-[#141413]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(activeVariant.stockCount, q + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-[#141413] hover:bg-[#E6E4DC] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button
                type="button"
                disabled={activeVariant.stockCount <= 0}
                onClick={handleAddToBag}
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] disabled:bg-[#D8D5CB] disabled:text-[#5C5A54] disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>
                  {activeVariant.stockCount > 0
                    ? `Add to Bag — $${(activeVariant.price * quantity).toFixed(2)}`
                    : 'Format Unavailable — Select Another'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(book.id)}
                className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  saved
                    ? 'border-[#1D4E3E] bg-[#1D4E3E]/10 text-[#1D4E3E]'
                    : 'border-[#D8D5CB] bg-white text-[#141413] hover:bg-[#F2F1EC]'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
                <span>{saved ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F0EFEA] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#5C5A54]">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#1D4E3E]" aria-hidden="true" />
                Complimentary standard shipping on orders over $45
              </span>
              <span>Archival gift wrapping available at checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Reviews & Write Review Form */}
      <section id="reviews-section" className="mt-16 pt-12 border-t border-[#E6E4DC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Review Summary + Form */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-2">
              Reader Feedback
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] mb-3">
              Reviews ({book.reviewCount})
            </h2>
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono-num text-3xl font-semibold text-[#141413]">
                {book.rating.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(book.rating)
                          ? 'text-[#B45309] fill-[#B45309]'
                          : 'text-[#D8D5CB]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#5C5A54] mt-0.5">Average reader rating</p>
              </div>
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="bg-white border border-[#E6E4DC] rounded-xl p-6 space-y-4"
            >
              <h3 className="font-display text-lg font-semibold text-[#141413]">
                Write a Reader Review
              </h3>

              {reviewError && (
                <p className="text-xs text-[#991B1B] bg-[#FEF2F2] border border-[#FECACA] rounded-md px-3 py-2">
                  {reviewError}
                </p>
              )}

              <div>
                <label htmlFor="rev-name" className="block text-xs font-medium text-[#141413] mb-1">
                  Your Name
                </label>
                <input
                  id="rev-name"
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Elena Vance"
                  className="w-full px-3 py-2 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#141413] mb-1">Rating</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setReviewRating(val)}
                      aria-label={`Rate ${val} out of 5 stars`}
                      className="p-1.5 rounded-md hover:bg-[#F2F1EC] cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          val <= reviewRating
                            ? 'text-[#B45309] fill-[#B45309]'
                            : 'text-[#D8D5CB]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="rev-title" className="block text-xs font-medium text-[#141413] mb-1">
                  Headline
                </label>
                <input
                  id="rev-title"
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Brief summary of your impression"
                  className="w-full px-3 py-2 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                />
              </div>

              <div>
                <label htmlFor="rev-body" className="block text-xs font-medium text-[#141413] mb-1">
                  Review
                </label>
                <textarea
                  id="rev-body"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share thoughts on the prose, print quality, or ideas..."
                  className="w-full px-3 py-2 rounded-lg border border-[#D8D5CB] text-sm focus:outline-none focus:border-[#1D4E3E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 min-h-[44px] rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#1D4E3E] transition-colors cursor-pointer"
              >
                Publish Review
              </button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:col-span-7 space-y-4">
            {book.reviews.length === 0 ? (
              <div className="bg-white border border-[#E6E4DC] rounded-xl p-8 text-center">
                <p className="font-display text-lg text-[#141413]">No written reviews yet</p>
                <p className="text-sm text-[#5C5A54] mt-1">
                  Be the first reader to share a note on this edition.
                </p>
              </div>
            ) : (
              book.reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="bg-white border border-[#E6E4DC] rounded-xl p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? 'text-[#B45309] fill-[#B45309]'
                                : 'text-[#D8D5CB]'
                            }`}
                          />
                        ))}
                      </div>
                      <h4 className="text-sm font-semibold text-[#141413]">{rev.title}</h4>
                    </div>
                    <span className="font-mono-num text-xs text-[#5C5A54]">{rev.date}</span>
                  </div>
                  <p className="text-sm text-[#141413] leading-relaxed mb-3">{rev.comment}</p>
                  <p className="text-xs text-[#5C5A54]">
                    {rev.authorName}
                    {rev.verifiedPurchase && ' · Verified Reader'}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E6E4DC]">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141413] mb-7">
            Paired Editions You May Enjoy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedBooks.map((rel) => (
              <div
                key={rel.id}
                className="bg-white border border-[#E6E4DC] rounded-xl p-5 flex items-center gap-5"
              >
                <button
                  type="button"
                  onClick={() => openBook(rel.id)}
                  className="w-20 shrink-0 cursor-pointer"
                >
                  <BookCover book={rel} size="sm" />
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[#5C5A54] truncate">
                    {rel.genre}
                  </p>
                  <button
                    type="button"
                    onClick={() => openBook(rel.id)}
                    className="font-display text-base font-semibold text-[#141413] hover:text-[#1D4E3E] text-left line-clamp-2 mt-0.5 cursor-pointer"
                  >
                    {rel.title}
                  </button>
                  <p className="text-xs text-[#5C5A54] mt-0.5 truncate">{rel.author}</p>
                  <p className="font-mono-num text-sm font-medium text-[#141413] mt-2">
                    From ${Math.min(...rel.variants.map((v) => v.price)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Chapter Excerpt Reader Modal */}
      {excerptOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="excerpt-modal-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#FAFAF8] border border-[#E6E4DC] rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-white border-b border-[#E6E4DC] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#5C5A54]">
                  Reading Sample · {book.title}
                </p>
                <h3 id="excerpt-modal-title" className="font-display text-lg font-semibold text-[#141413] truncate">
                  {book.excerptTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex items-center p-0.5 rounded-md bg-[#F2F1EC] border border-[#E6E4DC]">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setReaderTextSize(sz)}
                      className={`px-2 py-1 text-xs font-medium rounded cursor-pointer ${
                        readerTextSize === sz
                          ? 'bg-white text-[#141413] shadow-xs'
                          : 'text-[#5C5A54]'
                      }`}
                    >
                      {sz === 'sm' ? 'A-' : sz === 'md' ? 'A' : 'A+'}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setExcerptOpen(false)}
                  aria-label="Close excerpt reader"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#5C5A54] hover:text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-5">
              {book.excerptParagraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={`font-display text-[#141413] leading-relaxed ${
                    readerTextSize === 'sm'
                      ? 'text-sm'
                      : readerTextSize === 'lg'
                        ? 'text-xl'
                        : 'text-base sm:text-lg'
                  }`}
                >
                  {para}
                </p>
              ))}
              <p className="pt-4 border-t border-[#E6E4DC] text-xs text-[#5C5A54]">
                End of preview · Full edition runs {book.pages} pages ({book.publisher}).
              </p>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#E6E4DC] flex items-center justify-between gap-4">
              <span className="font-mono-num text-sm font-medium text-[#141413]">
                {activeVariant.format} · ${activeVariant.price.toFixed(2)}
              </span>
              <button
                type="button"
                disabled={activeVariant.stockCount <= 0}
                onClick={() => {
                  setExcerptOpen(false);
                  handleAddToBag();
                }}
                className="px-5 py-2.5 min-h-[40px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] disabled:bg-[#D8D5CB] cursor-pointer"
              >
                Add Edition to Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
