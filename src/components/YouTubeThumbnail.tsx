import { useState } from 'react';

interface YouTubeThumbnailProps {
  videoId: string;
}

export function YouTubeThumbnail({ videoId }: YouTubeThumbnailProps) {
  // hqdefault exists for every video (maxresdefault 404s for many, and relying on
  // an onError fallback proved unreliable). object-cover crops its 4:3 letterbox
  // down to the 16:9 content; mqdefault is a last-resort if hqdefault ever fails.
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  const fallback = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  return (
    <img
      src={src}
      alt=""
      // Not lazy: the desktop preview is CSS-transform-scaled, and native lazy
      // loading measures the pre-scale position, leaving on-screen cards blank.
      width={480}
      height={360}
      referrerPolicy="no-referrer"
      onError={() => {
        if (src !== fallback) {
          setSrc(fallback);
        }
      }}
      className="h-full w-full object-cover"
    />
  );
}
