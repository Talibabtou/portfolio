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
  localStateChange: 'portfolio:local-state-change',
  sessionStateChange: 'portfolio:session-state-change',
  userPreferencesChange: 'portfolio:user-preferences-change',
} as const;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
