import type { ReactNode, RefObject } from 'react';
import type { Video } from '../types';
import type { Theme } from '../theme';
import { themeStyle } from '../theme';
import { useFitScale } from '../useFitScale';
import { ShortsGrid, ShortsShelf } from './ShortsShelf';

// The desktop shelf spans the 1440px home feed's content column
// (1440 - 72px rail - 2 x 24px padding), which fits six 210px cards.
const DESKTOP_SHELF_WIDTH = 1320;
const DESKTOP_CARD_WIDTH = 210;
const DESKTOP_VISIBLE = 6;
const MOBILE_CARD_WIDTH = 160;
const GRID_VISIBLE = 6; // Two rows of the 3-column channel grid.
const BOARD_PADDING = 24;
const BOARD_WIDTH = DESKTOP_SHELF_WIDTH + BOARD_PADDING * 2;

interface ShortsPreviewProps {
  userShort: Video;
  shorts: Video[];
  position: number;
  theme: Theme;
  frameRef: RefObject<HTMLDivElement | null>;
}

// One Shorts thumbnail is cropped and overlaid differently on each surface, so
// they are shown side by side at their real sizes rather than one at a time.
export function ShortsPreview({
  userShort,
  shorts,
  position,
  theme,
  frameRef,
}: ShortsPreviewProps) {
  const { containerRef, scale, height } = useFitScale(BOARD_WIDTH, frameRef);
  const borderColor = theme === 'dark' ? '#303030' : '#d9d9d9';

  const shelf = [...shorts];
  shelf.splice(Math.min(Math.max(position - 1, 0), shelf.length), 0, userShort);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div style={{ height }}>
        <div
          ref={frameRef}
          className="flex origin-top-left flex-col gap-8 bg-[var(--yt-bg)] text-[var(--yt-text)] shadow-sm ring-1 ring-black/10"
          style={{
            width: BOARD_WIDTH,
            padding: BOARD_PADDING,
            transform: `scale(${scale})`,
            ...themeStyle(theme),
          }}
        >
          <Surface label="Desktop · Home feed">
            <div style={{ width: DESKTOP_SHELF_WIDTH }}>
              <ShortsShelf
                shorts={shelf.slice(0, DESKTOP_VISIBLE)}
                cardWidth={DESKTOP_CARD_WIDTH}
                variant="desktop"
              />
            </div>
          </Surface>

          <div className="flex gap-8">
            <Surface label="Mobile app · Home feed">
              <Phone borderColor={borderColor}>
                <div className="px-3">
                  <ShortsShelf shorts={shelf} cardWidth={MOBILE_CARD_WIDTH} variant="mobile" />
                </div>
              </Phone>
            </Surface>
            <Surface label="Mobile app · Channel Shorts tab">
              <Phone borderColor={borderColor}>
                <ShortsGrid shorts={shelf.slice(0, GRID_VISIBLE)} />
              </Phone>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
}

function Surface({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[var(--yt-secondary)]">
        {label}
      </h2>
      {children}
    </section>
  );
}

// A phone-width (390px) panel; device chrome is omitted so only the surface is compared.
function Phone({ borderColor, children }: { borderColor: string; children: ReactNode }) {
  return (
    <div className="w-[390px] overflow-hidden rounded-[32px] border py-3" style={{ borderColor }}>
      {children}
    </div>
  );
}
