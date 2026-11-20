import type { ReactNode } from 'react';
import type { Video } from '../types';
import { formatViews } from '../format';
import { MoreIcon, ShortsIcon } from './icons';
import { ThumbnailImage } from './ThumbnailImage';

interface ShortsShelfProps {
  shorts: Video[];
  cardWidth: number;
  variant: 'desktop' | 'mobile';
}

export function ShortsShelf({ shorts, cardWidth, variant }: ShortsShelfProps) {
  return (
    <section className="py-2">
      <div className="mb-3 flex items-center gap-2">
        <ShortsIcon className="h-6 w-6 text-[#ff0033]" />
        <span className="text-[16px] font-semibold text-[var(--yt-text)]">Shorts</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
        {shorts.map((short) => (
          <article key={short.id} className="shrink-0" style={{ width: cardWidth }}>
            {variant === 'desktop' ? (
              <>
                {/* Desktop: 9:16 card with the title and views underneath. */}
                <ShortFrame short={short} className="rounded-xl" />
                <h3 className="mt-2 line-clamp-2 text-[14px] font-medium leading-[20px] text-[var(--yt-text)]">
                  {short.title}
                </h3>
                <p className="text-[12px] leading-[18px] text-[var(--yt-secondary)]">
                  {formatViews(short.viewCount)}
                </p>
              </>
            ) : (
              // Mobile app: title and views sit on the image over a dark scrim,
              // with the overflow menu in the top-right corner.
              <ShortFrame short={short} className="rounded-xl">
                <MoreIcon className="absolute top-2 right-1 h-5 w-5 text-white drop-shadow" />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-2 pt-10 pb-2">
                  <h3 className="line-clamp-2 text-[14px] font-medium leading-[20px] text-white">
                    {short.title}
                  </h3>
                  <p className="text-[12px] leading-[18px] text-white/80">
                    {formatViews(short.viewCount)}
                  </p>
                </div>
              </ShortFrame>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

// Channel page "Shorts" tab on mobile: a tight 3-column grid with only the view
// count on the image, so the thumbnail has to read without a title.
export function ShortsGrid({ shorts }: { shorts: Video[] }) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {shorts.map((short) => (
        <ShortFrame key={short.id} short={short}>
          <span className="absolute bottom-1.5 left-1.5 text-[12px] font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
            {formatViews(short.viewCount)}
          </span>
        </ShortFrame>
      ))}
    </div>
  );
}

interface ShortFrameProps {
  short: Video;
  className?: string;
  children?: ReactNode;
}

function ShortFrame({ short, className = '', children }: ShortFrameProps) {
  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden bg-neutral-800 ${className}`}>
      <ThumbnailImage thumbnail={short.thumbnail} vertical />
      {children}
    </div>
  );
}
