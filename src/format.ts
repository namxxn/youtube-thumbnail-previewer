export function formatViews(viewCount: number): string {
  if (viewCount <= 0) {
    return 'No views';
  }

  const units: Array<{ threshold: number; suffix: string }> = [
    { threshold: 1_000_000_000, suffix: 'B' },
    { threshold: 1_000_000, suffix: 'M' },
    { threshold: 1_000, suffix: 'K' },
  ];

  for (const { threshold, suffix } of units) {
    if (viewCount >= threshold) {
      const scaled = viewCount / threshold;
      const rounded = scaled >= 100 ? Math.round(scaled) : Math.round(scaled * 10) / 10;
      return `${trimTrailingZero(rounded)}${suffix} views`;
    }
  }

  return `${viewCount} views`;
}

// YouTube shows "M:SS" for sub-hour videos and "H:MM:SS" once the length passes
// an hour; minutes are only zero-padded when an hours segment precedes them.
export function formatDuration(durationSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(durationSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86_400;
const WEEK = 604_800;
const MONTH = 2_592_000;
const YEAR = 31_536_000;

export function formatRelativeTime(publishedAt: string, reference: string): string {
  const elapsed = Math.max(0, Math.floor((Date.parse(reference) - Date.parse(publishedAt)) / 1000));
  if (elapsed < MINUTE) {
    return 'just now';
  }
  const [unitSeconds, unitName] =
    elapsed < HOUR
      ? [MINUTE, 'minute']
      : elapsed < DAY
        ? [HOUR, 'hour']
        : elapsed < WEEK
          ? [DAY, 'day']
          : elapsed < MONTH
            ? [WEEK, 'week']
            : elapsed < YEAR
              ? [MONTH, 'month']
              : [YEAR, 'year'];
  const amount = Math.floor(elapsed / unitSeconds);
  return `${amount} ${unitName}${amount === 1 ? '' : 's'} ago`;
}

function trimTrailingZero(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}
