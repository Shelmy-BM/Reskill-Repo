import { ArrowRight } from 'lucide-react';
import { CURATED_COLLECTIONS, READER_TESTIMONIALS } from '../data/books';
import { useStore } from '../context/StoreContext';
import { BookCover } from './BookCover';

export function CollectionsAndStory() {
  const { books, selectCollectionAndBrowse, openBook } = useStore();

  return (
    <>
      {/* Curated Collections Shelf */}
      <section
        id="collections-section"
        className="border-t border-[#E6E4DC] bg-[#F2F1EC]/65 py-14 lg:py-18"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-2">
                Curated Reading Shelves
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
                Thematic Collections
              </h2>
            </div>
            <p className="text-sm text-[#5C5A54] max-w-md">
              Select a curated shelf to filter our catalog by mood, subject, and editorial pairing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {CURATED_COLLECTIONS.map((col) => {
              const shelfBooks = books
                .filter((b) => b.collectionIds.includes(col.id))
                .slice(0, 3);

              return (
                <div
                  key={col.id}
                  className="bg-white border border-[#E6E4DC] rounded-xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#5C5A54] mb-2">
                      {col.subtitle}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-[#141413] mb-2">
                      {col.title}
                    </h3>
                    <p className="text-sm text-[#5C5A54] leading-relaxed mb-6">
                      {col.description}
                    </p>

                    {/* Preview Trio of Covers */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {shelfBooks.map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => openBook(book.id)}
                          aria-label={`Open ${book.title}`}
                          className="cursor-pointer transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E3E]"
                        >
                          <BookCover book={book} size="sm" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between gap-3">
                    <span className="text-xs text-[#5C5A54] truncate">{col.curator}</span>
                    <button
                      type="button"
                      onClick={() => selectCollectionAndBrowse(col.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4E3E] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Explore Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bookshop Craftsmanship & Attributable Reader Notes */}
      <section className="border-t border-[#E6E4DC] bg-[#FAFAF8] py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-2">
              Reader Notes &amp; Archival Care
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#141413]">
              Why readers return to Alder &amp; Page
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {READER_TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                className="bg-white border border-[#E6E4DC] rounded-xl p-6 flex flex-col justify-between"
              >
                <p className="text-sm text-[#141413] leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="pt-4 border-t border-[#F0EFEA]">
                  <p className="text-sm font-semibold text-[#141413]">{item.name}</p>
                  <p className="text-xs text-[#5C5A54] mt-0.5">
                    {item.role} · {item.organization}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
