import type { RefObject } from 'react';
import type { Video } from '../types';
import type { Theme } from '../theme';
import { THEMES, themeStyle } from '../theme';
import { CHIP_LABELS } from '../feedConstants';
import { useFitScale } from '../useFitScale';
import { VideoCard } from './VideoCard';
import { ShortsShelf } from './ShortsShelf';
import {
  BellIcon,
  CreateIcon,
  HistoryIcon,
  HomeIcon,
  LibraryIcon,
  MenuIcon,
  MicIcon,
  SearchIcon,
  ShortsIcon,
  SubscriptionsIcon,
  YouTubeLogo,
} from './icons';

// 1440px signed-out layout with the rail collapsed to 72px. At this width
// YouTube shows 4 columns; a 5th column only appears at viewport >= 1600.
const DESKTOP_WIDTH = 1440;
const CARDS_BEFORE_SHORTS = 8; // Two full rows of four before the Shorts shelf.
const SHORT_CARD_WIDTH = 210;

const RAIL_ITEMS = [
  { label: 'Home', Icon: HomeIcon },
  { label: 'Shorts', Icon: ShortsIcon },
  { label: 'Subscriptions', Icon: SubscriptionsIcon },
  { label: 'Library', Icon: LibraryIcon },
  { label: 'History', Icon: HistoryIcon },
];

interface DesktopPreviewProps {
  userVideo: Video;
  videos: Video[];
  shorts: Video[];
  position: number;
  theme: Theme;
  frameRef: RefObject<HTMLDivElement | null>;
}

export function DesktopPreview({
  userVideo,
  videos,
  shorts,
  position,
  theme,
  frameRef,
}: DesktopPreviewProps) {
  const { containerRef, scale, height } = useFitScale(DESKTOP_WIDTH, frameRef);
  const tokens = THEMES[theme];
  const borderColor = theme === 'dark' ? '#303030' : '#d9d9d9';

  const gridVideos = [...videos];
  gridVideos.splice(Math.min(Math.max(position - 1, 0), gridVideos.length), 0, userVideo);
  const firstRows = gridVideos.slice(0, CARDS_BEFORE_SHORTS);
  const restRows = gridVideos.slice(CARDS_BEFORE_SHORTS);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div style={{ height }}>
        <div
          ref={frameRef}
          className="origin-top-left bg-[var(--yt-bg)] text-[var(--yt-text)] shadow-sm ring-1 ring-black/10"
          style={{ width: DESKTOP_WIDTH, transform: `scale(${scale})`, ...themeStyle(theme) }}
        >
          {/* Top bar is 56px tall. */}
          <header className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <MenuIcon className="h-6 w-6" />
              <YouTubeLogo className="h-5 w-24" />
            </div>
            <div className="flex flex-1 items-center justify-center px-10">
              <div
                className="flex w-full max-w-[540px] items-center rounded-l-full border px-4 py-2 text-[var(--yt-secondary)]"
                style={{ borderColor }}
              >
                <span>Search</span>
              </div>
              <button
                type="button"
                className="rounded-r-full border border-l-0 px-5 py-2"
                style={{ borderColor, backgroundColor: tokens.chip }}
                aria-label="Search"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="ml-3 rounded-full p-2.5"
                style={{ backgroundColor: tokens.chip }}
                aria-label="Search with voice"
              >
                <MicIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-5">
              <CreateIcon className="h-6 w-6" />
              <BellIcon className="h-6 w-6" />
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                Y
              </div>
            </div>
          </header>

          <div className="flex">
            <nav className="flex w-[72px] shrink-0 flex-col items-center gap-5 py-4">
              {RAIL_ITEMS.map(({ label, Icon }) => (
                <div key={label} className="flex w-full flex-col items-center gap-1.5">
                  <Icon className="h-6 w-6" />
                  <span className="text-[10px]">{label}</span>
                </div>
              ))}
            </nav>

            <main className="min-w-0 flex-1 px-6 pb-10">
              {/* Chips: 32px tall, 12px horizontal padding, 8px radius. */}
              <div className="flex gap-3 overflow-x-auto py-3 [scrollbar-width:none]">
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

              <div className="grid grid-cols-4 gap-x-4 gap-y-10 pt-2">
                {firstRows.map((video) => (
                  <VideoCard key={video.id} video={video} variant="desktop" />
                ))}
                {shorts.length > 0 && (
                  <div className="col-span-4">
                    <ShortsShelf shorts={shorts} cardWidth={SHORT_CARD_WIDTH} />
                  </div>
                )}
                {restRows.map((video) => (
                  <VideoCard key={video.id} video={video} variant="desktop" />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
