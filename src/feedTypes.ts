export interface FeedVideo {
  id: string;
  title: string;
  channelName: string;
  channelHandle: string;
  avatarUrl: string;
  viewCount: number;
  publishedAt: string;
  durationSeconds: number;
  categoryId: string;
}

export interface FeedFile {
  fetchedAt: string;
  regions: Record<string, FeedVideo[]>;
}
