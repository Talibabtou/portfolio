'use client';
import { clamp01 } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

const getScrollableHeight = () => {
  const { scrollHeight, clientHeight } = document.documentElement;
  return Math.max(0, scrollHeight - clientHeight);
};

const scrollToProgress = (progress: number) => {
  window.scrollTo({
    behavior: 'smooth',
    top: getScrollableHeight() * clamp01(progress),
  });
};

const ScrollProgressIndicator = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) return;

    const trackRect = event.currentTarget.getBoundingClientRect();
    const clickProgress = (event.clientY - trackRect.top) / trackRect.height;

    scrollToProgress(clickProgress);
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
      className="scroll-progress-indicator group fixed top-[50svh] right-[calc(2%-0.375rem)] z-5 h-25 w-5 -translate-y-1/2 cursor-none rounded-full bg-transparent focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title="Scroll to page position"
      type="button"
    >
      <span className="absolute top-0 left-1/2 h-full w-1.5 -translate-x-1/2 overflow-hidden rounded-full bg-background-light transition-colors group-hover:bg-foreground/15">
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
