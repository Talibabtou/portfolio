'use client';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

const PRELOADER_PANELS = [
  'panel-01',
  'panel-02',
  'panel-03',
  'panel-04',
  'panel-05',
  'panel-06',
  'panel-07',
  'panel-08',
  'panel-09',
  'panel-10',
];

const Preloader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const preloaderText = 'TALIBABTOU';
  const preloaderLetters = Array.from(preloaderText, (letter, index) => ({
    id: `${letter}-${preloaderText.slice(0, index + 1)}`,
    letter,
  }));

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        defaults: {
          ease: 'power1.inOut',
        },
      });

      tl.to('.name-text span', {
        y: 0,
        stagger: 0.05,
        duration: 0.15,
      });

      tl.to('.preloader-item', {
        delay: 0.3,
        y: '100%',
        duration: 0.4,
        stagger: 0.07,
      })
        .to('.name-text span', { autoAlpha: 0 }, '<0.5')
        .to(
          preloaderRef.current,
          {
            autoAlpha: 0,
          },
          '<1',
        );
    },
    { dependencies: [prefersReducedMotion], scope: preloaderRef },
  );

  if (prefersReducedMotion) return null;

  return (
    <div className="preloader fixed inset-0 z-6 flex" ref={preloaderRef}>
      {PRELOADER_PANELS.map((panel) => (
        <div
          className="preloader-item h-full flex-1 bg-[hsl(var(--preloader-background))]"
          key={panel}
        ></div>
      ))}

      <p className="name-text absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 overflow-hidden text-center font-anton text-[20vw] text-[hsl(var(--preloader-foreground))] leading-none lg:text-[200px]">
        {preloaderLetters.map(({ id, letter }) => (
          <span className="inline-block translate-y-full" key={id}>
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Preloader;
