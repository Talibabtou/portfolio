'use client';
import { useGSAP } from '@gsap/react';
import { contours } from 'd3-contour';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';

gsap.registerPlugin(useGSAP);

const TOPOGRAPHIC_STYLE = {
  // Higher resolution gives contours more source points, so paths feel smoother.
  detail: {
    columns: 300,
    rows: 300,
  },
  // Human-facing line controls.
  lines: {
    count: 40,
    opacityRange: [0.01, 0.2],
    minStrokeWidth: 0.03,
    baseStrokeWidth: 0.0035,
    strokeVariation: 0.15,
  },
  // Space between contour lines. Higher variation creates denser/calmer areas.
  spacing: {
    start: 0.16,
    span: 0.68,
    baseWeight: 0.55,
    waveFrequency: 3.2,
    waveRandomPhase: 1.8,
    waveWeight: 0.28,
    randomWeight: 0.32,
  },
  // Organic shape controls. Peak values create the multi-mountain effect.
  shape: {
    centerXRange: [0.28, 0.72],
    centerYRange: [0.26, 0.74],
    stretchXRange: [0.62, 1.42],
    stretchYRange: [0.62, 1.42],
    mainPeakFalloff: 50,
    secondaryPeakCountRange: [2, 4],
    secondaryPeakOffsetRange: [0.08, 0.32],
    secondaryPeakFalloffRange: [26, 72],
    secondaryPeakStrengthRange: [0.16, 0.42],
    secondaryPeakStretchRange: [0.72, 1.55],
    complexity: 0.24,
    fineComplexity: 0.1,
  },
  // Breathing animation. Keep scale close to 1 for subtle movement.
  motion: {
    scale: 1.01,
    durationRange: [4.8, 7.2],
    delayPerLine: 0.05,
  },
  // Oversized SVG avoids visible square generation limits.
  canvas: {
    widthVwRange: [3.1, 3.7],
    heightVhRange: [2.9, 3.45],
    safeViewportPadding: 0.45,
    fieldPaddingRatio: 0.35,
  },
} as const;

const GRID_COLUMNS = TOPOGRAPHIC_STYLE.detail.columns;
const GRID_ROWS = TOPOGRAPHIC_STYLE.detail.rows;
const GRID_PADDING = Math.round(
  Math.max(GRID_COLUMNS, GRID_ROWS) *
    TOPOGRAPHIC_STYLE.canvas.fieldPaddingRatio,
);
const FIELD_COLUMNS = GRID_COLUMNS + GRID_PADDING * 2;
const FIELD_ROWS = GRID_ROWS + GRID_PADDING * 2;
const CONTOUR_LINE_COUNT = TOPOGRAPHIC_STYLE.lines.count;
const CANVAS_WIDTH_VW_RANGE = TOPOGRAPHIC_STYLE.canvas.widthVwRange;
const CANVAS_HEIGHT_VH_RANGE = TOPOGRAPHIC_STYLE.canvas.heightVhRange;
const SAFE_VIEWPORT_PADDING = TOPOGRAPHIC_STYLE.canvas.safeViewportPadding;
const THRESHOLD_START = TOPOGRAPHIC_STYLE.spacing.start;
const THRESHOLD_SPAN = TOPOGRAPHIC_STYLE.spacing.span;
const THRESHOLD_BASE_WEIGHT = TOPOGRAPHIC_STYLE.spacing.baseWeight;
const THRESHOLD_WAVE_FREQUENCY = TOPOGRAPHIC_STYLE.spacing.waveFrequency;
const THRESHOLD_WAVE_RANDOM_PHASE = TOPOGRAPHIC_STYLE.spacing.waveRandomPhase;
const THRESHOLD_WAVE_WEIGHT = TOPOGRAPHIC_STYLE.spacing.waveWeight;
const THRESHOLD_RANDOM_WEIGHT = TOPOGRAPHIC_STYLE.spacing.randomWeight;
const CENTER_X_RANGE = TOPOGRAPHIC_STYLE.shape.centerXRange;
const CENTER_Y_RANGE = TOPOGRAPHIC_STYLE.shape.centerYRange;
const STRETCH_X_RANGE = TOPOGRAPHIC_STYLE.shape.stretchXRange;
const STRETCH_Y_RANGE = TOPOGRAPHIC_STYLE.shape.stretchYRange;
const MOUNTAIN_FALLOFF = TOPOGRAPHIC_STYLE.shape.mainPeakFalloff;
const SECONDARY_PEAK_COUNT_RANGE =
  TOPOGRAPHIC_STYLE.shape.secondaryPeakCountRange;
