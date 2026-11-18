import React from 'react';
import { Bookmark, Check, ShoppingCart } from 'lucide-react';
import { Book } from '../types/bookstore';
import { BookCoverArt } from './BookCoverArt';

interface BookCardProps {
  book: Book;
  inCart: boolean;
  inWishlist: boolean;
  onSelectBook: (book: Book) => void;
  onFilterByAuthor: (authorName: string) => void;
  onFilterByCategory: (category: string) => void;
  onQuickAddToCart: (book: Book) => void;
  onToggleWishlist: (bookId: string) => void;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  inCart,
  inWishlist,
  onSelectBook,
  onFilterByAuthor,
  onFilterByCategory,
  onQuickAddToCart,
  onToggleWishlist,
  compact = false,
}) => {
  return (
    <article className="group flex gap-3.5 sm:gap-4 p-2.5 rounded-md transition-colors duration-150 hover:bg-[#1A1A1E]">
      {/* Book Cover */}
      <button
        type="button"
        onClick={() => onSelectBook(book)}
        aria-label={`View details for ${book.title}`}
        className={`${
          compact ? 'w-[86px]' : 'w-[100px] sm:w-[110px]'
        } shrink-0 text-left focus-visible:outline-2 focus-visible:outline-[#0F62FE] rounded-sm transition-transform duration-200 group-hover:-translate-y-0.5`}
      >
        <BookCoverArt
          theme={book.coverTheme}
          title={book.title}
          authorName={book.authorName}
          isbn={book.isbn}
          publisher={book.publisher}
          backBlurb={book.backCoverBlurb}
        />
      </button>

      {/* Book Metadata */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <button
              type="button"
              onClick={() => onSelectBook(book)}
              className="text-left text-[15px] font-semibold text-[#F4F4F4] hover:text-[#78A9FF] transition-colors leading-snug line-clamp-1 focus-visible:outline-2 focus-visible:outline-[#0F62FE] rounded"
            >
              {book.title}
            </button>
            <button
              type="button"
              onClick={() => onToggleWishlist(book.id)}
              aria-label={inWishlist ? `Remove ${book.title} from wishlist` : `Save ${book.title} to wishlist`}
              className={`p-1 rounded transition-colors shrink-0 ${
                inWishlist
                  ? 'text-[#78A9FF]'
                  : 'text-[#6F6F7B] hover:text-[#D4D4DC]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="text-[12px] text-[#A8A8B3] mt-0.5">
            by{' '}
            <button
              type="button"
              onClick={() => onFilterByAuthor(book.authorName)}
              className="text-[#78A9FF] hover:underline focus-visible:outline-2 focus-visible:outline-[#0F62FE] rounded"
            >
              {book.authorName}
            </button>
          </p>

          <p className="text-[12px] text-[#B8B8C2] mt-1.5 leading-relaxed line-clamp-2">
            {book.description}
          </p>
        </div>

        <div className="mt-2 space-y-1">
          <p className="text-[12px] text-[#E4E4E7]">{book.format}</p>
          <p className="text-[11.5px] leading-tight truncate">
            {book.categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                <button
                  type="button"
                  onClick={() => onFilterByCategory(cat)}
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

          <div className="pt-1 flex items-center justify-between gap-2">
            <div>
              <p className="text-[15px] font-semibold font-mono-num text-white leading-none">
                ₹{book.price}
              </p>
              <p className="text-[11px] text-[#9A9AA6] mt-1 truncate">
                {book.deliveryEstimate}
              </p>
            </div>

            {!compact && (
              <button
                type="button"
                onClick={() => onQuickAddToCart(book)}
                className={`px-2.5 py-1.5 rounded text-[11.5px] font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  inCart
                    ? 'bg-[#26262C] text-[#42BE65] border border-[#383842]'
                    : 'bg-[#222227] text-[#E4E4E7] hover:bg-[#0F62FE] hover:text-white border border-[#34343D] hover:border-[#0F62FE]'
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-3 h-3" /> In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" /> Add
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
