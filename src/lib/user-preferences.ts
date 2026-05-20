import { BROWSER_EVENTS, STORAGE_KEYS, THEME_VALUES } from '@/lib/constants';
import type { UserPreferences } from '@/types';
import { useSyncExternalStore } from 'react';

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: THEME_VALUES.dark,
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

export const readUserPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;

  const storedPreferences = window.localStorage.getItem(
    STORAGE_KEYS.userPreferences,
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

  window.localStorage.setItem(
    STORAGE_KEYS.userPreferences,
    JSON.stringify(nextPreferences),
  );

  cachedPreferencesKey = window.localStorage.getItem(
    STORAGE_KEYS.userPreferences,
  );
  cachedPreferences = nextPreferences;

  window.dispatchEvent(new Event(BROWSER_EVENTS.userPreferencesChange));
};

const subscribeToUserPreferences = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEYS.userPreferences) {
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
