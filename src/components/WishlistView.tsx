import { ArrowLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

export function WishlistView() {
  const { books, wishlist, toggleWishlist, addToCart, openBook, navigateTo } = useStore();

  const savedBooks = books.filter((b) => wishlist.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <button
        type="button"
        onClick={() => navigateTo('storefront')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5A54] hover:text-[#141413] mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Back to Catalog</span>
      </button>

      <div className="flex flex-wrap items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E6E4DC]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-2">
            Personal Reading List
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
            Saved Editions ({savedBooks.length})
          </h1>
        </div>
      </div>

      {savedBooks.length === 0 ? (
        <div className="bg-white border border-[#E6E4DC] rounded-xl p-12 text-center">
          <Heart className="w-8 h-8 text-[#8A877E] mx-auto mb-3" aria-hidden="true" />
          <h2 className="font-display text-2xl font-semibold text-[#141413] mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-[#5C5A54] max-w-md mx-auto mb-6">
            Save titles you want to revisit later by clicking the heart button on any edition.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('storefront')}
            className="px-6 py-2.5 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] cursor-pointer"
          >
            Browse Bookstore
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {savedBooks.map((book) => {
            const defaultVariant =
              book.variants.find((v) => v.stockCount > 0) ?? book.variants[0];

            return (
              <article
                key={book.id}
                className="bg-white border border-[#E6E4DC] rounded-xl overflow-hidden flex flex-col"
              >
                <div className="bg-[#F2F1EC] px-8 py-6 flex items-center justify-center border-b border-[#E6E4DC]">
                  <button
                    type="button"
                    onClick={() => openBook(book.id)}
                    className="w-36 cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <BookCover book={book} size="md" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[#5C5A54] mb-1">
                    {book.genre} · {book.publishedYear}
                  </p>
                  <button
                    type="button"
                    onClick={() => openBook(book.id)}
                    className="font-display text-lg font-semibold text-[#141413] hover:text-[#1D4E3E] text-left cursor-pointer"
                  >
                    {book.title}
                  </button>
                  <p className="text-sm text-[#5C5A54] mt-0.5 mb-4">{book.author}</p>

                  <div className="mt-auto pt-4 border-t border-[#F0EFEA] flex items-center justify-between gap-2">
                    <span className="font-mono-num text-base font-medium text-[#141413]">
                      ${defaultVariant.price.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Remove ${book.title} from wishlist`}
                        onClick={() => toggleWishlist(book.id)}
                        className="w-10 h-10 rounded-lg border border-[#E6E4DC] flex items-center justify-center text-[#5C5A54] hover:text-[#991B1B] hover:border-[#FECACA] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        disabled={defaultVariant.stockCount <= 0}
                        onClick={() => addToCart(book.id, defaultVariant.format, 1, true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-[#1D4E3E] text-white text-xs font-medium hover:bg-[#153B2E] disabled:bg-[#D8D5CB] cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
