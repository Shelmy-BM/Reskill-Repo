import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Navbar() {
  const {
    activeView,
    cartCount,
    wishlist,
    navigateTo,
    selectCollectionAndBrowse,
    setIsBagOpen,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCatalogClick = () => {
    setMobileMenuOpen(false);
    selectCollectionAndBrowse(null);
  };

  const handleCollectionsClick = () => {
    setMobileMenuOpen(false);
    if (activeView !== 'storefront') {
      navigateTo('storefront');
      window.setTimeout(() => {
        document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNav = (view: 'wishlist' | 'orders') => {
    setMobileMenuOpen(false);
    navigateTo(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E6E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            navigateTo('storefront');
          }}
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#141413] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4E3E]"
        >
          Alder &amp; Page
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5A54]"
        >
          <button
            type="button"
            onClick={handleCatalogClick}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#141413] hover:underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4E3E] ${
              activeView === 'storefront' || activeView === 'book' ? 'text-[#141413] underline' : ''
            }`}
          >
            Catalog
          </button>
          <button
            type="button"
            onClick={handleCollectionsClick}
            className="py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#141413] hover:underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4E3E]"
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => handleNav('wishlist')}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#141413] hover:underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4E3E] ${
              activeView === 'wishlist' ? 'text-[#141413] underline' : ''
            }`}
          >
            Wishlist ({wishlist.length})
          </button>
          <button
            type="button"
            onClick={() => handleNav('orders')}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors hover:text-[#141413] hover:underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4E3E] ${
              activeView === 'orders' ? 'text-[#141413] underline' : ''
            }`}
          >
            Orders
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + mobile menu button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            aria-label={`Open shopping bag, ${cartCount} items`}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E3E]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Bag</span>
            <span className="font-mono-num text-xs opacity-90">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E6E4DC] bg-white text-[#141413] hover:bg-[#F2F1EC] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E4DC] bg-[#FAFAF8] px-4 py-3">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleCatalogClick}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={handleCollectionsClick}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
            >
              Collections
            </button>
            <button
              type="button"
              onClick={() => handleNav('wishlist')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
            >
              Wishlist ({wishlist.length})
            </button>
            <button
              type="button"
              onClick={() => handleNav('orders')}
              className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium text-[#141413] hover:bg-[#F2F1EC] cursor-pointer"
            >
              Orders
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
