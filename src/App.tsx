import { useCallback, useRef, useState } from 'react';
import type { Video } from './types';
import type { Theme } from './theme';
import { THEMES } from './theme';
import { copyPreviewImage } from './copyImage';
import { useObjectUrl } from './useObjectUrl';
import { FEED_REGION_CODES, regionCategoryIds, useFeed } from './useFeed';
import { CATEGORY_LABELS, REGIONS } from './feedConstants';
import { colorFromString } from './random';
import { PreviewForm } from './components/PreviewForm';
import type { CategoryOption, Format, ViewMode } from './components/PreviewForm';
import { DesktopPreview } from './components/DesktopPreview';
import { MobilePreview } from './components/MobilePreview';
import { ShortsPreview } from './components/ShortsPreview';

// The brief fixes the user video's duration badge at 11:45 (705 seconds).
const USER_DURATION_SECONDS = 705;
const DEFAULT_REGION = 'US';
const ALL_CATEGORIES = '0';

// Fields that differ between a long-form video and a Short are kept per format,
// so switching formats never loses the other one's title or thumbnail.
interface Draft {
  title: string;
  thumbnailFile: File | null;
  position: number;
}
const EMPTY_DRAFT: Draft = { title: '', thumbnailFile: null, position: 2 };

const regionOptions: CategoryOption[] = REGIONS.filter((region) =>
  FEED_REGION_CODES.includes(region.code),
).map((region) => ({ id: region.code, label: region.label }));

export function App() {
  const [format, setFormat] = useState<Format>('video');
  const [drafts, setDrafts] = useState<Record<Format, Draft>>({
    video: EMPTY_DRAFT,
    short: EMPTY_DRAFT,
  });
  const [channelName, setChannelName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [theme, setTheme] = useState<Theme>('dark');
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [categoryId, setCategoryId] = useState(ALL_CATEGORIES);
  const [seed, setSeed] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);

  const isShort = format === 'short';
  const draft = drafts[format];
  const updateDraft = (patch: Partial<Draft>) =>
    setDrafts((current) => ({ ...current, [format]: { ...current[format], ...patch } }));

  const thumbnailUrls: Record<Format, string | null> = {
    video: useObjectUrl(drafts.video.thumbnailFile),
    short: useObjectUrl(drafts.short.thumbnailFile),
  };
  const thumbnailUrl = thumbnailUrls[format];
  const avatarUrl = useObjectUrl(avatarFile);

  const copyPreview = useCallback(() => {
    const node = frameRef.current;
    if (!node) {
      return Promise.reject(new Error('Preview is not ready yet'));
    }
    return copyPreviewImage(node, {
      backgroundColor: THEMES[theme].bg,
      fileName: `yt-preview-${isShort ? 'shorts' : viewMode}.png`,
    });
  }, [theme, viewMode, isShort]);

  const { videos, shorts } = useFeed({
    region,
    // Category filtering would leave the Shorts shelf sparse, so Shorts mode uses all of them.
    categoryId: isShort ? ALL_CATEGORIES : categoryId,
    seed,
    excludeChannelName: channelName,
  });

  const trimmedChannel = channelName.trim() || 'Your Channel';
  const userVideo: Video = {
    id: 'user-video',
    title: draft.title.trim() || `Your ${isShort ? 'Short' : 'video'} title will appear here`,
    channelName: trimmedChannel,
    viewCount: 0,
    age: 'Just now',
    durationSeconds: USER_DURATION_SECONDS,
    thumbnail: thumbnailUrl
      ? { kind: 'image', src: thumbnailUrl }
      : { kind: 'gradient', from: '#111827', to: '#4b5563', label: 'Thumbnail' },
    avatarColor: colorFromString(trimmedChannel),
    avatarSrc: avatarUrl ?? undefined,
  };

  const categoryOptions: CategoryOption[] = [
    { id: ALL_CATEGORIES, label: 'All' },
    ...regionCategoryIds(region).map((id) => ({
      id,
      label: CATEGORY_LABELS[id] ?? `Category ${id}`,
    })),
  ];

  const handleRegionChange = (nextRegion: string) => {
    setRegion(nextRegion);
    // The new region may not carry the currently selected category.
    setCategoryId(ALL_CATEGORIES);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto flex max-w-[1760px] flex-col gap-6 p-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <h1 className="text-lg font-semibold">Thumbnail Previewer</h1>
            <p className="mt-1 mb-6 text-sm text-neutral-500">
              See how your video looks in the feed. Nothing is uploaded.
            </p>
            <PreviewForm
              format={format}
              onFormatChange={setFormat}
              title={draft.title}
              onTitleChange={(title) => updateDraft({ title })}
              channelName={channelName}
              onChannelNameChange={setChannelName}
              thumbnailFile={draft.thumbnailFile}
              onThumbnailChange={(thumbnailFile) => updateDraft({ thumbnailFile })}
              avatarName={avatarFile?.name}
              onAvatarChange={setAvatarFile}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              theme={theme}
              onThemeChange={setTheme}
              region={region}
              regionOptions={regionOptions}
              onRegionChange={handleRegionChange}
              categoryId={categoryId}
              categoryOptions={categoryOptions}
              onCategoryChange={setCategoryId}
              position={draft.position}
              onPositionChange={(position) => updateDraft({ position })}
              onShuffle={() => setSeed((current) => current + 1)}
              onCopyImage={copyPreview}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {isShort ? (
            <ShortsPreview
              userShort={userVideo}
              shorts={shorts}
              position={draft.position}
              theme={theme}
              frameRef={frameRef}
            />
          ) : viewMode === 'desktop' ? (
            <DesktopPreview
              userVideo={userVideo}
              videos={videos}
              shorts={shorts}
              position={draft.position}
              theme={theme}
              frameRef={frameRef}
            />
          ) : (
            <MobilePreview
              userVideo={userVideo}
              videos={videos}
              shorts={shorts}
              position={draft.position}
              theme={theme}
              frameRef={frameRef}
            />
          )}
        </main>
      </div>
    </div>
  );
}
