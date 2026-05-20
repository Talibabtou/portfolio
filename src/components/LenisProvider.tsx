'use client';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const LenisProvider = ({ children }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        duration: prefersReducedMotion ? 0 : 1.4,
        lerp: prefersReducedMotion ? 1 : 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
