'use client';

import { gsap, useGSAP } from '@/lib/gsap';
import {
  PAGE_TRANSITION_CLASS,
  PAGE_TRANSITION_INNER_CLASS,
  PAGE_TRANSITION_INNER_SELECTOR,
  PAGE_TRANSITION_SELECTOR,
} from '@/lib/page-transition';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

export default function PageTransitionOverlay() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useGSAP(() => {
    if (!hasMounted.current) {
      gsap.set(PAGE_TRANSITION_SELECTOR, { autoAlpha: 0, yPercent: -100 });
      gsap.set(PAGE_TRANSITION_INNER_SELECTOR, { yPercent: 100 });
      hasMounted.current = true;
      return;
    }

    gsap.set(PAGE_TRANSITION_SELECTOR, { autoAlpha: 1, yPercent: 0 });
    gsap.set(PAGE_TRANSITION_INNER_SELECTOR, { yPercent: 0 });

    gsap
      .timeline()
      .to(PAGE_TRANSITION_INNER_SELECTOR, {
        yPercent: -100,
        duration: 0.22,
        ease: 'power2.inOut',
      })
      .to(
        PAGE_TRANSITION_SELECTOR,
        {
          yPercent: -100,
          duration: 0.22,
          ease: 'power2.inOut',
        },
        '-=0.08',
      )
      .set(PAGE_TRANSITION_SELECTOR, { autoAlpha: 0 });
  }, [pathname]);

  return (
    <div
      className={`${PAGE_TRANSITION_CLASS} pointer-events-none fixed inset-0 overflow-hidden bg-background-light`}
      style={{ visibility: 'hidden', zIndex: 60 }}
    >
      <div
        className={`${PAGE_TRANSITION_INNER_CLASS} absolute inset-0 bg-primary`}
      />
    </div>
  );
}
