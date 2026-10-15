import type { Video } from '../types';
import { formatViews } from '../format';
import { ShortsIcon } from './icons';
import { YouTubeThumbnail } from './YouTubeThumbnail';

interface ShortsShelfProps {
  shorts: Video[];
  cardWidth: number;
}

export function ShortsShelf({ shorts, cardWidth }: ShortsShelfProps) {
  return (
    <section className="py-2">
      <div className="mb-3 flex items-center gap-2">
        <ShortsIcon className="h-6 w-6 text-[#ff0033]" />
        <span className="text-[16px] font-semibold text-[var(--yt-text)]">Shorts</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
        {shorts.map((short) => (
          <article key={short.id} className="shrink-0" style={{ width: cardWidth }}>
            {/* Shorts use 9:16 vertical thumbnails with the same 12px card radius. */}
            <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-neutral-800">
              {short.thumbnail.kind === 'youtube' && (
                <YouTubeThumbnail videoId={short.thumbnail.videoId} />
              )}
            </div>
            <h3 className="mt-2 line-clamp-2 text-[14px] font-medium leading-[20px] text-[var(--yt-text)]">
              {short.title}
            </h3>
            <p className="text-[12px] leading-[18px] text-[var(--yt-secondary)]">
              {formatViews(short.viewCount)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
