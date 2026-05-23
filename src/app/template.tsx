'use client';

import { gsap, useGSAP } from '@/lib/gsap';
import {
  PAGE_TRANSITION_CLASS,
  PAGE_TRANSITION_INNER_CLASS,
  PAGE_TRANSITION_INNER_SELECTOR,
  PAGE_TRANSITION_SELECTOR,
} from '@/lib/page-transition';
import { useEffect } from 'react';

const resetPageTransition = () => {
  gsap.killTweensOf(PAGE_TRANSITION_SELECTOR);
  gsap.killTweensOf(PAGE_TRANSITION_INNER_SELECTOR);
  gsap.set(PAGE_TRANSITION_SELECTOR, { yPercent: -100 });
  gsap.set(PAGE_TRANSITION_INNER_SELECTOR, { yPercent: 100 });
};

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resetPageTransition();
      }
    };

    const handlePopState = () => {
      requestAnimationFrame(resetPageTransition);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetPageTransition();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(PAGE_TRANSITION_INNER_SELECTOR, {
      yPercent: 0,
      duration: 0.2,
    })
      .to(PAGE_TRANSITION_INNER_SELECTOR, {
        yPercent: -100,
        duration: 0.2,
      })
      .to(PAGE_TRANSITION_SELECTOR, {
        yPercent: -100,
      });
  });

  return (
    <div>
      <div
        className={`${PAGE_TRANSITION_CLASS} fixed top-0 left-0 z-5 h-screen w-screen bg-background-light`}
      >
        <div
          className={`${PAGE_TRANSITION_INNER_CLASS} fixed top-0 left-0 z-5 h-screen w-screen translate-y-full bg-primary`}
        ></div>
      </div>

      {children}
    </div>
  );
}
