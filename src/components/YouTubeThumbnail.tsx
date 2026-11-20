import { useState } from 'react';

interface YouTubeThumbnailProps {
  videoId: string;
  // Shorts have a true 9:16 frame at oardefault (720x1280); hqdefault is a 4:3 letterbox.
  vertical?: boolean;
}

export function YouTubeThumbnail({ videoId, vertical = false }: YouTubeThumbnailProps) {
  // hqdefault exists for every video (maxresdefault 404s for many, and relying on
  // an onError fallback proved unreliable). object-cover crops its 4:3 letterbox
  // down to the card's aspect; mqdefault is a last-resort if hqdefault ever fails.
  const hq = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const portrait = `https://i.ytimg.com/vi/${videoId}/oardefault.jpg`;
  const [src, setSrc] = useState(vertical ? portrait : hq);
  const fallback = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
  return (
    <img
      src={src}
      alt=""
      // Not lazy: the desktop preview is CSS-transform-scaled, and native lazy
      // loading measures the pre-scale position, leaving on-screen cards blank.
      width={480}
      height={360}
      // crossOrigin lets the loaded image be painted into the capture canvas
      // without tainting it; ytimg serves Access-Control-Allow-Origin: *.
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onLoad={(event) => {
        // A missing oardefault still answers with an image (a 120x90 grey
        // placeholder, so onError never fires); anything not portrait is a miss.
        const { naturalWidth, naturalHeight } = event.currentTarget;
        if (src === portrait && naturalWidth >= naturalHeight) {
          setSrc(hq);
        }
      }}
      onError={() => {
        if (src !== fallback) {
          setSrc(fallback);
        }
      }}
      className="h-full w-full object-cover"
    />
  );
}
