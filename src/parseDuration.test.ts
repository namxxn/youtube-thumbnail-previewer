import { describe, expect, it } from 'vitest';
import { parseIsoDuration } from './parseDuration';

describe('parseIsoDuration', () => {
  it('parses hours, minutes and seconds', () => {
    expect(parseIsoDuration('PT1H2M3S')).toBe(3723);
  });

  it('parses seconds-only and minutes-only durations', () => {
    expect(parseIsoDuration('PT45S')).toBe(45);
    expect(parseIsoDuration('PT10M')).toBe(600);
  });

  it('parses hour-only durations', () => {
    expect(parseIsoDuration('PT2H')).toBe(7200);
  });

  it('parses multi-day durations', () => {
    expect(parseIsoDuration('P1DT1H')).toBe(90000);
  });

  it('returns zero for malformed input', () => {
    expect(parseIsoDuration('')).toBe(0);
    expect(parseIsoDuration('nonsense')).toBe(0);
  });
});
