import { BROWSER_EVENTS, STORAGE_KEYS, THEME_VALUES } from '@/lib/constants';
import type { UserPreferences } from '@/types';
import { useSyncExternalStore } from 'react';

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: THEME_VALUES.dark,
};
const PORTFOLIO_STORAGE_VERSION = 1;
const USER_PREFERENCES_STORAGE_KEY = 'userPreferences';
const PRELOADER_SEEN_STORAGE_KEY = 'preloaderSeen';

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

const readLegacyUserPreferences = () => {
  if (typeof window === 'undefined') return undefined;

  const storedPreferences = window.localStorage.getItem(
    STORAGE_KEYS.legacyUserPreferences,
  );
  if (!storedPreferences) return undefined;

  try {
    return JSON.parse(storedPreferences) as Partial<UserPreferences>;
  } catch {
    return undefined;
  }
};

const readLegacyPreloaderSeen = () => {
  if (typeof window === 'undefined') return undefined;

  const storedValue = window.sessionStorage.getItem(
    STORAGE_KEYS.legacyPreloaderSeen,
  );

  return storedValue ? storedValue === 'true' : undefined;
};

export const readPreloaderSeen = () =>
  readPortfolioStorageValue<boolean>('session', PRELOADER_SEEN_STORAGE_KEY) ??
  readLegacyPreloaderSeen() ??
  false;

export const writePreloaderSeen = () => {
  writePortfolioStorageValue('session', PRELOADER_SEEN_STORAGE_KEY, true);
};

export const readUserPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;

  const storedPreferences = JSON.stringify(
    readPortfolioStorageValue<Partial<UserPreferences>>(
      'local',
      USER_PREFERENCES_STORAGE_KEY,
    ) ?? readLegacyUserPreferences(),
  );

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

  writePortfolioStorageValue(
    'local',
    USER_PREFERENCES_STORAGE_KEY,
    nextPreferences,
  );

  cachedPreferencesKey = JSON.stringify(nextPreferences);
  cachedPreferences = nextPreferences;

  window.dispatchEvent(new Event(BROWSER_EVENTS.userPreferencesChange));
};

const subscribeToUserPreferences = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === STORAGE_KEYS.localState ||
      event.key === STORAGE_KEYS.legacyUserPreferences
    ) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(BROWSER_EVENTS.userPreferencesChange, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(
      BROWSER_EVENTS.userPreferencesChange,
      onStoreChange,
    );
  };
};

export const useUserPreferences = () => {
  return useSyncExternalStore(
    subscribeToUserPreferences,
    readUserPreferences,
    () => DEFAULT_USER_PREFERENCES,
  );
};
