import type { Video } from '../types';
import { formatDuration, formatViews } from '../format';
import { YouTubeThumbnail } from './YouTubeThumbnail';

type CardVariant = 'desktop' | 'mobile';

interface VideoCardProps {
  video: Video;
  variant: CardVariant;
}

export function VideoCard({ video, variant }: VideoCardProps) {
  const isMobile = variant === 'mobile';

  return (
    <article className="flex flex-col">
      <Thumbnail video={video} rounded={!isMobile} />
      <div className={isMobile ? 'flex gap-3 px-3 py-3' : 'flex gap-3 pt-3'}>
        <Avatar video={video} />
        <div className="min-w-0 flex-1">
          {/* YouTube clamps feed titles to two lines; the rest is truncated with an ellipsis. */}
          <h3
            className={`line-clamp-2 font-medium text-[var(--yt-text)] ${
              isMobile ? 'text-[14px] leading-[20px]' : 'text-[16px] leading-[22px]'
            }`}
          >
            {video.title}
          </h3>
          {isMobile ? (
            <p className="mt-0.5 text-[12px] leading-[18px] text-[var(--yt-secondary)]">
              {video.channelName} &middot; {formatViews(video.viewCount)} &middot; {video.age}
            </p>
          ) : (
            <div className="mt-1 text-[14px] leading-[20px] text-[var(--yt-secondary)]">
              <p>{video.channelName}</p>
              <p>
                {formatViews(video.viewCount)} &middot; {video.age}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

interface ThumbnailProps {
  video: Video;
  rounded: boolean;
}

function Thumbnail({ video, rounded }: ThumbnailProps) {
  const { thumbnail } = video;
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-neutral-800 ${
        rounded ? 'rounded-xl' : ''
      }`}
    >
      {thumbnail.kind === 'image' && (
        <img src={thumbnail.src} alt="" className="h-full w-full object-cover" />
      )}
      {thumbnail.kind === 'youtube' && <YouTubeThumbnail videoId={thumbnail.videoId} />}
      {thumbnail.kind === 'gradient' && (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${thumbnail.from}, ${thumbnail.to})` }}
        >
          <span className="text-3xl font-black uppercase tracking-widest text-white/90">
            {thumbnail.label}
          </span>
        </div>
      )}
      {/* Duration badge: 12px/500 on rgba(0,0,0,0.8), 4px radius, 3px/4px padding. */}
      <span className="absolute bottom-2 right-2 rounded-[4px] bg-black/80 px-[4px] py-[3px] text-[12px] font-medium leading-none text-white">
        {formatDuration(video.durationSeconds)}
      </span>
    </div>
  );
}

function Avatar({ video }: { video: Video }) {
  // YouTube uses a 36px channel avatar beside the title in the home feed.
  const dimension = { width: 36, height: 36 };
  if (video.avatarSrc) {
    return (
      <img
        src={video.avatarSrc}
        alt=""
        width={36}
        height={36}
        referrerPolicy="no-referrer"
        className="shrink-0 rounded-full bg-neutral-700 object-cover"
        style={dimension}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
      style={{ ...dimension, backgroundColor: video.avatarColor }}
    >
      {video.channelName.charAt(0).toUpperCase()}
    </div>
  );
}
