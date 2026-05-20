'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import type { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
