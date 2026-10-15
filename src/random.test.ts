import { describe, expect, it } from 'vitest';
import { colorFromString, hashString, mulberry32, seededShuffle } from './random';

describe('mulberry32', () => {
  it('produces a deterministic sequence for a given seed', () => {
    const first = mulberry32(42);
    const second = mulberry32(42);
    const sequence = [first(), first(), first()];
    expect(sequence).toEqual([second(), second(), second()]);
  });

  it('returns values in the [0, 1) range', () => {
    const next = mulberry32(7);
    for (let index = 0; index < 100; index += 1) {
      const value = next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('produces different sequences for different seeds', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
});

describe('hashString', () => {
  it('is deterministic', () => {
    expect(hashString('medblocks')).toBe(hashString('medblocks'));
  });

  it('differs for different inputs', () => {
    expect(hashString('a')).not.toBe(hashString('b'));
  });
});

describe('seededShuffle', () => {
  it('is deterministic for a given seed', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(seededShuffle(items, 99)).toEqual(seededShuffle(items, 99));
  });

  it('keeps every element exactly once', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8];
    expect([...seededShuffle(items, 3)].sort((a, b) => a - b)).toEqual(items);
  });

  it('does not mutate the input', () => {
    const items = [1, 2, 3];
    seededShuffle(items, 1);
    expect(items).toEqual([1, 2, 3]);
  });
});

describe('colorFromString', () => {
  it('returns a palette colour deterministically', () => {
    const color = colorFromString('Night Lanes');
    expect(color).toBe(colorFromString('Night Lanes'));
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
  });
});
