'use client';

import { useEffect, useState } from 'react';

type UseDebouncedActivationOptions = {
  delayMs: number;
  mountOnFirstActive?: boolean;
  preferIdleMount?: boolean;
};

type DebouncedActivationState = {
  hasMounted: boolean;
  isVisible: boolean;
};

export const useDebouncedActivation = (
  isActive: boolean,
  options: UseDebouncedActivationOptions,
): DebouncedActivationState => {
  const {
    delayMs,
    mountOnFirstActive = false,
    preferIdleMount = false,
  } = options;
  const [hasMounted, setHasMounted] = useState(mountOnFirstActive && isActive);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let idleCallbackId: number | undefined;

    const activationTimeout = window.setTimeout(() => {
      if (isActive) {
        if (preferIdleMount && 'requestIdleCallback' in window) {
          idleCallbackId = window.requestIdleCallback(
            () => {
              setHasMounted(true);
            },
            { timeout: 180 },
          );
        } else {
          setHasMounted(true);
        }
      }

      setIsVisible(isActive);
    }, delayMs);

    return () => {
      window.clearTimeout(activationTimeout);
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
  }, [delayMs, isActive, preferIdleMount]);

  return { hasMounted, isVisible };
};
