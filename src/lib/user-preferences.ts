import { useSyncExternalStore } from 'react';

const USER_PREFERENCES_STORAGE_KEY = 'portfolio:user-preferences';
const USER_PREFERENCES_CHANGE_EVENT = 'portfolio:user-preferences-change';

export type ThemePreference = 'dark' | 'light';

export type UserPreferences = {
  theme: ThemePreference;
};

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'dark',
};

let cachedPreferencesKey: string | null = null;
let cachedPreferences = DEFAULT_USER_PREFERENCES;

const isUserPreference = (
  preferences: Partial<UserPreferences>,
): preferences is UserPreferences => {
  return preferences.theme === 'dark' || preferences.theme === 'light';
};

export const readUserPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;

  const storedPreferences = window.localStorage.getItem(
    USER_PREFERENCES_STORAGE_KEY,
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
    USER_PREFERENCES_STORAGE_KEY,
    JSON.stringify(nextPreferences),
  );

  cachedPreferencesKey = window.localStorage.getItem(
    USER_PREFERENCES_STORAGE_KEY,
  );
  cachedPreferences = nextPreferences;

  window.dispatchEvent(new Event(USER_PREFERENCES_CHANGE_EVENT));
};

const subscribeToUserPreferences = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === USER_PREFERENCES_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(USER_PREFERENCES_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(USER_PREFERENCES_CHANGE_EVENT, onStoreChange);
  };
};

export const useUserPreferences = () => {
  return useSyncExternalStore(
    subscribeToUserPreferences,
    readUserPreferences,
    () => DEFAULT_USER_PREFERENCES,
  );
};
