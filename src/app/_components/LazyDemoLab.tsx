'use client';

import SectionTitle from '@/components/SectionTitle';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const DemoLab = dynamic(() => import('@/app/_components/DemoLab'), {
  loading: () => null,
  ssr: false,
});

const LazyDemoLab = () => {
  const placeholderRef = useRef<HTMLElement>(null);
  const [shouldMountDemoLab, setShouldMountDemoLab] = useState(false);

  useEffect(() => {
    if (shouldMountDemoLab) return;

    if (window.location.hash === '#demo-lab') {
      const frame = requestAnimationFrame(() => {
        setShouldMountDemoLab(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    const placeholder = placeholderRef.current;
    if (!placeholder) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldMountDemoLab(true);
        observer.disconnect();
      },
      { rootMargin: '640px 0px' },
    );

    observer.observe(placeholder);

    return () => observer.disconnect();
  }, [shouldMountDemoLab]);

  if (shouldMountDemoLab) {
    return <DemoLab />;
  }

  return (
    <section
      className="relative overflow-hidden pt-section pb-6 lg:min-h-svh"
      id="demo-lab"
      ref={placeholderRef}
    >
      <div className="relative z-1 w-full px-4 sm:px-6 lg:px-15">
        <SectionTitle title="Demos" />
      </div>
    </section>
  );
};

export default LazyDemoLab;
