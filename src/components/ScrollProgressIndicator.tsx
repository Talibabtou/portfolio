'use client';
import { clamp01 } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

const getScrollableHeight = () => {
  const { scrollHeight, clientHeight } = document.documentElement;
  return Math.max(0, scrollHeight - clientHeight);
};

const scrollToProgress = (
  progress: number,
  behavior: ScrollBehavior = 'smooth',
) => {
  window.scrollTo({
    behavior,
    top: getScrollableHeight() * clamp01(progress),
  });
};

const ScrollProgressIndicator = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLSpanElement>(null);
  const isDraggingRef = useRef(false);

  const getProgressFromPointer = (clientY: number) => {
    const trackRect = scrollTrackRef.current?.getBoundingClientRect();
    if (!trackRect) return 0;

    return (clientY - trackRect.top) / trackRect.height;
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scrollToProgress(getProgressFromPointer(event.clientY), 'auto');
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;

    event.preventDefault();
    scrollToProgress(getProgressFromPointer(event.clientY), 'auto');
  };

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    isDraggingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const scrollableHeight = getScrollableHeight();
    if (scrollableHeight === 0) return;

    const currentProgress = window.scrollY / scrollableHeight;
    const progressStep = event.shiftKey ? 0.2 : 0.08;
    let nextProgress: number | null = null;

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      nextProgress = currentProgress + progressStep;
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      nextProgress = currentProgress - progressStep;
    }

    if (event.key === 'Home') {
      nextProgress = 0;
    }

    if (event.key === 'End') {
      nextProgress = 1;
    }

    if (nextProgress === null) return;

    event.preventDefault();
    scrollToProgress(nextProgress);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollBarRef.current) {
        const scrollableHeight = getScrollableHeight();
        const scrollY = window.scrollY;
        const rawProgress =
          scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
        const scrollProgress = clamp01(rawProgress);

        scrollBarRef.current.style.transform = `scaleY(${scrollProgress})`;
      }
    };

    handleScroll();

    window.addEventListener('pageshow', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('pageshow', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      aria-label="Scroll to page position"
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      title="Scroll to page position"
      type="button"
      className="scroll-progress-indicator group fixed top-[50svh] right-[calc(2%-0.375rem)] z-2 hidden h-29 w-5 -translate-y-1/2 cursor-none touch-none rounded-full bg-transparent focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 sm:block"
    >
      <span
        className="absolute top-1/2 left-1/2 h-25 w-1.5 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-background-light transition-colors group-hover:bg-foreground/15"
        ref={scrollTrackRef}
      >
        <span
          className="block h-full w-full origin-top rounded-full bg-primary"
          ref={scrollBarRef}
          style={{ transform: 'scaleY(0)' }}
        />
      </span>
    </button>
  );
};

export default ScrollProgressIndicator;