const SECONDARY_PEAK_OFFSET_RANGE =
  TOPOGRAPHIC_STYLE.shape.secondaryPeakOffsetRange;
const SECONDARY_PEAK_FALLOFF_RANGE =
  TOPOGRAPHIC_STYLE.shape.secondaryPeakFalloffRange;
const SECONDARY_PEAK_STRENGTH_RANGE =
  TOPOGRAPHIC_STYLE.shape.secondaryPeakStrengthRange;
const SECONDARY_PEAK_STRETCH_RANGE =
  TOPOGRAPHIC_STYLE.shape.secondaryPeakStretchRange;
const LINE_OPACITY_RANGE = TOPOGRAPHIC_STYLE.lines.opacityRange;
const LINE_MIN_STROKE_WIDTH = TOPOGRAPHIC_STYLE.lines.minStrokeWidth;
const LINE_BASE_STROKE_WIDTH = TOPOGRAPHIC_STYLE.lines.baseStrokeWidth;
const LINE_STROKE_VARIATION = TOPOGRAPHIC_STYLE.lines.strokeVariation;
const BREATH_SCALE = TOPOGRAPHIC_STYLE.motion.scale;
const BREATH_DURATION_RANGE = TOPOGRAPHIC_STYLE.motion.durationRange;
const BREATH_DELAY_PER_LINE = TOPOGRAPHIC_STYLE.motion.delayPerLine;

const WIDE_PULL_FALLOFF = 0.95;
const WIDE_PULL_STRENGTH = 0.1;
const LARGE_NOISE_SCALE = 2.75;
const LARGE_NOISE_STRENGTH = TOPOGRAPHIC_STYLE.shape.complexity;
const MEDIUM_NOISE_SCALE = 5.8;
const MEDIUM_NOISE_STRENGTH = TOPOGRAPHIC_STYLE.shape.fineComplexity;
const MEDIUM_NOISE_PHASE_MULTIPLIER = 0.4;
const RIDGE_X_FREQUENCY = 1.7;
const RIDGE_Y_FREQUENCY = -1.15;
const RIDGE_STRENGTH = 0.065;
const SECONDARY_RIDGE_X_FREQUENCY = 2.35;
const SECONDARY_RIDGE_Y_FREQUENCY = -1.55;
const SECONDARY_RIDGE_STRENGTH = 0.045;
const LINE_DENSITY_SIN_FREQUENCY = 4.8;
const LINE_DENSITY_SIN_STRENGTH = 0.48;
const LINE_DENSITY_COS_FREQUENCY = 2.1;
const LINE_DENSITY_COS_STRENGTH = 0.3;

type ContourLine = {
  d: string;
  opacity: number;
  strokeWidth: number;
};

type Topography = {
  height: number;
  lines: ContourLine[];
  originX: number;
  originY: number;
  width: number;
};

type Point = [number, number];

type Peak = {
  centerX: number;
  centerY: number;
  falloff: number;
  strength: number;
  stretchX: number;
  stretchY: number;
};

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const randomIntegerBetween = (min: number, max: number) =>
  Math.floor(randomBetween(min, max + 1));

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const formatPoint = ([x, y]: Point) => `${x.toFixed(2)} ${y.toFixed(2)}`;

const getMidpoint = (firstPoint: Point, secondPoint: Point): Point => [
  (firstPoint[0] + secondPoint[0]) / 2,
  (firstPoint[1] + secondPoint[1]) / 2,
];

