import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { parseIsoDuration } from '../src/parseDuration';
import type { FeedFile, FeedVideo } from '../src/feedTypes';

const REGIONS = ['US', 'IN', 'GB'];
// "0" is treated as "overall most popular" (no videoCategoryId filter); the
// others are Music, Gaming, Entertainment and Science & Technology.
const CATEGORIES = ['0', '10', '20', '24', '28'];

const API_BASE = 'https://www.googleapis.com/youtube/v3';
const OUTPUT_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/feed.json');

interface VideoListItem {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    categoryId: string;
    publishedAt: string;
  };
  statistics?: { viewCount?: string };
  contentDetails: { duration: string };
}

interface ChannelListItem {
  id: string;
  snippet: { thumbnails?: { default?: { url?: string } }; customUrl?: string };
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }
  return (await response.json()) as T;
}

async function fetchMostPopular(apiKey: string, region: string): Promise<VideoListItem[]> {
  const byId = new Map<string, VideoListItem>();
  for (const category of CATEGORIES) {
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      maxResults: '50',
      regionCode: region,
      key: apiKey,
    });
    if (category !== '0') {
      params.set('videoCategoryId', category);
    }
    const data = await fetchJson<{ items: VideoListItem[] }>(`${API_BASE}/videos?${params}`);
    for (const item of data.items ?? []) {
      if (!byId.has(item.id)) {
        byId.set(item.id, item);
      }
    }
  }
  return [...byId.values()];
}

async function fetchChannelInfo(
  apiKey: string,
  channelIds: string[],
): Promise<Map<string, { avatarUrl: string; handle: string }>> {
  const info = new Map<string, { avatarUrl: string; handle: string }>();
  for (let start = 0; start < channelIds.length; start += 50) {
    const batch = channelIds.slice(start, start + 50);
    const params = new URLSearchParams({
      part: 'snippet',
      id: batch.join(','),
      key: apiKey,
    });
    const data = await fetchJson<{ items: ChannelListItem[] }>(`${API_BASE}/channels?${params}`);
    for (const item of data.items ?? []) {
      info.set(item.id, {
        avatarUrl: item.snippet.thumbnails?.default?.url ?? '',
        handle: item.snippet.customUrl ?? '',
      });
    }
  }
  return info;
}

async function fetchRealFeed(apiKey: string): Promise<FeedFile> {
  const perRegion: Record<string, VideoListItem[]> = {};
  const channelIds = new Set<string>();
  for (const region of REGIONS) {
    const items = await fetchMostPopular(apiKey, region);
    perRegion[region] = items;
    items.forEach((item) => channelIds.add(item.snippet.channelId));
  }

  const channelInfo = await fetchChannelInfo(apiKey, [...channelIds]);

  const regions: Record<string, FeedVideo[]> = {};
  for (const region of REGIONS) {
    regions[region] = perRegion[region].map((item) => {
      const channel = channelInfo.get(item.snippet.channelId);
      return {
        id: item.id,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        channelHandle: channel?.handle ?? '',
        avatarUrl: channel?.avatarUrl ?? '',
        viewCount: Number(item.statistics?.viewCount ?? 0),
        publishedAt: item.snippet.publishedAt,
        durationSeconds: parseIsoDuration(item.contentDetails.duration),
        categoryId: item.snippet.categoryId,
      };
    });
  }

  return { fetchedAt: new Date().toISOString(), regions };
}

interface PlaceholderEntry {
  id: string;
  title: string;
  channelName: string;
  channelHandle: string;
  viewCount: number;
  durationSeconds: number;
  categoryId: string;
  ageHours: number;
}

