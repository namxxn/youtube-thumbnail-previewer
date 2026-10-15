export type ThumbnailSource =
  | { kind: 'image'; src: string }
  | { kind: 'youtube'; videoId: string }
  | { kind: 'gradient'; from: string; to: string; label: string };

export interface Video {
  id: string;
  title: string;
  channelName: string;
  viewCount: number;
  age: string;
  durationSeconds: number;
  thumbnail: ThumbnailSource;
  avatarColor: string;
  avatarSrc?: string;
}
