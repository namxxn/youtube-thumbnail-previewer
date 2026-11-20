import { useEffect, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { Theme } from '../theme';
import type { CopyImageResult } from '../copyImage';

export type ViewMode = 'desktop' | 'mobile';
export type Format = 'video' | 'short';

export interface CategoryOption {
  id: string;
  label: string;
}

const TITLE_LIMIT = 70;
// YouTube rejects custom thumbnails above 2MB; the preview still renders them.
const YOUTUBE_THUMBNAIL_BYTES = 2 * 1024 * 1024;
// Long-form can sit anywhere in the first rows; a Short only matters within the
// six cards the desktop shelf shows.
const MAX_POSITION: Record<Format, number> = { video: 12, short: 6 };

interface PreviewFormProps {
  format: Format;
  onFormatChange: (format: Format) => void;
  title: string;
  onTitleChange: (value: string) => void;
  channelName: string;
  onChannelNameChange: (value: string) => void;
  thumbnailFile: File | null;
  onThumbnailChange: (file: File | null) => void;
  avatarName?: string;
  onAvatarChange: (file: File | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  region: string;
  regionOptions: CategoryOption[];
  onRegionChange: (region: string) => void;
  categoryId: string;
  categoryOptions: CategoryOption[];
  onCategoryChange: (categoryId: string) => void;
  position: number;
  onPositionChange: (position: number) => void;
  onShuffle: () => void;
  onCopyImage: () => Promise<CopyImageResult>;
}

type CopyStatus = 'idle' | 'copying' | 'copied' | 'downloaded';

const COPY_LABELS: Record<CopyStatus, string> = {
  idle: 'Copy as image',
  copying: 'Copying…',
  copied: 'Copied!',
  downloaded: 'Downloaded',
};

export function PreviewForm({
  format,
  onFormatChange,
  title,
  onTitleChange,
  channelName,
  onChannelNameChange,
  thumbnailFile,
  onThumbnailChange,
  avatarName,
  onAvatarChange,
  viewMode,
  onViewModeChange,
  theme,
  onThemeChange,
  region,
  regionOptions,
  onRegionChange,
  categoryId,
  categoryOptions,
  onCategoryChange,
  position,
  onPositionChange,
  onShuffle,
  onCopyImage,
}: PreviewFormProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (copyStatus !== 'copied' && copyStatus !== 'downloaded') {
      return;
    }
    const timer = setTimeout(() => setCopyStatus('idle'), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleCopyImage = async () => {
    setCopyStatus('copying');
    try {
      setCopyStatus(await onCopyImage());
    } catch {
      setCopyStatus('idle');
    }
  };
  const isShort = format === 'short';
  const maxPosition = MAX_POSITION[format];

  const handleThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    onThumbnailChange(event.target.files?.[0] ?? null);
  };

  const handleAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    onAvatarChange(event.target.files?.[0] ?? null);
  };

  const handlePosition = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isNaN(next)) {
      return;
    }
    onPositionChange(Math.min(maxPosition, Math.max(1, Math.round(next))));
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
      <Segmented
        label="Format"
        value={format}
        onChange={onFormatChange}
        options={[
          { value: 'video', label: 'Long-form' },
          { value: 'short', label: 'Shorts' },
        ]}
      />

      <button
        type="button"
        onClick={handleCopyImage}
        disabled={copyStatus === 'copying'}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:opacity-60"
      >
        <span aria-live="polite">{COPY_LABELS[copyStatus]}</span>
      </button>

      <Field label="Title" required>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={`Enter your ${isShort ? 'Short' : 'video'} title`}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
        {!isShort && title.length > TITLE_LIMIT && (
          <p className="mt-1.5 text-xs text-amber-600">Titles truncate at around 70 characters</p>
        )}
      </Field>

      <Field
        label="Thumbnail"
        required
        hint={`Use a ${isShort ? '9:16 (1080×1920)' : '16:9'} image for best results`}
      >
        <input
          // Remount per format so the picker never shows the other format's file.
          key={format}
          type="file"
          accept="image/*"
          onChange={handleThumbnail}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
        />
        {thumbnailFile && <p className="mt-1.5 text-xs text-neutral-500">{thumbnailFile.name}</p>}
        {thumbnailFile && thumbnailFile.size > YOUTUBE_THUMBNAIL_BYTES && (
          <p className="mt-1.5 text-xs text-amber-600">YouTube rejects thumbnails over 2MB</p>
        )}
      </Field>

      <Field label="Avatar" hint="Optional. Falls back to a lettered circle.">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatar}
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
        />
        {avatarName && <p className="mt-1.5 text-xs text-neutral-500">{avatarName}</p>}
      </Field>

      <Field label="Channel name" required>
        <input
          type="text"
          value={channelName}
          onChange={(event) => onChannelNameChange(event.target.value)}
          placeholder="Enter your channel name"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
      </Field>

      <Field label="Feed region">
        <Select value={region} onChange={onRegionChange} options={regionOptions} />
      </Field>

      {!isShort && (
        <Field label="Feed category">
          <Select value={categoryId} onChange={onCategoryChange} options={categoryOptions} />
        </Field>
      )}

      <Field
        label={isShort ? 'My Short position' : 'My video position'}
        hint={`Where your ${isShort ? 'Short sits in the shelf' : 'video sits in the feed'} (1 to ${maxPosition}).`}
      >
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={maxPosition}
            value={position}
            onChange={handlePosition}
            className="w-20 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <button
            type="button"
            onClick={onShuffle}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Shuffle feed
          </button>
        </div>
      </Field>

      {/* Shorts mode always shows every surface side by side. */}
      {!isShort && (
        <Segmented
          label="Preview surface"
          value={viewMode}
          onChange={onViewModeChange}
          options={[
            { value: 'desktop', label: 'Desktop' },
            { value: 'mobile', label: 'Mobile' },
          ]}
        />
      )}

      <Segmented
        label="Theme"
        value={theme}
        onChange={onThemeChange}
        options={[
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
        ]}
      />
    </form>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-900">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {hint && <p className="mb-1.5 text-xs text-neutral-500">{hint}</p>}
      {children}
    </label>
  );
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CategoryOption[];
}

function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
}

function Segmented<T extends string>({ label, value, onChange, options }: SegmentedProps<T>) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-neutral-900">{label}</span>
      <div className="inline-flex rounded-lg border border-neutral-300 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              value === option.value
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
