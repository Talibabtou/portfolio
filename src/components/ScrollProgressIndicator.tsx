'use client';
import { useEffect, useRef } from 'react';

const ScrollProgressIndicator = () => {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollBarRef.current) {
        const { scrollHeight, clientHeight } = document.documentElement;
        const scrollableHeight = scrollHeight - clientHeight;
        const scrollY = window.scrollY;
        const rawProgress =
          scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
        const scrollProgress = Math.min(Math.max(rawProgress, 0), 1);

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
    <div className="fixed top-[50svh] right-[2%] z-0 h-25 w-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-background-light">
      <div
        className="h-full w-full origin-bottom rounded-full bg-primary"
        ref={scrollBarRef}
        style={{ transform: 'scaleY(0)' }}
      ></div>
    </div>
  );
};

export default ScrollProgressIndicator;
