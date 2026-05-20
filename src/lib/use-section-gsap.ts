'use client';
import { gsap, useGSAP } from '@/lib/gsap';
import type { RefObject } from 'react';

type ScopedSectionAnimation = {
  scope: RefObject<HTMLElement | null>;
  setup: (context: {
    root: HTMLElement;
    select: ReturnType<typeof gsap.utils.selector>;
  }) => void;
};

export const useSectionGsap = ({ scope, setup }: ScopedSectionAnimation) => {
  useGSAP(
    () => {
      if (!scope.current) return;

      setup({
        root: scope.current,
        select: gsap.utils.selector(scope),
      });
    },
    { scope },
  );
};

export { gsap };
