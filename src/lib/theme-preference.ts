import {
  BROWSER_EVENTS,
  THEME_COOKIE_NAME,
  THEME_VALUES,
} from '@/lib/constants';
import type { ThemePreference, UserPreferences } from '@/types';
import { useSyncExternalStore } from 'react';

const DEFAULT_THEME_PREFERENCE: UserPreferences = {
  theme: THEME_VALUES.dark,
};

const LIGHT_THEME_PREFERENCE: UserPreferences = {
  theme: THEME_VALUES.light,
};

const readThemeCookie = () => {
  if (typeof window === 'undefined') return undefined;

  const cookieValue = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${THEME_COOKIE_NAME}=`))
    ?.split('=')[1];

  if (cookieValue === THEME_VALUES.light || cookieValue === THEME_VALUES.dark) {
    return cookieValue;
  }

  return undefined;
};

const getThemePreferenceSnapshot = (theme?: ThemePreference) => {
  return theme === THEME_VALUES.light
    ? LIGHT_THEME_PREFERENCE
    : DEFAULT_THEME_PREFERENCE;
};

const writeCookieFallback = (theme: ThemePreference) => {
  // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without the Cookie Store API.
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; samesite=lax`;
};

const writeThemeCookie = async (theme: ThemePreference) => {
  if ('cookieStore' in window) {
    await window.cookieStore.set({
      name: THEME_COOKIE_NAME,
      value: theme,
      path: '/',
      expires: Date.now() + 31_536_000_000,
      sameSite: 'lax',
    });
    return;
  }

  writeCookieFallback(theme);
};

const readThemePreference = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_THEME_PREFERENCE;

  const theme = readThemeCookie();

  return getThemePreferenceSnapshot(theme);
};

export const writeThemePreference = (preferences: Partial<UserPreferences>) => {
  if (typeof window === 'undefined') return;

  const nextPreferences = {
    ...readThemePreference(),
    ...preferences,
  };

  void writeThemeCookie(nextPreferences.theme).finally(() => {
    window.dispatchEvent(new Event(BROWSER_EVENTS.themePreferenceChange));
  });
};

const subscribeToThemePreference = (onStoreChange: () => void) => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onStoreChange();
    }
  };
  const handleWindowFocus = () => onStoreChange();

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleWindowFocus);
  window.addEventListener(BROWSER_EVENTS.themePreferenceChange, onStoreChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleWindowFocus);
    window.removeEventListener(
      BROWSER_EVENTS.themePreferenceChange,
      onStoreChange,
    );
  };
};

export const useThemePreference = (initialTheme?: ThemePreference) => {
  const serverSnapshot = getThemePreferenceSnapshot(initialTheme);

  return useSyncExternalStore(
    subscribeToThemePreference,
    readThemePreference,
    () => serverSnapshot,
  );
};