const getSmoothClosedPath = (points: Point[]) => {
  if (points.length < 4) return '';

  const startPoint = getMidpoint(points.at(-1) ?? points[0], points[0]);
  const segments = points.map((point, index) => {
    const nextPoint = points[(index + 1) % points.length];
    const midpoint = getMidpoint(point, nextPoint);

    return `Q ${formatPoint(point)} ${formatPoint(midpoint)}`;
  });

  return `M ${formatPoint(startPoint)} ${segments.join(' ')} Z`;
};

const getContourPath = (coordinates: number[][][][]) => {
  return coordinates
    .flatMap((polygon) => polygon)
    .map((ring) => ring.map(([x, y]): Point => [x, y]))
    .map(getSmoothClosedPath)
    .filter((path) => path.length > 0)
    .join(' ');
};

const generateThresholds = () => {
  const weights = Array.from({ length: CONTOUR_LINE_COUNT }, (_, index) => {
    const progress = index / (CONTOUR_LINE_COUNT - 1);

    return (
      THRESHOLD_BASE_WEIGHT +
      Math.sin(
        progress * Math.PI * THRESHOLD_WAVE_FREQUENCY +
          Math.random() * THRESHOLD_WAVE_RANDOM_PHASE,
      ) *
        THRESHOLD_WAVE_WEIGHT +
      Math.random() * THRESHOLD_RANDOM_WEIGHT
    );
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let threshold = THRESHOLD_START;

  return weights.map((weight) => {
    threshold += (weight / totalWeight) * THRESHOLD_SPAN;
    return threshold;
  });
};

const generateElevationField = () => {
  const noise2D = createNoise2D();
  const centerX = randomBetween(...CENTER_X_RANGE);
  const centerY = randomBetween(...CENTER_Y_RANGE);
  const stretchX = randomBetween(...STRETCH_X_RANGE);
  const stretchY = randomBetween(...STRETCH_Y_RANGE);
  const phase = randomBetween(0, Math.PI * 2);
  const secondaryPeaks = Array.from(
    { length: randomIntegerBetween(...SECONDARY_PEAK_COUNT_RANGE) },
    (_, index): Peak => {
      const angle =
        phase + (index / SECONDARY_PEAK_COUNT_RANGE[1]) * Math.PI * 2;
      const offset = randomBetween(...SECONDARY_PEAK_OFFSET_RANGE);

      return {
        centerX: clamp(centerX + Math.cos(angle) * offset, 0.08, 0.92),
        centerY: clamp(centerY + Math.sin(angle) * offset, 0.08, 0.92),
        falloff: randomBetween(...SECONDARY_PEAK_FALLOFF_RANGE),
        strength: randomBetween(...SECONDARY_PEAK_STRENGTH_RANGE),
        stretchX: randomBetween(...SECONDARY_PEAK_STRETCH_RANGE),
        stretchY: randomBetween(...SECONDARY_PEAK_STRETCH_RANGE),
      };
    },
  );

  return Array.from({ length: FIELD_COLUMNS * FIELD_ROWS }, (_, index) => {
    const x = ((index % FIELD_COLUMNS) - GRID_PADDING) / (GRID_COLUMNS - 1);
    const y =
      (Math.floor(index / FIELD_COLUMNS) - GRID_PADDING) / (GRID_ROWS - 1);
    const dx = (x - centerX) * stretchX;
    const dy = (y - centerY) * stretchY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const mountain = Math.exp(-(distance * distance) * MOUNTAIN_FALLOFF);
    const secondaryMountains = secondaryPeaks.reduce((sum, peak) => {
      const peakDx = (x - peak.centerX) * peak.stretchX;
      const peakDy = (y - peak.centerY) * peak.stretchY;
      const peakDistance = peakDx * peakDx + peakDy * peakDy;

      return sum + Math.exp(-peakDistance * peak.falloff) * peak.strength;
    }, 0);
    const widePull =
      Math.exp(-(distance * distance) * WIDE_PULL_FALLOFF) * WIDE_PULL_STRENGTH;
    const largeNoise =
      noise2D(x * LARGE_NOISE_SCALE + phase, y * LARGE_NOISE_SCALE - phase) *
      LARGE_NOISE_STRENGTH;
    const mediumNoise =
      noise2D(
        x * MEDIUM_NOISE_SCALE - phase * MEDIUM_NOISE_PHASE_MULTIPLIER,
        y * MEDIUM_NOISE_SCALE + phase,
      ) * MEDIUM_NOISE_STRENGTH;
    const directionalRidge =
      Math.sin(
        (x * RIDGE_X_FREQUENCY + y * RIDGE_Y_FREQUENCY + phase) * Math.PI,
      ) * RIDGE_STRENGTH;
    const secondaryRidge =
      Math.cos(
        (x * SECONDARY_RIDGE_X_FREQUENCY +
          y * SECONDARY_RIDGE_Y_FREQUENCY -
          phase) *
          Math.PI,
      ) * SECONDARY_RIDGE_STRENGTH;

    return Math.max(
      0,
      Math.min(
        1,
        mountain +
          secondaryMountains +
          widePull +
          largeNoise +
          mediumNoise +
          directionalRidge +
          secondaryRidge,
      ),
    );
  });
};

const getSafeOrigin = (canvasSize: number, viewportSize: number) => {
  const safePadding = viewportSize * SAFE_VIEWPORT_PADDING;

  return randomBetween(viewportSize - canvasSize + safePadding, -safePadding);
};

const generateTopography = (): Topography => {
  const width = window.innerWidth * randomBetween(...CANVAS_WIDTH_VW_RANGE);
  const height = window.innerHeight * randomBetween(...CANVAS_HEIGHT_VH_RANGE);
  const thresholds = generateThresholds();
  const elevationField = generateElevationField();
  const contourGenerator = contours()
    .size([FIELD_COLUMNS, FIELD_ROWS])
    .smooth(true)
    .thresholds(thresholds);

  return {
    height,
    originX: getSafeOrigin(width, window.innerWidth),
    originY: getSafeOrigin(height, window.innerHeight),
    width,
    lines: contourGenerator(elevationField)
      .map((contour, index) => {
        const progress = index / Math.max(1, thresholds.length - 1);
        const densityAccent =
          Math.sin(progress * Math.PI * LINE_DENSITY_SIN_FREQUENCY) *
            LINE_DENSITY_SIN_STRENGTH +
          Math.cos(progress * Math.PI * LINE_DENSITY_COS_FREQUENCY) *
            LINE_DENSITY_COS_STRENGTH;

        return {
          d: getContourPath(contour.coordinates),
          opacity: randomBetween(...LINE_OPACITY_RANGE),
          strokeWidth: Math.max(
            LINE_MIN_STROKE_WIDTH,
            LINE_BASE_STROKE_WIDTH + densityAccent * LINE_STROKE_VARIATION,
          ),
        };
      })
      .filter((line) => line.d.length > 0),
  };
};

const TopographicBackground = () => {
  const pathsRef = useRef<SVGPathElement[]>([]);
  const [topography, setTopography] = useState<Topography | null>(null);

  useEffect(() => {
    setTopography(generateTopography());
  }, []);

  useGSAP(
    () => {
      if (!topography) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      pathsRef.current.forEach((path, index) => {
        gsap.to(path, {
          scale: BREATH_SCALE,
          duration: randomBetween(...BREATH_DURATION_RANGE),
          delay: index * BREATH_DELAY_PER_LINE,
          ease: 'sine.inOut',
          repeat: -1,
          svgOrigin: `${GRID_PADDING + GRID_COLUMNS / 2} ${GRID_PADDING + GRID_ROWS / 2}`,
          yoyo: true,
        });
      });
    },
    { dependencies: [topography] },
  );

  if (!topography) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <svg
        aria-hidden="true"
        className="absolute overflow-visible text-white"
        height={topography.height}
        style={{
          left: topography.originX,
          top: topography.originY,
        }}
        viewBox={`${GRID_PADDING} ${GRID_PADDING} ${GRID_COLUMNS} ${GRID_ROWS}`}
        width={topography.width}
      >
        {topography.lines.map((line, index) => (
          <path
            d={line.d}
            fill="none"
            key={index}
            opacity={line.opacity}
            ref={(el) => {
              if (el) {
                pathsRef.current[index] = el;
              }
            }}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={line.strokeWidth}
          />
        ))}
      </svg>
    </div>
  );
};

export default TopographicBackground;
