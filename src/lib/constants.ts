export const THEME_VALUES = {
  dark: 'dark',
  light: 'light',
} as const;

export const THEME_CLASS = THEME_VALUES.dark;

export const STORAGE_KEYS = {
  preloaderSeen: 'portfolio:preloader-seen',
  userPreferences: 'portfolio:user-preferences',
} as const;

export const BROWSER_EVENTS = {
  preloaderSeenChange: 'portfolio:preloader-seen-change',
  userPreferencesChange: 'portfolio:user-preferences-change',
} as const;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
