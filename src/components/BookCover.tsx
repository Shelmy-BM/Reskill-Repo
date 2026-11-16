import { useState } from 'react';
import { Book } from '../types/bookstore';

interface BookCoverProps {
  book: Pick<Book, 'title' | 'author' | 'coverImage' | 'coverStyle'> & { genre?: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function MotifArtwork({
  motif,
  accent,
}: {
  motif: Book['coverStyle']['motif'];
  accent: string;
}) {
  switch (motif) {
    case 'botanical':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" fill="none" aria-hidden="true">
          <path
            d="M60 102V22M60 80C44 76 34 65 32 50M60 66C76 62 86 50 88 36M60 52C46 47 40 37 40 26M60 40C72 36 78 28 79 20"
            stroke={accent}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="18" r="3" stroke={accent} strokeWidth="1.4" />
        </svg>
      );
    case 'architectural':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" fill="none" aria-hidden="true">
          <rect x="22" y="26" width="76" height="68" stroke={accent} strokeWidth="1.3" />
          <path d="M22 66H98M54 26V94M54 48H98" stroke={accent} strokeWidth="1.2" />
          <path d="M32 94V76C32 70 44 70 44 76V94" stroke={accent} strokeWidth="1.2" />
        </svg>
      );
    case 'celestial':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" fill="none" aria-hidden="true">
          <circle cx="60" cy="56" r="30" stroke={accent} strokeWidth="1.2" strokeDasharray="3 4" />
          <path
            d="M68 38C58 40 52 48 52 58C52 68 58 76 68 78C55 81 42 71 42 58C42 45 55 35 68 38Z"
            stroke={accent}
            strokeWidth="1.4"
          />
          <circle cx="84" cy="36" r="2" fill={accent} />
          <circle cx="34" cy="80" r="1.5" fill={accent} />
        </svg>
      );
    case 'geometric':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" fill="none" aria-hidden="true">
          <circle cx="52" cy="58" r="26" stroke={accent} strokeWidth="1.4" />
          <circle cx="72" cy="62" r="22" stroke={accent} strokeWidth="1.2" />
          <line x1="20" y1="58" x2="100" y2="58" stroke={accent} strokeWidth="1.1" />
          <line x1="60" y1="20" x2="60" y2="100" stroke={accent} strokeWidth="1.1" />
        </svg>
      );
    case 'archive':
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" fill="none" aria-hidden="true">
          <circle cx="60" cy="60" r="32" stroke={accent} strokeWidth="1.3" />
          <circle cx="60" cy="60" r="22" stroke={accent} strokeWidth="1" />
          <path d="M60 22V98M22 60H98" stroke={accent} strokeWidth="1" />
          <polygon points="60,34 65,60 60,86 55,60" stroke={accent} strokeWidth="1.2" />
        </svg>
      );
    case 'horizon':
    default:
      return (
        <svg viewBox="0 0 120 120" className="w-20 h-20 opacity-85" fill="none" aria-hidden="true">
          <path d="M18 68C34 60 48 72 64 65C80 58 92 68 102 64" stroke={accent} strokeWidth="1.4" />
          <path d="M18 78C34 72 50 82 66 76C82 70 92 78 102 75" stroke={accent} strokeWidth="1.2" />
          <circle cx="60" cy="42" r="14" stroke={accent} strokeWidth="1.3" />
        </svg>
      );
  }
}

export function BookCover({ book, size = 'md', className = '' }: BookCoverProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(book.coverImage) && !imgFailed;

  const sizeTypography =
    size === 'sm'
      ? { title: 'text-xs leading-snug', author: 'text-[10px]', pad: 'p-3' }
      : size === 'lg'
        ? { title: 'text-2xl sm:text-3xl leading-tight', author: 'text-xs tracking-widest', pad: 'p-7 sm:p-8' }
        : { title: 'text-base leading-snug', author: 'text-[11px] tracking-wider', pad: 'p-5' };

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-[0_12px_24px_-12px_rgba(20,20,19,0.28)] select-none ${className}`}
      style={{ backgroundColor: book.coverStyle.bg, color: book.coverStyle.ink }}
    >
      {/* Realistic Left Spine Shadow & Hinge Crease */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-3 z-20"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(255,255,255,0.14) 45%, rgba(0,0,0,0.12) 75%, transparent 100%)',
        }}
      />

      {showImage ? (
        <div className="relative w-full h-full">
          <img
            src={book.coverImage}
            alt={`Cover artwork for ${book.title} by ${book.author}`}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />
          <div className={`absolute inset-x-0 bottom-0 z-10 ${sizeTypography.pad} text-white`}>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/80 mb-1 truncate">
              {book.author}
            </p>
            <h4 className={`font-display font-semibold ${sizeTypography.title} line-clamp-2`}>
              {book.title}
            </h4>
          </div>
        </div>
      ) : (
        <div className={`relative w-full h-full flex flex-col justify-between ${sizeTypography.pad}`}>
          {/* Inner archival framing rule */}
          <div
            className="pointer-events-none absolute inset-3 border opacity-35"
            style={{ borderColor: book.coverStyle.accent }}
          />
          <div className="relative z-10 pt-1 pl-1">
            <p
              className={`uppercase font-medium opacity-80 truncate ${sizeTypography.author}`}
            >
              {book.author}
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-center my-auto">
            {size !== 'sm' && (
              <MotifArtwork motif={book.coverStyle.motif} accent={book.coverStyle.accent} />
            )}
          </div>

          <div className="relative z-10 pb-1 pl-1">
            <div
              className="w-8 h-px mb-2.5 opacity-60"
              style={{ backgroundColor: book.coverStyle.accent }}
            />
            <h4 className={`font-display font-semibold ${sizeTypography.title} line-clamp-3`}>
              {book.title}
            </h4>
            {size === 'lg' && (
              <p className="mt-2 text-xs opacity-70 uppercase tracking-[0.14em]">
                {book.genre}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
