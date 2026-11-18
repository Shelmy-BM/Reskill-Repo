import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PUBLISHERS } from '../data/bookstoreData';
import { Book, Writer } from '../types/bookstore';

interface WritersPageProps {
  writers: Writer[];
  books: Book[];
  onFilterByAuthor: (authorName: string) => void;
  onFilterByPublisher: (publisher: string) => void;
  onSelectBook: (book: Book) => void;
}

export const WritersPage: React.FC<WritersPageProps> = ({
  writers,
  books,
  onFilterByAuthor,
  onFilterByPublisher,
  onSelectBook,
}) => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="border-b border-[#26262C] pb-4">
        <h1 className="text-xl font-semibold text-white">My Writers &amp; Publishers</h1>
        <p className="text-xs text-[#9A9AA6] mt-1">
          Explore featured authors and publishing houses in our catalogue.
        </p>
      </div>

      {/* Publishers / Brands Bar */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[#D4D4DC]">Featured Publishers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {PUBLISHERS.filter((p) => p !== 'All Publishers').map((pub) => {
            const count = books.filter((b) => b.publisher === pub).length;
            return (
              <button
                key={pub}
                type="button"
                onClick={() => onFilterByPublisher(pub)}
                className="p-3.5 text-left bg-[#1A1A1E] hover:bg-[#232329] border border-[#2C2C34] hover:border-[#0F62FE] rounded-sm transition-colors"
              >
                <p className="text-[13.5px] font-semibold text-white truncate">{pub}</p>
                <p className="text-[11.5px] text-[#78A9FF] mt-1 font-mono-num">
                  {count} {count === 1 ? 'title' : 'titles'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Writers Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[#D4D4DC]">Featured Writers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {writers.map((writer) => {
            const authoredBooks = books.filter(
              (b) => b.authorId === writer.id || b.authorName === writer.name
            );
            return (
              <article
                key={writer.id}
                className="bg-[#1A1A1E] border border-[#2A2A32] p-5 rounded-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5">
                    {writer.avatarUrl ? (
                      <img
                        src={writer.avatarUrl}
                        alt={writer.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border border-[#34343D] shrink-0"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-semibold text-white border border-[#34343D] shrink-0"
                        style={{ backgroundColor: writer.accentColor }}
                      >
                        {writer.initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-white truncate">
                        {writer.name}
                      </h3>
                      <p className="text-xs text-[#78A9FF] truncate">{writer.role}</p>
                      <p className="text-[11px] text-[#8E8E9A]">{writer.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#C6C6D0] leading-relaxed line-clamp-3">
                    {writer.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#26262C] space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {authoredBooks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => onSelectBook(b)}
                        className="text-[11.5px] text-[#D4D4DC] hover:text-[#78A9FF] underline underline-offset-2 truncate max-w-full"
                      >
                        {b.title}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onFilterByAuthor(writer.name)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78A9FF] hover:text-[#A6C8FF]"
                  >
                    <span>Browse in Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
