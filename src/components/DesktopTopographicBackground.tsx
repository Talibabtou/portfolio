'use client';

import { gsap, useGSAP } from '@/lib/gsap';
import {
  getTopographySnapshot,
  preloadTopography,
  randomBetween,
  TOPOGRAPHIC_GRID_COLUMNS,
  TOPOGRAPHIC_GRID_PADDING,
  TOPOGRAPHIC_GRID_ROWS,
  TOPOGRAPHIC_MOTION,
  type Topography,
} from '@/lib/topography';
import { useEffect, useRef, useState } from 'react';

const DesktopTopographicBackground = () => {
  const pathsRef = useRef<SVGPathElement[]>([]);
  const [topography, setTopography] = useState<Topography | null>(() =>
    getTopographySnapshot(),
  );

  useEffect(() => {
    if (topography) return;

    let ignoreResult = false;

    void preloadTopography().then((nextTopography) => {
      if (!ignoreResult) {
        setTopography(nextTopography);
      }
    });

    return () => {
      ignoreResult = true;
    };
  }, [topography]);

  useGSAP(
    () => {
      if (!topography) return;

      pathsRef.current.forEach((path, index) => {
        gsap.to(path, {
          delay: index * TOPOGRAPHIC_MOTION.delayPerLine,
          duration: randomBetween(...TOPOGRAPHIC_MOTION.durationRange),
          ease: 'sine.inOut',
          repeat: -1,
          scale: TOPOGRAPHIC_MOTION.scale,
          svgOrigin: `${TOPOGRAPHIC_GRID_PADDING + TOPOGRAPHIC_GRID_COLUMNS / 2} ${TOPOGRAPHIC_GRID_PADDING + TOPOGRAPHIC_GRID_ROWS / 2}`,
          yoyo: true,
        });
      });
    },
    { dependencies: [topography] },
  );

  if (!topography) return null;

  return (
    <svg
      aria-hidden="true"
      className="absolute origin-center overflow-visible text-foreground"
      height={topography.height}
      style={{
        left: topography.originX,
        top: topography.originY,
      }}
      viewBox={`${TOPOGRAPHIC_GRID_PADDING} ${TOPOGRAPHIC_GRID_PADDING} ${TOPOGRAPHIC_GRID_COLUMNS} ${TOPOGRAPHIC_GRID_ROWS}`}
      width={topography.width}
    >
      {topography.lines.map((line, index) => (
        <path
          d={line.d}
          fill="none"
          key={line.d}
          ref={(el) => {
            if (el) {
              pathsRef.current[index] = el;
            }
          }}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={line.strokeWidth}
          style={{
            opacity: `calc(${line.opacity} * var(--topographic-opacity-scale))`,
          }}
        />
      ))}
    </svg>
  );
};

export default DesktopTopographicBackground;
