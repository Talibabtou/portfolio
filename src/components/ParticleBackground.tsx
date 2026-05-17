'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const PARTICLE_COUNT = 100;

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!isMounted) return;

      particlesRef.current.forEach((particle) => {
        gsap.set(particle, {
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          opacity: Math.random(),
          left: Math.random() * window.innerWidth,
          top: Math.random() * (window.innerHeight + 1),
        });

        gsap.to(particle, {
          y: window.innerHeight,
          duration: Math.random() * 10 + 10,
          opacity: 0,
          repeat: -1,
          ease: 'none',
        });
      });
    },
    { dependencies: [isMounted], scope: containerRef },
  );

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" ref={containerRef}>
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) {
              particlesRef.current[index] = el;
            }
          }}
          className="absolute rounded-full bg-white"
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
