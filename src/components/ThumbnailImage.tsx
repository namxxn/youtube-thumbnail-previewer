import type { ThumbnailSource } from '../types';
import { YouTubeThumbnail } from './YouTubeThumbnail';

interface ThumbnailImageProps {
  thumbnail: ThumbnailSource;
  vertical?: boolean;
}

// Fills its (sized, overflow-hidden) parent with whichever thumbnail source the card has.
export function ThumbnailImage({ thumbnail, vertical = false }: ThumbnailImageProps) {
  switch (thumbnail.kind) {
    case 'image':
      return <img src={thumbnail.src} alt="" className="h-full w-full object-cover" />;
    case 'youtube':
      return <YouTubeThumbnail videoId={thumbnail.videoId} vertical={vertical} />;
    case 'gradient':
      return (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${thumbnail.from}, ${thumbnail.to})` }}
        >
          <span
            className={`font-black uppercase tracking-widest text-white/90 ${
              vertical ? 'text-sm' : 'text-3xl'
            }`}
          >
            {thumbnail.label}
          </span>
        </div>
      );
  }
}
