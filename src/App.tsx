import { useState } from 'react';
import type { Video } from './types';
import type { Theme } from './theme';
import { useObjectUrl } from './useObjectUrl';
import { FEED_REGION_CODES, regionCategoryIds, useFeed } from './useFeed';
import { CATEGORY_LABELS, REGIONS } from './feedConstants';
import { colorFromString } from './random';
import { PreviewForm } from './components/PreviewForm';
import type { CategoryOption, ViewMode } from './components/PreviewForm';
import { DesktopPreview } from './components/DesktopPreview';
import { MobilePreview } from './components/MobilePreview';

// The brief fixes the user video's duration badge at 11:45 (705 seconds).
const USER_DURATION_SECONDS = 705;
const DEFAULT_REGION = 'IN';

const regionOptions: CategoryOption[] = REGIONS.filter((region) =>
  FEED_REGION_CODES.includes(region.code),
).map((region) => ({ id: region.code, label: region.label }));

export function App() {
  const [title, setTitle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [theme, setTheme] = useState<Theme>('dark');
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [categoryId, setCategoryId] = useState('0');
  const [seed, setSeed] = useState(1);
  const [position, setPosition] = useState(2);

  const thumbnailUrl = useObjectUrl(thumbnailFile);
  const avatarUrl = useObjectUrl(avatarFile);

  const { videos, shorts } = useFeed({
    region,
    categoryId,
    seed,
    excludeChannelName: channelName,
  });

  const trimmedChannel = channelName.trim() || 'Your Channel';
  const userVideo: Video = {
    id: 'user-video',
    title: title.trim() || 'Your video title will appear here',
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
    { id: '0', label: 'All' },
    ...regionCategoryIds(region).map((id) => ({
      id,
      label: CATEGORY_LABELS[id] ?? `Category ${id}`,
    })),
  ];

  const handleRegionChange = (nextRegion: string) => {
    setRegion(nextRegion);
    // The new region may not carry the currently selected category.
    setCategoryId('0');
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
              title={title}
              onTitleChange={setTitle}
              channelName={channelName}
              onChannelNameChange={setChannelName}
              onThumbnailChange={setThumbnailFile}
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
              position={position}
              onPositionChange={setPosition}
              onShuffle={() => setSeed((current) => current + 1)}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {viewMode === 'desktop' ? (
            <DesktopPreview
              userVideo={userVideo}
              videos={videos}
              shorts={shorts}
              position={position}
              theme={theme}
            />
          ) : (
            <MobilePreview
              userVideo={userVideo}
              videos={videos}
              shorts={shorts}
              position={position}
              theme={theme}
            />
          )}
        </main>
      </div>
    </div>
  );
}
