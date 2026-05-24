import {
  BROWSER_EVENTS,
  STORAGE_KEYS,
  THEME_COOKIE_NAME,
  THEME_VALUES,
} from '@/lib/constants';
import type { ThemePreference, UserPreferences } from '@/types';
import { useSyncExternalStore } from 'react';

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: THEME_VALUES.dark,
};
const LIGHT_USER_PREFERENCES: UserPreferences = {
  theme: THEME_VALUES.light,
};
const PORTFOLIO_STORAGE_VERSION = 1;

type PortfolioStorageArea = 'local' | 'session';
type PortfolioStorageState = {
  values: Record<string, unknown>;
  version: typeof PORTFOLIO_STORAGE_VERSION;
};

let cachedPreferencesKey: string | null = null;
let cachedPreferences = DEFAULT_USER_PREFERENCES;

const isUserPreference = (
  preferences: Partial<UserPreferences>,
): preferences is UserPreferences => {
  return (
    preferences.theme === THEME_VALUES.dark ||
    preferences.theme === THEME_VALUES.light
  );
};

const getStorage = (area: PortfolioStorageArea) => {
  if (typeof window === 'undefined') return undefined;

  return area === 'local' ? window.localStorage : window.sessionStorage;
};

const getStorageKey = (area: PortfolioStorageArea) =>
  area === 'local' ? STORAGE_KEYS.localState : STORAGE_KEYS.sessionState;

const getStorageChangeEvent = (area: PortfolioStorageArea) =>
  area === 'local'
    ? BROWSER_EVENTS.localStateChange
    : BROWSER_EVENTS.sessionStateChange;

const createEmptyPortfolioStorageState = (): PortfolioStorageState => ({
  values: {},
  version: PORTFOLIO_STORAGE_VERSION,
});

export const readPortfolioStorageState = (
  area: PortfolioStorageArea,
): PortfolioStorageState => {
  const storage = getStorage(area);
  if (!storage) return createEmptyPortfolioStorageState();

  const storedState = storage.getItem(getStorageKey(area));
  if (!storedState) return createEmptyPortfolioStorageState();

  try {
    const parsedState = JSON.parse(
      storedState,
    ) as Partial<PortfolioStorageState>;

    if (
      parsedState.version !== PORTFOLIO_STORAGE_VERSION ||
      typeof parsedState.values !== 'object' ||
      parsedState.values === null
    ) {
      return createEmptyPortfolioStorageState();
    }

    return {
      values: parsedState.values,
      version: PORTFOLIO_STORAGE_VERSION,
    };
  } catch {
    return createEmptyPortfolioStorageState();
  }
};

export const readPortfolioStorageValue = <Value>(
  area: PortfolioStorageArea,
  key: string,
): Value | undefined => {
  return readPortfolioStorageState(area).values[key] as Value | undefined;
};

export const writePortfolioStorageValue = <Value>(
  area: PortfolioStorageArea,
  key: string,
  value: Value,
) => {
  const storage = getStorage(area);
  if (!storage) return;

  const currentState = readPortfolioStorageState(area);
  const nextState = {
    ...currentState,
    values: {
      ...currentState.values,
      [key]: value,
    },
  } satisfies PortfolioStorageState;

  storage.setItem(getStorageKey(area), JSON.stringify(nextState));
  window.dispatchEvent(new Event(getStorageChangeEvent(area)));
};

export const subscribeToPortfolioStorage = (
  area: PortfolioStorageArea,
  onStoreChange: () => void,
) => {
  const storageKey = getStorageKey(area);
  const storageChangeEvent = getStorageChangeEvent(area);
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === storageKey) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(storageChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(storageChangeEvent, onStoreChange);
  };
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

export const readUserPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;

  const theme = readThemeCookie();
  const storedPreferences = theme ? JSON.stringify({ theme }) : null;

  if (storedPreferences === cachedPreferencesKey) {
    return cachedPreferences;
  }

  if (!storedPreferences) {
    cachedPreferencesKey = storedPreferences;
    cachedPreferences = DEFAULT_USER_PREFERENCES;

    return cachedPreferences;
  }

  try {
    const parsedPreferences = JSON.parse(
      storedPreferences,
    ) as Partial<UserPreferences>;

    if (!isUserPreference(parsedPreferences)) {
      cachedPreferencesKey = storedPreferences;
      cachedPreferences = DEFAULT_USER_PREFERENCES;

      return cachedPreferences;
    }

    cachedPreferencesKey = storedPreferences;
    cachedPreferences = parsedPreferences;

    return cachedPreferences;
  } catch {
    cachedPreferencesKey = storedPreferences;
    cachedPreferences = DEFAULT_USER_PREFERENCES;

    return cachedPreferences;
  }
};

export const writeUserPreferences = (preferences: Partial<UserPreferences>) => {
  if (typeof window === 'undefined') return;

  const nextPreferences = {
    ...readUserPreferences(),
    ...preferences,
  };

  cachedPreferencesKey = JSON.stringify(nextPreferences);
  cachedPreferences = nextPreferences;

  // biome-ignore lint/suspicious/noDocumentCookie: Theme cookie is the server-readable source of truth for first paint.
  document.cookie = `${THEME_COOKIE_NAME}=${nextPreferences.theme}; path=/; max-age=31536000; samesite=lax`;

  window.dispatchEvent(new Event(BROWSER_EVENTS.userPreferencesChange));
};

const subscribeToUserPreferences = (onStoreChange: () => void) => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onStoreChange();
    }
  };
  const handleWindowFocus = () => onStoreChange();

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleWindowFocus);
  window.addEventListener(BROWSER_EVENTS.userPreferencesChange, onStoreChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('focus', handleWindowFocus);
    window.removeEventListener(
      BROWSER_EVENTS.userPreferencesChange,
      onStoreChange,
    );
  };
};

export const useUserPreferences = (initialTheme?: ThemePreference) => {
  const serverSnapshot =
    initialTheme === THEME_VALUES.light
      ? LIGHT_USER_PREFERENCES
      : DEFAULT_USER_PREFERENCES;

  return useSyncExternalStore(
    subscribeToUserPreferences,
    readUserPreferences,
    () => serverSnapshot,
  );
};
