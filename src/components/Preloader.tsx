'use client';
import { gsap, useGSAP } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { useRef, useSyncExternalStore } from 'react';

const PRELOADER_SESSION_KEY = 'portfolio:preloader-seen';
const PRELOADER_SESSION_EVENT = 'portfolio:preloader-seen-change';

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

const readHasSeenPreloader = () => {
  if (typeof window === 'undefined') return false;

  return window.sessionStorage.getItem(PRELOADER_SESSION_KEY) === 'true';
};

const subscribeToPreloaderSession = (onStoreChange: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === PRELOADER_SESSION_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(PRELOADER_SESSION_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(PRELOADER_SESSION_EVENT, onStoreChange);
  };
};

const markPreloaderAsSeen = () => {
  window.sessionStorage.setItem(PRELOADER_SESSION_KEY, 'true');
  window.dispatchEvent(new Event(PRELOADER_SESSION_EVENT));
};

const Preloader = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasSeenPreloader = useSyncExternalStore(
    subscribeToPreloaderSession,
    readHasSeenPreloader,
    () => false,
  );
  const preloaderText = 'TALIBABTOU';
  const preloaderLetters = Array.from(preloaderText, (letter, index) => ({
    id: `${letter}-${preloaderText.slice(0, index + 1)}`,
    letter,
  }));

  useGSAP(
    () => {
      if (hasSeenPreloader) return;
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
            onComplete: () => {
              markPreloaderAsSeen();
            },
          },
          '<1',
        );
    },
    {
      dependencies: [hasSeenPreloader, prefersReducedMotion],
      scope: preloaderRef,
    },
  );

  if (hasSeenPreloader) return null;
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
