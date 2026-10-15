export const REGIONS = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
];

// YouTube videoCategoryId -> display name. Used to label the Category select;
// the available options are derived from whatever categories the feed contains.
export const CATEGORY_LABELS: Record<string, string> = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
};

// Cosmetic chip row shown under the top bar. Purely decorative in this preview.
export const CHIP_LABELS = [
  'All',
  'Music',
  'Live',
  'Gaming',
  'News',
  'Mixes',
  'Podcasts',
  'Comedy',
  'Trending',
  'Learning',
  'Sports',
  'Recently uploaded',
];
