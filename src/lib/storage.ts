import { STORAGE_KEYS } from '@/lib/constants';

const STORAGE_VERSION = 1;

export type StorageArea = 'local' | 'session';

type StorageState = {
  values: Record<string, unknown>;
  version: typeof STORAGE_VERSION;
};

const STORAGE_CHANGE_EVENTS = {
  local: 'portfolio:storage-local-change',
  session: 'portfolio:storage-session-change',
} as const;

const createEmptyStorageState = (): StorageState => ({
  values: {},
  version: STORAGE_VERSION,
});

const getStorage = (area: StorageArea) => {
  if (typeof window === 'undefined') return undefined;

  return area === 'local' ? window.localStorage : window.sessionStorage;
};

const getStorageKey = (area: StorageArea) =>
  area === 'local' ? STORAGE_KEYS.localState : STORAGE_KEYS.sessionState;

const getStorageChangeEvent = (area: StorageArea) =>
  area === 'local'
    ? STORAGE_CHANGE_EVENTS.local
    : STORAGE_CHANGE_EVENTS.session;

const readStorageState = (area: StorageArea): StorageState => {
  const storage = getStorage(area);
  if (!storage) return createEmptyStorageState();

  const storedState = storage.getItem(getStorageKey(area));
  if (!storedState) return createEmptyStorageState();

  try {
    const parsedState = JSON.parse(storedState) as Partial<StorageState>;

    if (
      parsedState.version !== STORAGE_VERSION ||
      typeof parsedState.values !== 'object' ||
      parsedState.values === null
    ) {
      return createEmptyStorageState();
    }

    return {
      values: parsedState.values,
      version: STORAGE_VERSION,
    };
  } catch {
    return createEmptyStorageState();
  }
};

const writeStorageState = (area: StorageArea, state: StorageState) => {
  const storage = getStorage(area);
  if (!storage) return;

  try {
    storage.setItem(getStorageKey(area), JSON.stringify(state));
    window.dispatchEvent(new Event(getStorageChangeEvent(area)));
  } catch {}
};

export const readStorageValue = <Value>(
  area: StorageArea,
  key: string,
): Value | undefined => {
  return readStorageState(area).values[key] as Value | undefined;
};

export const writeStorageValue = <Value>(
  area: StorageArea,
  key: string,
  value: Value,
) => {
  const currentState = readStorageState(area);

  writeStorageState(area, {
    ...currentState,
    values: {
      ...currentState.values,
      [key]: value,
    },
  });
};

export const removeStorageValue = (area: StorageArea, key: string) => {
  const currentState = readStorageState(area);

  if (!(key in currentState.values)) return;

  const nextValues = { ...currentState.values };
  delete nextValues[key];

  writeStorageState(area, {
    ...currentState,
    values: nextValues,
  });
};

export const clearStorageArea = (area: StorageArea) => {
  writeStorageState(area, createEmptyStorageState());
};

export const subscribeToStorage = (
  area: StorageArea,
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

export const createStorageNamespace = (area: StorageArea, prefix: string) => {
  const getScopedKey = (key: string) => `${prefix}.${key}`;

  return {
    clear: () => clearStorageArea(area),
    get: <Value>(key: string) =>
      readStorageValue<Value>(area, getScopedKey(key)),
    remove: (key: string) => removeStorageValue(area, getScopedKey(key)),
    set: <Value>(key: string, value: Value) =>
      writeStorageValue(area, getScopedKey(key), value),
    subscribe: (onStoreChange: () => void) =>
      subscribeToStorage(area, onStoreChange),
  };
};
