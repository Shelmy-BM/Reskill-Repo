import React from 'react';
import { Bookmark, ShoppingCart, Trash2 } from 'lucide-react';
import { Book } from '../types/bookstore';
import { BookCoverArt } from './BookCoverArt';

interface WishlistPageProps {
  books: Book[];
  wishlistIds: Set<string>;
  cartBookIds: Set<string>;
  onSelectBook: (book: Book) => void;
  onMoveToCart: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  onBrowseCatalogue: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  books,
  wishlistIds,
  cartBookIds,
  onSelectBook,
  onMoveToCart,
  onToggleWishlist,
  onBrowseCatalogue,
}) => {
  const savedBooks = books.filter((b) => wishlistIds.has(b.id));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#26262C] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-white">My Wishlist</h1>
          <p className="text-xs text-[#9A9AA6] mt-1">
            Books saved for later reading. Move any title straight to your shopping cart.
          </p>
        </div>
        <button
          type="button"
          onClick={onBrowseCatalogue}
          className="px-4 py-2 bg-[#222227] hover:bg-[#2E2E36] border border-[#34343D] text-xs font-medium text-white rounded-sm transition-colors"
        >
          Explore More Books
        </button>
      </div>

      {savedBooks.length === 0 ? (
        <div className="bg-[#1B1B1F] border border-[#2C2C34] rounded-md p-10 text-center space-y-3">
          <Bookmark className="w-8 h-8 text-[#78A9FF] mx-auto" />
          <h2 className="text-base font-medium text-white">Your wishlist is empty</h2>
          <p className="text-xs text-[#9A9AA6]">
            Bookmark books from the catalogue or product pages to keep track of future reads.
          </p>
          <button
            type="button"
            onClick={onBrowseCatalogue}
            className="mt-2 px-5 py-2 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium rounded-sm transition-colors"
          >
            Browse Catalogue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedBooks.map((book) => {
            const inCart = cartBookIds.has(book.id);
            return (
              <div
                key={book.id}
                className="flex gap-4 p-4 bg-[#1A1A1E] border border-[#2A2A32] rounded-sm"
              >
                <button
                  type="button"
                  onClick={() => onSelectBook(book)}
                  className="w-[92px] shrink-0 text-left rounded-sm"
                >
                  <BookCoverArt
                    theme={book.coverTheme}
                    title={book.title}
                    authorName={book.authorName}
                    isbn={book.isbn}
                  />
                </button>

                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectBook(book)}
                      className="text-left text-[15px] font-semibold text-white hover:text-[#78A9FF] transition-colors truncate block w-full"
                    >
                      {book.title}
                    </button>
                    <p className="text-xs text-[#78A9FF] mt-0.5">by {book.authorName}</p>
                    <p className="text-xs text-[#B4B4BE] mt-1.5 line-clamp-2">{book.description}</p>
                    <p className="text-sm font-semibold font-mono-num text-white mt-2">
                      ₹{book.price} · <span className="font-sans font-normal text-xs text-[#A8A8B3]">{book.format}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onMoveToCart(book)}
                      className="px-3.5 py-1.5 bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium rounded-sm inline-flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{inCart ? 'Add Another' : 'Move to Cart'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(book.id)}
                      aria-label={`Remove ${book.title} from wishlist`}
                      className="p-1.5 text-[#8E8E9A] hover:text-[#FA4D56] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
