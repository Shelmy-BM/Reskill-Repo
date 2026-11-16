import { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { HERO_IMAGE } from '../data/books';
import { useStore } from '../context/StoreContext';

export function HeroSection() {
  const { openBook, selectCollectionAndBrowse } = useStore();
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <section className="border-b border-[#E6E4DC] bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#5C5A54] mb-4">
              Autumn Folio · Independent Bookshop
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-[#141413] leading-[1.08] mb-5">
              Books chosen for quiet attention and lasting craft.
            </h1>
            <p className="text-base sm:text-lg text-[#5C5A54] leading-relaxed max-w-xl mb-8">
              Explore eighteen hand-selected editions across literary fiction, natural history,
              and architectural design—complete with Chapter 1 reading previews before you order.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => selectCollectionAndBrowse(null)}
                className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] rounded-lg bg-[#1D4E3E] text-white text-sm font-medium hover:bg-[#153B2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E3E]"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => openBook('book-01')}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-lg border border-[#D8D5CB] bg-white text-[#141413] text-sm font-medium hover:bg-[#F2F1EC] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4E3E]"
              >
                <BookOpen className="w-4 h-4 text-[#1D4E3E]" aria-hidden="true" />
                <span>Inspect Featured Edition</span>
              </button>
            </div>
          </div>

          {/* Right Photographic Anchor */}
          <div className="lg:col-span-6">
            <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-xl overflow-hidden bg-[#F2F1EC] border border-[#E6E4DC]">
              {!heroImgError ? (
                <img
                  src={HERO_IMAGE}
                  alt="Cloth-bound hardcover books displayed on a sunlit travertine table inside Alder & Page bookstore"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#EFECE4] to-[#E3DFD3]">
                  <BookOpen className="w-10 h-10 text-[#1D4E3E] mb-3" />
                  <p className="font-display text-xl text-[#141413]">Alder &amp; Page Reading Room</p>
                  <p className="text-sm text-[#5C5A54] mt-1">Portland · Est. 2019</p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/80">Featured Shelf</p>
                  <p className="font-display text-base sm:text-lg font-medium">
                    The Cedar &amp; Fern Herbarium · Hardcover
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openBook('book-01')}
                  className="px-3.5 py-1.5 rounded-md bg-white/95 text-[#141413] text-xs font-medium hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  View Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Store Promise Strip */}
        <div className="mt-10 pt-8 border-t border-[#E6E4DC] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="font-mono-num text-lg font-medium text-[#141413]">18 Editions</p>
            <p className="text-xs text-[#5C5A54] mt-0.5">Hardcover, Paperback &amp; E-Book formats</p>
          </div>
          <div>
            <p className="font-mono-num text-lg font-medium text-[#141413]">Free Over $45</p>
            <p className="text-xs text-[#5C5A54] mt-0.5">Archival paper wrap on every parcel</p>
          </div>
          <div>
            <p className="font-mono-num text-lg font-medium text-[#141413]">Code: READ10</p>
            <p className="text-xs text-[#5C5A54] mt-0.5">10% reader welcome savings at checkout</p>
          </div>
          <div>
            <p className="font-mono-num text-lg font-medium text-[#141413]">30-Day Returns</p>
            <p className="text-xs text-[#5C5A54] mt-0.5">Instant digital delivery for E-Books</p>
          </div>
        </div>
      </div>
    </section>
  );
}
