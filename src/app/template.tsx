'use client';

import { gsap, useGSAP } from '@/lib/gsap';
import {
  PAGE_TRANSITION_CLASS,
  PAGE_TRANSITION_INNER_CLASS,
  PAGE_TRANSITION_INNER_SELECTOR,
  PAGE_TRANSITION_SELECTOR,
} from '@/lib/page-transition';

export default function Template({ children }: { children: React.ReactNode }) {
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
