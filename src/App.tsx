import { X } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { CollectionsAndStory } from './components/CollectionsAndStory';
import { BookDetailView } from './components/BookDetailView';
import { WishlistView } from './components/WishlistView';
import { OrdersView } from './components/OrdersView';
import { CheckoutView } from './components/CheckoutView';
import { BagDrawer } from './components/BagDrawer';
import { Footer } from './components/Footer';

function BookstoreShell() {
  const { activeView, toast, dismissToast } = useStore();

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#141413]">
      <Navbar />

      <main className="flex-1">
        {activeView === 'storefront' && (
          <>
            <HeroSection />
            <CatalogSection />
            <CollectionsAndStory />
          </>
        )}
        {activeView === 'book' && <BookDetailView />}
        {activeView === 'wishlist' && <WishlistView />}
        {activeView === 'orders' && <OrdersView />}
        {activeView === 'checkout' && <CheckoutView />}
      </main>

      <Footer />
      <BagDrawer />

      {/* Subtle Toast Confirmation */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#141413] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3"
        >
          <p className="text-xs sm:text-sm leading-snug">{toast.message}</p>
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                dismissToast();
              }}
              className="text-xs font-semibold text-[#A7F3D0] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="p-1 text-white/70 hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BookstoreShell />
    </StoreProvider>
  );
}
