import React, { useMemo, useState } from 'react';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/bookstoreData';
import { Book } from '../types/bookstore';
import { BookCard } from './BookCard';

interface CataloguePageProps {
  books: Book[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedAuthorFilter: string | null;
  onClearAuthorFilter: () => void;
  selectedPublisher: string;
  onSelectPublisher: (pub: string) => void;
  cartBookIds: Set<string>;
  wishlistIds: Set<string>;
  onSelectBook: (book: Book) => void;
  onFilterByAuthor: (authorName: string) => void;
  onQuickAddToCart: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
}

export const CataloguePage: React.FC<CataloguePageProps> = ({
  books,
  selectedCategory,
  onSelectCategory,
  selectedAuthorFilter,
  onClearAuthorFilter,
  selectedPublisher,
  onSelectPublisher,
  cartBookIds,
  wishlistIds,
  onSelectBook,
  onFilterByAuthor,
  onQuickAddToCart,
  onToggleWishlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [priceRangeFilter, setPriceRangeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    Boolean(selectedAuthorFilter) ||
    selectedPublisher !== 'All Publishers' ||
    searchQuery.trim() !== '' ||
    languageFilter !== 'All' ||
    formatFilter !== 'All' ||
    priceRangeFilter !== 'All' ||
    sortBy !== 'Relevance';

  const resetAllFilters = () => {
    onSelectCategory('All');
    onClearAuthorFilter();
    onSelectPublisher('All Publishers');
    setSearchQuery('');
    setLanguageFilter('All');
    setFormatFilter('All');
    setPriceRangeFilter('All');
    setSortBy('Relevance');
  };

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = books.filter((book) => {
      if (selectedCategory !== 'All') {
        const normalizedSel = selectedCategory.toLowerCase();
        const matchesPrimary = book.primaryCategory.toLowerCase() === normalizedSel;
        const matchesTags = book.categories.some((c) => c.toLowerCase() === normalizedSel);
        if (!matchesPrimary && !matchesTags) return false;
      }

      if (selectedAuthorFilter && book.authorName !== selectedAuthorFilter) {
        return false;
      }

      if (selectedPublisher !== 'All Publishers' && book.publisher !== selectedPublisher) {
        return false;
      }

      if (q) {
        const hay = `${book.title} ${book.authorName} ${book.description} ${book.publisher} ${book.categories.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (languageFilter !== 'All' && book.language !== languageFilter) {
        return false;
      }

      if (formatFilter !== 'All') {
        if (book.format !== formatFilter && !book.availableFormats.includes(formatFilter as Book['format'])) {
          return false;
        }
      }

      if (priceRangeFilter === 'Under ₹200' && book.price >= 200) return false;
      if (priceRangeFilter === '₹200 – ₹350' && (book.price < 200 || book.price > 350)) return false;
      if (priceRangeFilter === '₹350+' && book.price <= 350) return false;

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'Price: Low to High') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Bestsellers') {
      sorted.sort((a, b) => b.copiesSold - a.copiesSold);
    }
    return sorted;
  }, [
    books,
    selectedCategory,
    selectedAuthorFilter,
    selectedPublisher,
    searchQuery,
    languageFilter,
    formatFilter,
    priceRangeFilter,
    sortBy,
  ]);

  const sections: { title: string; items: Book[] }[] = [
    {
      title: 'Recommended for You',
      items: books.filter((b) => b.section === 'Recommended for You'),
    },
    {
      title: 'Bestsellers this Month',
      items: books.filter((b) => b.section === 'Bestsellers this Month'),
    },
    {
      title: 'New Launches',
      items: books.filter((b) => b.section === 'New Launches'),
    },
  ];

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    setMobileFiltersOpen(false);
  };

  return (
    <div className="w-full flex min-h-[calc(100vh-3rem)] relative">
      {/* Mobile Slide-Over Category Drawer (< 640px) — zero vertical space lost */}
      {mobileFiltersOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <aside
            aria-label="Book categories"
            className="relative z-10 w-60 max-w-[80vw] bg-[#141416] border-r border-[#2A2A30] h-full overflow-y-auto py-3"
          >
            <div className="px-4 pb-2 mb-1 border-b border-[#26262C] flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Categories</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close categories"
                className="p-1 text-[#A8A8B3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {CATEGORIES.map((category) => {
              const active = selectedCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left px-4 py-2 text-[12.5px] transition-colors block ${
                    active
                      ? 'bg-[#39393F] text-white font-medium'
                      : 'text-[#C6C6D0] hover:bg-[#222227] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </aside>
        </div>
      )}

      {/* Persistent Collapsible Left Category Sidebar (640px+) */}
      {!sidebarCollapsed && (
        <aside
          aria-label="Book categories"
          className="hidden sm:block w-[152px] md:w-[178px] lg:w-[204px] shrink-0 bg-[#141416] border-r border-[#24242A]"
        >
          <div className="sticky top-12 max-h-[calc(100vh-3rem)] overflow-y-auto pb-4">
            <div className="px-4 py-2 flex items-center justify-between border-b border-[#222228]">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8E9A]">
                Categories
              </span>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                aria-label="Collapse categories sidebar"
                title="Collapse categories"
                className="p-1 text-[#9A9AA6] hover:text-white hover:bg-[#222227] rounded-sm transition-colors"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>
            <nav className="pt-1">
              {CATEGORIES.map((category) => {
                const active = selectedCategory.toLowerCase() === category.toLowerCase();
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left px-4 py-1.5 text-[12px] leading-snug transition-colors block truncate ${
                      active
                        ? 'bg-[#39393F] text-white font-medium'
                        : 'text-[#C6C6D0] hover:bg-[#222227] hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 px-3 sm:px-5 lg:px-6 py-3 space-y-4">
        {/* Compact Single-Row Search & Filter Bar (640px+ single row matching wireframe) */}
        <section
          aria-label="Search and filter catalogue"
          className="flex items-stretch gap-2"
        >
          {sidebarCollapsed && (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Expand categories sidebar"
              title="Expand categories"
              className="hidden sm:flex items-center justify-center px-2.5 bg-[#1E1E22] hover:bg-[#2A2A32] border-b border-[#464652] text-[#C6C6D0] hover:text-white transition-colors shrink-0"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          <div className="flex-1 min-w-0 grid grid-cols-4 sm:grid-cols-12 gap-2">
            {/* Search Input */}
            <div className="col-span-4 sm:col-span-4 bg-[#1E1E22] border-b border-[#464652] focus-within:border-[#0F62FE] px-2.5 py-1.5 flex items-center gap-2 transition-colors">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open category sidebar"
                className="sm:hidden p-1 -ml-0.5 bg-[#2A2A32] text-[#78A9FF] rounded-sm shrink-0"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
              </button>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <label htmlFor="catalogue-search" className="text-[10px] text-[#9A9AA6] leading-none mb-1 truncate">
                  Search you want to read here
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="catalogue-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-[12px] text-white placeholder-[#73737E] focus:outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="text-[#9A9AA6] hover:text-white shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Search className="w-3.5 h-3.5 text-[#A8A8B3] shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="col-span-1 sm:col-span-2 bg-[#1E1E22] border-b border-[#464652] px-2.5 py-1.5 relative min-w-0">
              <label htmlFor="filter-language" className="block text-[10px] text-[#9A9AA6] leading-none mb-1 truncate">
                Language
              </label>
              <div className="relative flex items-center">
                <select
                  id="filter-language"
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[12px] text-white pr-4 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All" className="bg-[#1E1E22]">All</option>
                  <option value="English" className="bg-[#1E1E22]">English</option>
                  <option value="Spanish" className="bg-[#1E1E22]">Spanish</option>
                  <option value="Hindi" className="bg-[#1E1E22]">Hindi</option>
                  <option value="French" className="bg-[#1E1E22]">French</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#A8A8B3] pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* Format */}
            <div className="col-span-1 sm:col-span-2 bg-[#1E1E22] border-b border-[#464652] px-2.5 py-1.5 relative min-w-0">
              <label
                htmlFor="filter-format"
                title="Format (Paperback, eBook etc)"
                className="block text-[10px] text-[#9A9AA6] leading-none mb-1 truncate"
              >
                Format (Paperback, eBook etc)
              </label>
              <div className="relative flex items-center">
                <select
                  id="filter-format"
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[12px] text-white pr-4 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All" className="bg-[#1E1E22]">All</option>
                  <option value="Paperback" className="bg-[#1E1E22]">Paperback</option>
                  <option value="Hardcover" className="bg-[#1E1E22]">Hardcover</option>
                  <option value="eBook" className="bg-[#1E1E22]">eBook</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#A8A8B3] pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* Price Range */}
            <div className="col-span-1 sm:col-span-2 bg-[#1E1E22] border-b border-[#464652] px-2.5 py-1.5 relative min-w-0">
              <label htmlFor="filter-price" className="block text-[10px] text-[#9A9AA6] leading-none mb-1 truncate">
                Price Range
              </label>
              <div className="relative flex items-center">
                <select
                  id="filter-price"
                  value={priceRangeFilter}
                  onChange={(e) => setPriceRangeFilter(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[12px] text-white pr-4 focus:outline-none cursor-pointer truncate"
                >
                  <option value="All" className="bg-[#1E1E22]">All</option>
                  <option value="Under ₹200" className="bg-[#1E1E22]">Under ₹200</option>
                  <option value="₹200 – ₹350" className="bg-[#1E1E22]">₹200 – ₹350</option>
                  <option value="₹350+" className="bg-[#1E1E22]">₹350+</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#A8A8B3] pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* Sort By */}
            <div className="col-span-1 sm:col-span-2 bg-[#1E1E22] border-b border-[#464652] px-2.5 py-1.5 relative min-w-0">
              <label htmlFor="filter-sort" className="block text-[10px] text-[#9A9AA6] leading-none mb-1 truncate">
                Sort by
              </label>
              <div className="relative flex items-center">
                <select
                  id="filter-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[12px] text-white pr-4 focus:outline-none cursor-pointer truncate"
                >
                  <option value="Relevance" className="bg-[#1E1E22]">Relevance</option>
                  <option value="Price: Low to High" className="bg-[#1E1E22]">Price: Low to High</option>
                  <option value="Price: High to Low" className="bg-[#1E1E22]">Price: High to Low</option>
                  <option value="Rating" className="bg-[#1E1E22]">Highest Rated</option>
                  <option value="Bestsellers" className="bg-[#1E1E22]">Bestsellers</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#A8A8B3] pointer-events-none absolute right-0" />
              </div>
            </div>
          </div>
        </section>

        {/* Active Filter Context Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 bg-[#1A1A1E] border border-[#2C2C34] rounded-md text-xs">
            <div className="flex flex-wrap items-center gap-2 text-[#C6C6D0]">
              <span className="font-mono-num text-white font-semibold">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
              </span>
              {selectedCategory !== 'All' && <span>· Category: {selectedCategory}</span>}
              {selectedAuthorFilter && <span>· Writer: {selectedAuthorFilter}</span>}
              {selectedPublisher !== 'All Publishers' && <span>· Publisher: {selectedPublisher}</span>}
              {formatFilter !== 'All' && <span>· Format: {formatFilter}</span>}
              {languageFilter !== 'All' && <span>· Language: {languageFilter}</span>}
              {priceRangeFilter !== 'All' && <span>· Price: {priceRangeFilter}</span>}
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[#78A9FF] hover:text-[#A6C8FF] font-medium whitespace-nowrap"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Default Curated 3-Section View (Matches Slides 1 & 2) OR Filtered Grid */}
        {!hasActiveFilters ? (
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-[16px] font-medium text-[#F4F4F4] tracking-tight">
                  {section.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {section.items.map((book) => (
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
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#18181C] border border-[#2A2A30] rounded-md">
            <p className="text-base font-medium text-white">No books matched your current selection</p>
            <p className="text-sm text-[#9A9AA6] mt-1">
              Try clearing a category, price range, or search keyword to explore the catalogue.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium rounded-sm transition-colors"
            >
              Show All Books
            </button>
          </div>
        ) : (
          <section className="space-y-3">
            <h2 className="text-[16px] font-medium text-[#F4F4F4]">
              {selectedAuthorFilter
                ? `Books by ${selectedAuthorFilter}`
                : selectedCategory !== 'All'
                  ? `${selectedCategory} Books`
                  : 'Catalogue Results'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
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
      </main>
    </div>
  );
};
