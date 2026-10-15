import { describe, expect, it } from 'vitest';
import { formatDuration, formatRelativeTime, formatViews } from './format';

describe('formatViews', () => {
  it('reports no views for zero or negative counts', () => {
    expect(formatViews(0)).toBe('No views');
    expect(formatViews(-5)).toBe('No views');
  });

  it('leaves small counts unscaled', () => {
    expect(formatViews(1)).toBe('1 views');
    expect(formatViews(301)).toBe('301 views');
    expect(formatViews(999)).toBe('999 views');
  });

  it('scales thousands with one decimal and trims whole numbers', () => {
    expect(formatViews(1000)).toBe('1K views');
    expect(formatViews(1500)).toBe('1.5K views');
    expect(formatViews(12_000)).toBe('12K views');
  });

  it('scales millions and billions', () => {
    expect(formatViews(1_200_000)).toBe('1.2M views');
    expect(formatViews(2_500_000)).toBe('2.5M views');
    expect(formatViews(1_000_000)).toBe('1M views');
    expect(formatViews(3_200_000_000)).toBe('3.2B views');
  });

  it('drops the decimal once the scaled value reaches three digits', () => {
    expect(formatViews(123_400_000)).toBe('123M views');
  });
});

describe('formatDuration', () => {
  it('uses M:SS below an hour with zero-padded seconds only', () => {
    expect(formatDuration(90)).toBe('1:30');
    expect(formatDuration(444)).toBe('7:24');
    expect(formatDuration(13)).toBe('0:13');
    expect(formatDuration(705)).toBe('11:45');
  });

  it('uses H:MM:SS at or beyond an hour', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(3962)).toBe('1:06:02');
  });

  it('clamps invalid input to zero', () => {
    expect(formatDuration(-10)).toBe('0:00');
  });
});

describe('formatRelativeTime', () => {
  const reference = '2026-06-01T00:00:00.000Z';
  const ago = (seconds: number) => new Date(Date.parse(reference) - seconds * 1000).toISOString();

  it('matches the YouTube phrasing across units', () => {
    expect(formatRelativeTime(ago(3 * 3600), reference)).toBe('3 hours ago');
    expect(formatRelativeTime(ago(86_400), reference)).toBe('1 day ago');
    expect(formatRelativeTime(ago(14 * 86_400), reference)).toBe('2 weeks ago');
    expect(formatRelativeTime(ago(30 * 86_400), reference)).toBe('1 month ago');
    expect(formatRelativeTime(ago(2 * 31_536_000), reference)).toBe('2 years ago');
  });

  it('handles the unit boundaries', () => {
    expect(formatRelativeTime(ago(59 * 60), reference)).toBe('59 minutes ago');
    expect(formatRelativeTime(ago(23 * 3600), reference)).toBe('23 hours ago');
    expect(formatRelativeTime(ago(6 * 86_400), reference)).toBe('6 days ago');
    expect(formatRelativeTime(ago(28 * 86_400), reference)).toBe('4 weeks ago');
    expect(formatRelativeTime(ago(330 * 86_400), reference)).toBe('11 months ago');
  });

  it('returns "just now" under a minute and never goes negative', () => {
    expect(formatRelativeTime(ago(30), reference)).toBe('just now');
    expect(formatRelativeTime(ago(-100), reference)).toBe('just now');
  });
});
