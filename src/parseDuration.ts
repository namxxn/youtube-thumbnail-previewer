const ISO_DURATION = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

// contentDetails.duration arrives as ISO 8601, e.g. "PT1H2M3S" or "PT45S".
export function parseIsoDuration(value: string): number {
  const match = ISO_DURATION.exec(value);
  if (!match) {
    return 0;
  }
  const [, days, hours, minutes, seconds] = match;
  return (
    Number(days ?? 0) * 86400 +
    Number(hours ?? 0) * 3600 +
    Number(minutes ?? 0) * 60 +
    Number(seconds ?? 0)
  );
}
