import { useMemo, useState } from 'react';
import { Heart, Search, ShoppingBag, Star, X } from 'lucide-react';
import { CURATED_COLLECTIONS, GENRES } from '../data/books';
import { BookFormat, BookGenre, SortOption } from '../types/bookstore';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

export function CatalogSection() {
  const {
    books,
    activeCollectionFilter,
    selectCollectionAndBrowse,
    openBook,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'All' | BookGenre>('All');
  const [selectedFormat, setSelectedFormat] = useState<'All' | BookFormat>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const activeCollection = useMemo(
    () => CURATED_COLLECTIONS.find((c) => c.id === activeCollectionFilter) || null,
    [activeCollectionFilter]
  );

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = books.filter((book) => {
      if (activeCollectionFilter && !book.collectionIds.includes(activeCollectionFilter)) {
        return false;
      }
      if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
        return false;
      }
      if (selectedFormat !== 'All') {
        const variant = book.variants.find((v) => v.format === selectedFormat);
        if (!variant) return false;
        if (inStockOnly && variant.stockCount <= 0) return false;
        if (variant.price > maxPrice) return false;
      } else {
        const hasAffordable = book.variants.some((v) => v.price <= maxPrice);
        if (!hasAffordable) return false;
        if (inStockOnly && !book.variants.some((v) => v.stockCount > 0)) return false;
      }

      if (q) {
        const haystack = `${book.title} ${book.subtitle ?? ''} ${book.author} ${book.genre} ${book.isbn} ${book.publisher} ${book.synopsis}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const getDisplayPrice = (book: (typeof books)[number]) => {
      if (selectedFormat !== 'All') {
        return book.variants.find((v) => v.format === selectedFormat)?.price ?? book.variants[0].price;
      }
      const paperback = book.variants.find((v) => v.format === 'Paperback');
      return paperback ? paperback.price : book.variants[0].price;
    };

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return getDisplayPrice(a) - getDisplayPrice(b);
        case 'price-desc':
          return getDisplayPrice(b) - getDisplayPrice(a);
        case 'rating':
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case 'newest':
          return b.publishedYear - a.publishedYear;
        case 'featured':
        default:
          return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) || b.rating - a.rating;
      }
    });
  }, [
    books,
    activeCollectionFilter,
    selectedGenre,
    selectedFormat,
    inStockOnly,
    maxPrice,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedGenre !== 'All' ||
    selectedFormat !== 'All' ||
    inStockOnly ||
    maxPrice < 60 ||
    activeCollectionFilter !== null;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedFormat('All');
    setInStockOnly(false);
    setMaxPrice(60);
    selectCollectionAndBrowse(null);
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Section Header & Search Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-2">
            Full Storefront Catalog
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
            {activeCollection ? activeCollection.title : 'Browse All Editions'}
          </h2>
          {activeCollection && (
            <p className="text-sm text-[#5C5A54] mt-1.5 max-w-2xl">
              {activeCollection.description}
            </p>
          )}
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-96">
          <label htmlFor="catalog-search" className="sr-only">
            Search books by title, author, genre, or ISBN
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#5C5A54] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, topic, or ISBN..."
              className="w-full pl-10 pr-10 py-2.5 min-h-[44px] rounded-lg border border-[#D8D5CB] bg-white text-sm text-[#141413] placeholder:text-[#8A877E] focus:outline-none focus:border-[#1D4E3E] focus:ring-2 focus:ring-[#1D4E3E]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#5C5A54] hover:text-[#141413] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Collection Notice */}
      {activeCollection && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-4 py-3 rounded-lg bg-[#F2F1EC] border border-[#E6E4DC]">
          <p className="text-sm text-[#141413]">
            Filtering by curated shelf: <span className="font-semibold">{activeCollection.title}</span>
            <span className="text-[#5C5A54]"> · {activeCollection.curator}</span>
          </p>
          <button
            type="button"
            onClick={() => selectCollectionAndBrowse(null)}
            className="text-xs font-medium text-[#1D4E3E] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Show all shelves
          </button>
        </div>
      )}

      {/* Interactive Genre Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#E6E4DC]">
        <button
          type="button"
          onClick={() => setSelectedGenre('All')}
          className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            selectedGenre === 'All'
              ? 'bg-[#141413] text-white'
              : 'bg-white border border-[#E6E4DC] text-[#5C5A54] hover:text-[#141413] hover:bg-[#F2F1EC]'
          }`}
        >
          All Genres
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => setSelectedGenre(genre)}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedGenre === genre
                ? 'bg-[#141413] text-white'
                : 'bg-white border border-[#E6E4DC] text-[#5C5A54] hover:text-[#141413] hover:bg-[#F2F1EC]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Secondary Toolbar: Format, Price, Availability, Sort & Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {/* Format Filter */}
          <div className="inline-flex items-center p-1 rounded-lg bg-[#F2F1EC] border border-[#E6E4DC]">
            {(['All', 'Hardcover', 'Paperback', 'E-Book'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedFormat === fmt
                    ? 'bg-white text-[#141413] shadow-sm'
                    : 'text-[#5C5A54] hover:text-[#141413]'
                }`}
              >
                {fmt === 'All' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>

          {/* Max Price Selector */}
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E6E4DC] bg-white text-xs text-[#5C5A54]">
            <span>Max Price:</span>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="font-medium text-[#141413] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={60}>Any price</option>
              <option value={20}>Under $20</option>
              <option value={30}>Under $30</option>
              <option value={40}>Under $40</option>
            </select>
          </label>

          {/* In-stock Toggle */}
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E6E4DC] bg-white text-xs font-medium text-[#141413] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#1D4E3E] w-3.5 h-3.5 rounded"
            />
            <span>In stock only</span>
          </label>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <p className="text-xs text-[#5C5A54] tabular-nums">
            Showing <span className="font-semibold text-[#141413]">{filteredBooks.length}</span> of{' '}
            {books.length} editions
          </p>

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E6E4DC] bg-white text-xs text-[#5C5A54]">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="font-medium text-[#141413] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-xl border border-[#E6E4DC] bg-white p-12 text-center">
          <h3 className="font-display text-2xl font-semibold text-[#141413] mb-2">
            No matching editions found
          </h3>
          <p className="text-sm text-[#5C5A54] max-w-md mx-auto mb-6">
            Try clearing one of your active filters or searching by a broader topic, author, or
            genre.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredBooks.map((book) => {
            const preferredFormat: BookFormat =
              selectedFormat !== 'All'
                ? selectedFormat
                : book.variants.find((v) => v.format === 'Hardcover' && v.stockCount > 0)
                  ? 'Hardcover'
                  : book.variants.find((v) => v.stockCount > 0)?.format ?? 'Paperback';

            const activeVariant =
              book.variants.find((v) => v.format === preferredFormat) ?? book.variants[0];
            const saved = isWishlisted(book.id);

            return (
              <article
                key={book.id}
                className="group flex flex-col bg-white border border-[#E6E4DC] rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(20,20,19,0.16)]"
              >
                {/* Warm Stone-Paper Stage */}
                <div className="relative bg-[#F2F1EC] px-8 py-7 flex items-center justify-center border-b border-[#E6E4DC]">
                  <button
                    type="button"
                    onClick={() => openBook(book.id)}
                    aria-label={`Inspect ${book.title}`}
                    className="w-40 sm:w-44 cursor-pointer transition-transform duration-200 group-hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4E3E]"
                  >
                    <BookCover book={book} size="md" />
                  </button>

                  {/* Single clean Wishlist icon button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(book.id)}
                    aria-label={saved ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                      saved
                        ? 'bg-[#1D4E3E] border-[#1D4E3E] text-white'
                        : 'bg-white/90 border-[#E6E4DC] text-[#5C5A54] hover:text-[#141413] hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Content — Identical Field Order */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Quiet 1-line unboxed metadata kicker */}
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-[#5C5A54] mb-1.5">
                    <span className="truncate">{book.genre}</span>
                    {book.editionNote && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1D4E3E] font-semibold whitespace-nowrap">
                          {book.editionNote}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Book Title & Author */}
                  <h3 className="font-display text-lg font-semibold text-[#141413] leading-snug">
                    <button
                      type="button"
                      onClick={() => openBook(book.id)}
                      className="text-left hover:text-[#1D4E3E] transition-colors cursor-pointer"
                    >
                      {book.title}
                    </button>
                  </h3>
                  <p className="text-sm text-[#5C5A54] mt-0.5 mb-3">{book.author}</p>

                  {/* Rating & Format Metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#5C5A54] mb-4">
                    <span className="inline-flex items-center gap-1 font-medium text-[#141413] tabular-nums">
                      <Star className="w-3.5 h-3.5 text-[#B45309] fill-[#B45309]" aria-hidden="true" />
                      {book.rating.toFixed(1)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{book.reviewCount} reviews</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeVariant.format}</span>
                  </div>

                  {/* Bottom Price & Action Baseline */}
                  <div className="mt-auto pt-4 border-t border-[#F0EFEA] flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono-num text-base font-medium text-[#141413]">
                          ${activeVariant.price.toFixed(2)}
                        </span>
                        {activeVariant.originalPrice && (
                          <span className="font-mono-num text-xs text-[#8A877E] line-through">
                            ${activeVariant.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5C5A54]">
                        {activeVariant.stockCount === 0
                          ? 'Out of stock'
                          : activeVariant.stockCount <= 5
                            ? `Only ${activeVariant.stockCount} left`
                            : 'In stock'}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={activeVariant.stockCount <= 0}
                      onClick={() => addToCart(book.id, activeVariant.format, 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#141413] text-white text-xs font-medium hover:bg-[#1D4E3E] disabled:bg-[#D8D5CB] disabled:text-[#5C5A54] disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{activeVariant.stockCount > 0 ? 'Add to Bag' : 'Unavailable'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
