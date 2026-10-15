import { useMemo } from 'react';
import type { FeedFile, FeedVideo } from './feedTypes';
import type { Video } from './types';
import { formatRelativeTime } from './format';
import { colorFromString, seededShuffle } from './random';
import feedData from './data/feed.json';

const feed = feedData as FeedFile;
const ALL_CATEGORIES = '0';

// Shorts are vertical clips; YouTube treats anything up to a minute as Short-eligible.
const SHORT_MAX_SECONDS = 60;

export const FEED_REGION_CODES = Object.keys(feed.regions);

export function regionCategoryIds(region: string): string[] {
  const list = feed.regions[region] ?? [];
  return [...new Set(list.map((video) => video.categoryId))].sort((a, b) => Number(a) - Number(b));
}

interface UseFeedParams {
  region: string;
  categoryId: string;
  seed: number;
  excludeChannelName: string;
}

interface FeedResult {
  videos: Video[];
  shorts: Video[];
}

export function useFeed({
  region,
  categoryId,
  seed,
  excludeChannelName,
}: UseFeedParams): FeedResult {
  return useMemo(() => {
    const source = feed.regions[region] ?? feed.regions[FEED_REGION_CODES[0]] ?? [];
    const excluded = excludeChannelName.trim().toLowerCase();

    const filtered = source.filter((video) => {
      const matchesCategory = categoryId === ALL_CATEGORIES || video.categoryId === categoryId;
      const isUserChannel = excluded.length > 0 && video.channelName.toLowerCase() === excluded;
      return matchesCategory && !isUserChannel;
    });

    const shuffled = seededShuffle(filtered, seed);
    const videos: Video[] = [];
    const shorts: Video[] = [];
    for (const feedVideo of shuffled) {
      const video = toVideo(feedVideo, feed.fetchedAt);
      if (feedVideo.durationSeconds <= SHORT_MAX_SECONDS) {
        shorts.push(video);
      } else {
        videos.push(video);
      }
    }
    return { videos, shorts };
  }, [region, categoryId, seed, excludeChannelName]);
}

function toVideo(feedVideo: FeedVideo, fetchedAt: string): Video {
  return {
    id: feedVideo.id,
    title: feedVideo.title,
    channelName: feedVideo.channelName,
    viewCount: feedVideo.viewCount,
    // Ages are measured against fetchedAt (not the current clock) so the feed
    // reads as fresh as the moment it was captured and stays stable on reload.
    age: formatRelativeTime(feedVideo.publishedAt, fetchedAt),
    durationSeconds: feedVideo.durationSeconds,
    thumbnail: { kind: 'youtube', videoId: feedVideo.id },
    avatarColor: colorFromString(feedVideo.channelName),
    avatarSrc: feedVideo.avatarUrl || undefined,
  };
}
