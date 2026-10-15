import type { CSSProperties } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeTokens {
  bg: string;
  text: string;
  secondary: string;
  chip: string;
}

export const THEMES: Record<Theme, ThemeTokens> = {
  dark: { bg: '#0f0f0f', text: '#f1f1f1', secondary: '#aaaaaa', chip: 'rgba(255,255,255,0.1)' },
  light: { bg: '#ffffff', text: '#0f0f0f', secondary: '#606060', chip: '#f2f2f2' },
};

// Expose the palette as CSS vars so cards can read it without prop drilling.
export function themeStyle(theme: Theme): CSSProperties {
  const tokens = THEMES[theme];
  const vars: Record<string, string> = {
    '--yt-bg': tokens.bg,
    '--yt-text': tokens.text,
    '--yt-secondary': tokens.secondary,
    '--yt-chip': tokens.chip,
  };
  return vars as CSSProperties;
}
