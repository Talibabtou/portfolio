export const THEME_VALUES = {
  dark: 'dark',
  light: 'light',
} as const;

export const THEME_CLASS = THEME_VALUES.dark;

export const STORAGE_KEYS = {
  localState: 'portfolio:local-state',
  sessionState: 'portfolio:session-state',
} as const;

export const THEME_COOKIE_NAME = 'portfolio-theme';

export const BROWSER_EVENTS = {
  themePreferenceChange: 'portfolio:theme-preference-change',
} as const;
