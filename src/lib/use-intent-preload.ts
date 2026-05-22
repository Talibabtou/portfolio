import { useCallback, useRef } from 'react';

export const useIntentPreload = (preload?: () => void) => {
  const hasPreloadedRef = useRef(false);

  return useCallback(() => {
    if (!preload) return;
    if (hasPreloadedRef.current) return;

    hasPreloadedRef.current = true;
    preload();
  }, [preload]);
};
