'use client';
import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const getReducedMotionPreference = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

const subscribeToReducedMotionPreference = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

  mediaQuery.addEventListener('change', onStoreChange);

  return () => {
    mediaQuery.removeEventListener('change', onStoreChange);
  };
};

export const usePrefersReducedMotion = () => {
  return useSyncExternalStore(
    subscribeToReducedMotionPreference,
    getReducedMotionPreference,
    () => false,
  );
};
