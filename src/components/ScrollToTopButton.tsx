'use client';

import Button from '@/components/Button';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const BANNER_ID = 'banner';
const TOP_SCROLL_THRESHOLD = 8;

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const wasPastBannerRef = useRef(false);

  const updateVisibility = useCallback(() => {
    const banner = document.getElementById(BANNER_ID);
    if (!banner) {
      wasPastBannerRef.current = false;
      setIsVisible(false);
      return;
    }

    const scrollY = window.scrollY;

    if (scrollY <= TOP_SCROLL_THRESHOLD) {
      wasPastBannerRef.current = false;
      setIsVisible(false);
      return;
    }

    if (banner.getBoundingClientRect().bottom <= 0) {
      wasPastBannerRef.current = true;
    }

    setIsVisible(wasPastBannerRef.current);
  }, []);

  useEffect(() => {
    const onScroll = () => updateVisibility();
    const frame = requestAnimationFrame(onScroll);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [updateVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={cn(
        'fixed right-5 bottom-6 z-4 transition-opacity duration-300 md:right-8',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <Button
        as="button"
        icon
        variant="primary"
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className="size-11 min-w-11 rounded-full shadow-md"
      >
        <ChevronUp aria-hidden="true" className="size-5" strokeWidth={2.5} />
      </Button>
    </div>
  );
};

export default ScrollToTopButton;
