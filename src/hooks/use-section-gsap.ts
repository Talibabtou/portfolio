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

type SectionScrollRange = {
  end: string;
  scrub: number;
  start: string;
};

type RevealSectionAnimation = {
  exit?: SectionScrollRange & {
    y: number;
  };
  scope: RefObject<HTMLElement | null>;
  reveal?: SectionScrollRange & {
    ease?: string;
    selector: string;
    stagger?: number;
    y: number;
  };
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

export const useRevealSectionGsap = ({
  scope,
  reveal,
  exit,
}: RevealSectionAnimation) => {
  useSectionGsap({
    scope,
    setup: ({ root, select }) => {
      if (reveal) {
        const revealElements = select(reveal.selector);
        gsap
          .timeline({
            scrollTrigger: {
              end: reveal.end,
              scrub: reveal.scrub,
              start: reveal.start,
              trigger: root,
            },
          })
          .fromTo(
            revealElements,
            {
              autoAlpha: 0,
              y: reveal.y,
            },
            {
              autoAlpha: 1,
              ease: reveal.ease,
              stagger: reveal.stagger,
              y: 0,
            },
          );
      }

      if (exit) {
        gsap
          .timeline({
            scrollTrigger: {
              end: exit.end,
              scrub: exit.scrub,
              start: exit.start,
              trigger: root,
            },
          })
          .fromTo(
            root,
            {
              autoAlpha: 1,
              y: 0,
            },
            {
              autoAlpha: 0,
              immediateRender: false,
              y: exit.y,
            },
          );
      }
    },
  });
};

export { gsap };
