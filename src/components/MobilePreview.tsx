import type { RefObject } from 'react';
import type { Video } from '../types';
import type { Theme } from '../theme';
import { THEMES, themeStyle } from '../theme';
import { CHIP_LABELS } from '../feedConstants';
import { VideoCard } from './VideoCard';
import { ShortsShelf } from './ShortsShelf';
import {
  HomeIcon,
  LibraryIcon,
  SearchIcon,
  ShortsIcon,
  SubscriptionsIcon,
  YouTubeLogo,
} from './icons';

const CARDS_BEFORE_SHORTS = 2;
const SHORT_CARD_WIDTH = 160;

const TAB_ITEMS = [
  { label: 'Home', Icon: HomeIcon },
  { label: 'Shorts', Icon: ShortsIcon },
  { label: 'Subscriptions', Icon: SubscriptionsIcon },
  { label: 'Library', Icon: LibraryIcon },
];

interface MobilePreviewProps {
  userVideo: Video;
  videos: Video[];
  shorts: Video[];
  position: number;
  theme: Theme;
  frameRef: RefObject<HTMLDivElement | null>;
}

export function MobilePreview({
  userVideo,
  videos,
  shorts,
  position,
  theme,
  frameRef,
}: MobilePreviewProps) {
  const tokens = THEMES[theme];

  const feed = [...videos];
  feed.splice(Math.min(Math.max(position - 1, 0), feed.length), 0, userVideo);
  const beforeShelf = feed.slice(0, CARDS_BEFORE_SHORTS);
  const afterShelf = feed.slice(CARDS_BEFORE_SHORTS);

  return (
    // Center with a wrapper, not mx-auto on the frame: auto margins resolve to
    // large pixel values that html-to-image bakes into the capture and shift it.
    <div className="flex justify-center">
      <div
        ref={frameRef}
        className="w-[390px] overflow-hidden rounded-[32px] bg-[var(--yt-bg)] text-[var(--yt-text)] shadow-xl ring-1 ring-black/10"
        style={themeStyle(theme)}
      >
        <div className="flex h-[720px] flex-col">
          <header className="flex items-center justify-between px-4 py-3">
            <YouTubeLogo className="h-5 w-24" />
            <div className="flex items-center gap-4">
              <SearchIcon className="h-6 w-6" />
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                Y
              </div>
            </div>
          </header>

          {/* Chips: 32px tall, horizontally scrollable. */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
            {CHIP_LABELS.map((chip, index) => (
              <span
                key={chip}
                className="flex h-8 items-center whitespace-nowrap rounded-lg px-3 text-[14px] font-medium"
                style={
                  index === 0
                    ? { backgroundColor: tokens.text, color: tokens.bg }
                    : { backgroundColor: tokens.chip, color: tokens.text }
                }
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
            {beforeShelf.map((video) => (
              <VideoCard key={video.id} video={video} variant="mobile" />
            ))}
            {shorts.length > 0 && (
              <div className="px-3 pb-2">
                <ShortsShelf shorts={shorts} cardWidth={SHORT_CARD_WIDTH} />
              </div>
            )}
            {afterShelf.map((video) => (
              <VideoCard key={video.id} video={video} variant="mobile" />
            ))}
          </div>

          {/* Bottom tab bar is 48px tall. */}
          <nav
            className="flex h-12 items-center justify-around border-t"
            style={{ borderColor: theme === 'dark' ? '#272727' : '#e5e5e5' }}
          >
            {TAB_ITEMS.map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <Icon className="h-5 w-5" />
                <span className="text-[10px]">{label}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