// Real, long-lived YouTube IDs so i.ytimg.com thumbnails resolve even without an
// API key. Titles/channels are truthful; view counts and ages are synthetic so
// the relative-time formatting has variety to render.
const PLACEHOLDER_POOL: PlaceholderEntry[] = [
  {
    id: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    channelName: 'Luis Fonsi',
    channelHandle: '@LuisFonsi',
    viewCount: 8_600_000_000,
    durationSeconds: 282,
    categoryId: '10',
    ageHours: 3,
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'Ed Sheeran - Shape of You (Official Music Video)',
    channelName: 'Ed Sheeran',
    channelHandle: '@EdSheeran',
    viewCount: 6_300_000_000,
    durationSeconds: 264,
    categoryId: '10',
    ageHours: 14,
  },
  {
    id: 'RgKAFK5djSk',
    title: 'Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack',
    channelName: 'Wiz Khalifa',
    channelHandle: '@wizkhalifa',
    viewCount: 6_400_000_000,
    durationSeconds: 237,
    categoryId: '10',
    ageHours: 23,
  },
  {
    id: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE (강남스타일) M/V',
    channelName: 'officialpsy',
    channelHandle: '@officialpsy',
    viewCount: 5_100_000_000,
    durationSeconds: 253,
    categoryId: '10',
    ageHours: 48,
  },
  {
    id: 'OPf0YbXqDm0',
    title: 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars',
    channelName: 'Mark Ronson',
    channelHandle: '@MarkRonson',
    viewCount: 5_300_000_000,
    durationSeconds: 270,
    categoryId: '10',
    ageHours: 120,
  },
  {
    id: '60ItHLz5WEA',
    title: 'Alan Walker - Faded',
    channelName: 'Alan Walker',
    channelHandle: '@AlanWalker',
    viewCount: 3_900_000_000,
    durationSeconds: 212,
    categoryId: '10',
    ageHours: 144,
  },
  {
    id: 'hT_nvWreIhg',
    title: 'OneRepublic - Counting Stars (Official Music Video)',
    channelName: 'OneRepublic',
    channelHandle: '@OneRepublic',
    viewCount: 4_500_000_000,
    durationSeconds: 257,
    categoryId: '10',
    ageHours: 336,
  },
  {
    id: 'CevxZvSJLk8',
    title: 'Katy Perry - Roar (Official)',
    channelName: 'Katy Perry',
    channelHandle: '@katyperry',
    viewCount: 4_100_000_000,
    durationSeconds: 269,
    categoryId: '10',
    ageHours: 672,
  },
  {
    id: 'YQHsXMglC9A',
    title: 'Adele - Hello (Official Music Video)',
    channelName: 'Adele',
    channelHandle: '@Adele',
    viewCount: 3_300_000_000,
    durationSeconds: 367,
    categoryId: '10',
    ageHours: 1440,
  },
  {
    id: '2Vv-BfVoq4g',
    title: 'Ed Sheeran - Perfect (Official Music Video)',
    channelName: 'Ed Sheeran',
    channelHandle: '@EdSheeran',
    viewCount: 4_000_000_000,
    durationSeconds: 263,
    categoryId: '10',
    ageHours: 8760,
  },
  {
    id: 'e-ORhEE9VVg',
    title: 'Taylor Swift - Blank Space',
    channelName: 'Taylor Swift',
    channelHandle: '@TaylorSwift',
    viewCount: 3_400_000_000,
    durationSeconds: 272,
    categoryId: '10',
    ageHours: 17520,
  },
  {
    id: 'fregObNcHC8',
    title: 'Darude - Sandstorm',
    channelName: 'Darude',
    channelHandle: '@darude',
    viewCount: 300,
    durationSeconds: 229,
    categoryId: '10',
    ageHours: 5,
  },
  {
    id: 'ZbZSe6N_BXs',
    title: 'Pharrell Williams - Happy (Video)',
    channelName: 'Pharrell Williams',
    channelHandle: '@Pharrell',
    viewCount: 1_200_000,
    durationSeconds: 233,
    categoryId: '10',
    ageHours: 60,
  },
  {
    id: 'FTQbiNvZqaY',
    title: 'Toto - Africa (Official HD Video)',
    channelName: 'TotoVEVO',
    channelHandle: '@TotoVEVO',
    viewCount: 760_000,
    durationSeconds: 275,
    categoryId: '10',
    ageHours: 20160,
  },
  {
    id: '_OBlgSz8sSM',
    title: 'Charlie bit my finger - again !',
    channelName: 'Family Fun',
    channelHandle: '@HDCYT',
    viewCount: 890_000_000,
    durationSeconds: 56,
    categoryId: '24',
    ageHours: 96,
  },
  {
    id: 'jNQXAC9IVRw',
    title: 'Me at the zoo',
    channelName: 'jawed',
    channelHandle: '@jawed',
    viewCount: 350_000_000,
    durationSeconds: 19,
    categoryId: '24',
    ageHours: 1,
  },
  {
    id: 'ZZ5LpwO-An4',
    title: 'HEYYEYAAEYAAAEYAEYAA',
    channelName: 'brentalfloss',
    channelHandle: '@brentalfloss',
    viewCount: 100_000_000,
    durationSeconds: 56,
    categoryId: '24',
    ageHours: 12,
  },
  {
    id: 'y6120QOlsfU',
    title: 'Darude - Sandstorm (Short Cut)',
    channelName: 'clip reel',
    channelHandle: '@clips',
    viewCount: 48_000,
    durationSeconds: 45,
    categoryId: '24',
    ageHours: 7,
  },
];

function rotate<T>(items: readonly T[], offset: number): T[] {
  const length = items.length;
  const shift = ((offset % length) + length) % length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function buildPlaceholderFeed(): FeedFile {
  const fetchedAtMs = Date.now();
  const regions: Record<string, FeedVideo[]> = {};
  REGIONS.forEach((region, index) => {
    regions[region] = rotate(PLACEHOLDER_POOL, index * 5).map((entry) => ({
      id: entry.id,
      title: entry.title,
      channelName: entry.channelName,
      channelHandle: entry.channelHandle,
      avatarUrl: '',
      viewCount: entry.viewCount,
      publishedAt: new Date(fetchedAtMs - entry.ageHours * 3_600_000).toISOString(),
      durationSeconds: entry.durationSeconds,
      categoryId: entry.categoryId,
    }));
  });
  return { fetchedAt: new Date(fetchedAtMs).toISOString(), regions };
}

async function main(): Promise<void> {
  const apiKey = process.env.YT_API_KEY?.trim();
  let feed: FeedFile;
  if (apiKey) {
    console.log('YT_API_KEY found. Fetching live most-popular videos...');
    feed = await fetchRealFeed(apiKey);
  } else {
    console.log('No YT_API_KEY set. Writing a placeholder feed with real YouTube thumbnail IDs.');
    console.log('Add a key to .env and re-run "npm run feed:fetch" for live data.');
    feed = buildPlaceholderFeed();
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(feed, null, 2)}\n`);
  const total = Object.values(feed.regions).reduce((sum, list) => sum + list.length, 0);
  console.log(
    `Wrote ${total} videos across ${Object.keys(feed.regions).length} regions to ${OUTPUT_PATH}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
