import { gsap, useGSAP } from '@/lib/gsap';
import type { RefObject } from 'react';

const useProjectDetailsAnimations = (
  containerRef: RefObject<HTMLDivElement | null>,
) => {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.set('.fade-in-later', {
        autoAlpha: 0,
        y: 30,
      });

      gsap.to('.fade-in-later', {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      if (window.innerWidth < 992) return;

      gsap.to('#info', {
        filter: 'blur(0.1875rem)',
        autoAlpha: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: '#info',
          start: 'bottom bottom',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          scrub: 0.5,
        },
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      gsap.utils
        .toArray<HTMLDivElement>('#images .project-media-frame')
        .forEach((imageDiv, i) => {
          gsap.to(imageDiv, {
            backgroundPosition: 'center 0%',
            ease: 'none',
            scrollTrigger: {
              trigger: imageDiv,
              start: () => (i ? 'top bottom' : 'top 50%'),
              end: 'bottom top',
              scrub: true,
            },
          });
        });
    },
    { scope: containerRef },
  );
};

export default useProjectDetailsAnimations;
