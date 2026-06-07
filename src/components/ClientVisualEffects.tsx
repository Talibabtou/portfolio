'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  ssr: false,
});
const Preloader = dynamic(() => import('@/components/Preloader'), {
  ssr: false,
});
const ScrollProgressIndicator = dynamic(
  () => import('@/components/ScrollProgressIndicator'),
  {
    ssr: false,
  },
);
const TopographicBackground = dynamic(
  () => import('@/components/TopographicBackground'),
  {
    ssr: false,
  },
);

const prefersDesktopViewport = () =>
  window.matchMedia('(min-width: 768px)').matches;

const ClientVisualEffects = () => {
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false);
  const [shouldRenderDesktopEffects, setShouldRenderDesktopEffects] =
    useState(false);

  useEffect(() => {
    const renderEffects = () => {
      setShouldRenderEffects(true);
      setShouldRenderDesktopEffects(prefersDesktopViewport());
    };

    const frame = requestAnimationFrame(renderEffects);

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!shouldRenderEffects) return null;

  return (
    <>
      {shouldRenderDesktopEffects ? (
        <>
          <CustomCursor />
          <Preloader />
          <ScrollProgressIndicator />
        </>
      ) : null}
      <TopographicBackground />
    </>
  );
};

export default ClientVisualEffects;
