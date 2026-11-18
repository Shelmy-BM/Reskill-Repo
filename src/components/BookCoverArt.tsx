import React from 'react';
import { Book } from '../types/bookstore';

interface BookCoverArtProps {
  theme: Book['coverTheme'];
  title: string;
  authorName: string;
  isbn?: string;
  publisher?: string;
  backBlurb?: string;
  side?: 'front' | 'back';
  className?: string;
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({
  theme,
  title,
  authorName,
  isbn = '978-1-948210-63-3',
  publisher = 'ABC Publishers',
  backBlurb = 'Discover how less can truly be more with practical frameworks for intentional living and clarity.',
  side = 'front',
  className = '',
}) => {
  if (side === 'back') {
    const isYellow = theme === 'joy-minimalism';
    const bg = isYellow ? '#F5D018' : theme === 'focus-target' ? '#F3F1EC' : '#1E242B';
    const fg = isYellow || theme === 'focus-target' ? '#141414' : '#F4F4F4';
    const muted = isYellow || theme === 'focus-target' ? '#3F3F46' : '#A1A1AA';

    return (
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-sm select-none shadow-md flex flex-col justify-between p-4 ${className}`}
        style={{ backgroundColor: bg, color: fg }}
      >
        <div className="space-y-2">
          <p className="text-[9px] font-semibold tracking-wide uppercase opacity-80 text-center">
            “Less noise, deeper clarity.”
          </p>
          <p className="text-[10px] leading-relaxed font-normal" style={{ color: fg }}>
            {backBlurb}
          </p>
          <div className="pt-1 border-t border-current/15">
            <p className="text-[9px] font-semibold">About the author</p>
            <p className="text-[8.5px] leading-snug mt-0.5" style={{ color: muted }}>
              {authorName} writes on craft, clarity, and lasting curiosity. Published by {publisher}.
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 pt-2">
          <span className="text-[11px] font-bold tracking-tight opacity-70">{publisher.slice(0, 3).toUpperCase()}</span>
          <div className="bg-white px-2 py-1 rounded-[2px] text-[#111] flex flex-col items-center">
            <div className="flex items-stretch gap-[1.5px] h-5">
              {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2].map((w, idx) => (
                <span
                  key={idx}
                  className="bg-[#111] inline-block"
                  style={{ width: `${w}px` }}
                />
              ))}
            </div>
            <span className="text-[7px] font-mono-num tracking-tight mt-0.5">{isbn}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-sm select-none shadow-md ${className}`}
    >
      {theme === 'focus-target' && (
        <div className="h-full w-full bg-[#F2F0EB] text-[#171717] p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-bold text-[12px] leading-[1.12] tracking-tight uppercase">
              THE ART OF
              <br />
              FOCUS
            </p>
          </div>
          <svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden="true">
            <circle cx="50" cy="50" r="36" fill="none" stroke="#D94826" strokeWidth="6" />
            <circle cx="50" cy="50" r="22" fill="none" stroke="#D94826" strokeWidth="5.5" />
            <circle cx="50" cy="50" r="8" fill="#D94826" />
            <line x1="78" y1="22" x2="53" y2="47" stroke="#1E1E1E" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="82,18 72,20 80,28" fill="#D94826" />
          </svg>
          <div>
            <p className="text-[7px] text-[#525252] leading-tight mb-1">
              Practical Methods to Eliminate Distractions
            </p>
            <p className="text-[9.5px] font-semibold tracking-wider uppercase">{authorName}</p>
          </div>
        </div>
      )}

      {theme === 'learning-bulb' && (
        <div className="h-full w-full bg-[#C9361E] text-white p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-bold text-[11px] leading-[1.15] tracking-wide uppercase">
              THE ART
              <br />
              OF
              <br />
              LEARNING
            </p>
          </div>
          <svg viewBox="0 0 100 90" className="w-16 h-14" aria-hidden="true">
            <path d="M22 65 Q50 56 50 70 Q50 56 78 65 L82 74 Q50 66 50 78 Q50 66 18 74 Z" fill="#FDF6E3" />
            <circle cx="50" cy="34" r="15" fill="#FDE047" />
            <rect x="44" y="47" width="12" height="7" rx="2" fill="#E5E7EB" />
            <line x1="50" y1="10" x2="50" y2="15" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="22" x2="33" y2="26" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="22" x2="67" y2="26" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-[9.5px] font-semibold tracking-wider uppercase">{authorName}</p>
        </div>
      )}

      {theme === 'success-path' && (
        <div className="h-full w-full bg-gradient-to-b from-[#0E5A6F] via-[#136F7D] to-[#0A3D4C] text-white p-3 flex flex-col items-center justify-between text-center relative">
          <div className="pt-1 z-10">
            <p className="font-bold text-[11px] leading-[1.15] tracking-wide uppercase text-[#E2F1F4]">
              THE PATH TO
              <br />
              <span className="text-[#FACC15] text-[13px]">SUCCESS</span>
            </p>
          </div>
          <svg viewBox="0 0 100 90" className="w-full h-16 z-10" aria-hidden="true">
            <path d="M18 88 Q42 54 68 24 L80 24 Q55 60 44 88 Z" fill="#F59E0B" />
            <circle cx="74" cy="14" r="5" fill="#FDE047" />
            <circle cx="38" cy="48" r="4" fill="#0F172A" />
            <path d="M35 53 L41 53 L43 68 L33 68 Z" fill="#0F172A" />
            <circle cx="24" cy="20" r="1.2" fill="#FDE047" />
            <circle cx="84" cy="36" r="1.2" fill="#FDE047" />
          </svg>
          <p className="text-[9px] font-semibold tracking-wider uppercase z-10">{authorName}</p>
        </div>
      )}

      {theme === 'midnight-door' && (
        <div className="h-full w-full bg-gradient-to-b from-[#0A1E29] via-[#12303D] to-[#08151C] text-[#D7E6EC] p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-display-book font-semibold text-[11.5px] leading-[1.15] tracking-wide uppercase">
              THE
              <br />
              MIDNIGHT
              <br />
              HOUR
            </p>
          </div>
          <svg viewBox="0 0 100 90" className="w-16 h-14" aria-hidden="true">
            <path d="M10 85 L26 30 L34 85 Z" fill="#0D222B" />
            <path d="M70 85 L80 25 L92 85 Z" fill="#0D222B" />
            <rect x="40" y="34" width="20" height="44" rx="10" fill="#EAB308" opacity="0.28" />
            <rect x="44" y="42" width="12" height="36" rx="1" fill="#F59E0B" opacity="0.7" />
            <circle cx="50" cy="64" r="2.5" fill="#0A1E29" />
          </svg>
          <p className="text-[9px] font-medium tracking-widest uppercase text-[#94A3B8]">{authorName}</p>
        </div>
      )}

      {theme === 'beneath-stars' && (
        <div className="h-full w-full bg-gradient-to-b from-[#171230] via-[#3A224E] to-[#C27849] text-white p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-display-book font-semibold text-[12px] leading-[1.12]">
              Beneath
              <br />
              <span className="text-[9px] font-normal italic opacity-90">the</span> Stars
            </p>
          </div>
          <svg viewBox="0 0 100 80" className="w-16 h-14" aria-hidden="true">
            <circle cx="20" cy="14" r="1.2" fill="#FDE68A" />
            <circle cx="78" cy="18" r="1.4" fill="#FDE68A" />
            <circle cx="55" cy="10" r="1" fill="#FFF" />
            <circle cx="38" cy="48" r="6" fill="#1E142B" />
            <path d="M30 78 Q38 56 46 78 Z" fill="#1E142B" />
            <circle cx="60" cy="46" r="6" fill="#1E142B" />
            <path d="M51 78 Q60 54 69 78 Z" fill="#1E142B" />
          </svg>
          <p className="text-[8.5px] font-medium tracking-widest uppercase text-[#FDE68A]">{authorName}</p>
        </div>
      )}

      {theme === 'final-frontier' && (
        <div className="h-full w-full bg-gradient-to-b from-[#061326] via-[#0B2545] to-[#133C55] text-white p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-bold text-[11px] leading-[1.12] tracking-wider uppercase">
              THE
              <br />
              FINAL
              <br />
              FRONTIER
            </p>
          </div>
          <svg viewBox="0 0 100 85" className="w-16 h-14" aria-hidden="true">
            <circle cx="24" cy="24" r="8" fill="#38BDF8" opacity="0.5" />
            <circle cx="78" cy="64" r="5" fill="#FB923C" opacity="0.7" />
            <path d="M50 12 Q62 32 58 54 L42 54 Q38 32 50 12 Z" fill="#F8FAFC" />
            <circle cx="50" cy="34" r="4.5" fill="#0EA5E9" />
            <path d="M42 48 L34 60 L44 55 Z" fill="#EF4444" />
            <path d="M58 48 L66 60 L56 55 Z" fill="#EF4444" />
            <path d="M46 56 L50 74 L54 56 Z" fill="#F59E0B" />
          </svg>
          <p className="text-[8.5px] font-semibold tracking-wider uppercase text-[#CBD5E1]">{authorName}</p>
        </div>
      )}

      {theme === 'joy-minimalism' && (
        <div className="h-full w-full bg-[#F5D018] text-[#141414] p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-bold text-[10.5px] leading-[1.15] tracking-wide uppercase">
              THE JOY OF
              <br />
              MINIMALISM
            </p>
          </div>
          <svg viewBox="0 0 100 80" className="w-14 h-12" aria-hidden="true">
            <circle cx="50" cy="20" r="8" fill="#FFFBEB" />
            <path d="M26 70 V48 A24 24 0 0 1 74 48 V70" fill="none" stroke="#141414" strokeWidth="9" />
            <path d="M40 70 V50 A10 10 0 0 1 60 50 V70" fill="none" stroke="#141414" strokeWidth="7" />
          </svg>
          <div>
            <p className="text-[9px] font-bold tracking-wider uppercase">{authorName}</p>
            <p className="text-[6.5px] text-[#3F3F46] mt-0.5 leading-tight">
              Simplify your life for greater clarity and happiness
            </p>
          </div>
        </div>
      )}

      {theme === 'vanishing-house' && (
        <div className="h-full w-full bg-gradient-to-b from-[#1A252C] via-[#273742] to-[#121A1F] text-[#E2E8F0] p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-display-book font-semibold text-[10.5px] leading-[1.15] uppercase tracking-wide">
              THE
              <br />
              VANISHING
              <br />
              HOUSE
            </p>
          </div>
          <svg viewBox="0 0 100 85" className="w-16 h-14" aria-hidden="true">
            <path d="M20 75 V44 L50 20 L80 44 V75 Z" fill="#0F171C" />
            <rect x="32" y="48" width="9" height="12" fill="#FACC15" opacity="0.65" />
            <rect x="58" y="48" width="9" height="12" fill="#FACC15" opacity="0.65" />
            <rect x="46" y="56" width="8" height="19" fill="#1E293B" />
            <path d="M5 78 Q50 68 95 78" fill="none" stroke="#94A3B8" strokeWidth="3" opacity="0.35" />
          </svg>
          <p className="text-[8.5px] font-medium tracking-widest uppercase text-[#94A3B8]">{authorName}</p>
        </div>
      )}

      {theme === 'lost-kitten' && (
        <div className="h-full w-full bg-[#F27F1B] text-[#1F1209] p-3 flex flex-col items-center justify-between text-center">
          <div className="pt-1">
            <p className="font-display-book font-bold text-[12px] leading-[1.1]">
              The Lost
              <br />
              Kitten
            </p>
          </div>
          <svg viewBox="0 0 100 85" className="w-16 h-14" aria-hidden="true">
            <circle cx="50" cy="46" r="18" fill="#FDBA74" />
            <polygon points="34,36 36,20 46,32" fill="#FDBA74" />
            <polygon points="66,36 64,20 54,32" fill="#FDBA74" />
            <circle cx="44" cy="44" r="2.5" fill="#1C1917" />
            <circle cx="56" cy="44" r="2.5" fill="#1C1917" />
            <polygon points="48,50 52,50 50,53" fill="#EA580C" />
            <path d="M40 62 Q50 76 60 62" fill="#FDBA74" />
          </svg>
          <p className="text-[9px] font-bold tracking-wider uppercase text-[#431407]">{authorName}</p>
        </div>
      )}

      {(theme === 'editorial-crimson' ||
        theme === 'editorial-emerald' ||
        theme === 'editorial-indigo' ||
        theme === 'editorial-amber' ||
        theme === 'editorial-slate') && (
        <div
          className="h-full w-full p-3 flex flex-col justify-between text-left relative"
          style={{
            backgroundColor:
              theme === 'editorial-crimson'
                ? '#681E24'
                : theme === 'editorial-emerald'
                  ? '#12463B'
                  : theme === 'editorial-indigo'
                    ? '#1F2A56'
                    : theme === 'editorial-amber'
                      ? '#7C4B16'
                      : '#252B36',
            color: '#F8FAFC',
          }}
        >
          <div className="border-t border-white/30 pt-2">
            <p className="font-display-book font-semibold text-[11.5px] leading-snug line-clamp-3">
              {title}
            </p>
          </div>
          <div className="my-auto flex items-center justify-center opacity-25">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-5 h-5 rotate-45 border border-white" />
            </div>
          </div>
          <div className="border-b border-white/30 pb-1.5">
            <p className="text-[8.5px] font-semibold tracking-wider uppercase text-white/90 truncate">
              {authorName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
