'use client';

import {
  fetchCountries,
  fetchEarthquakes,
  getCountriesCache,
  getEarthquakesCache,
  isEarthquakesFresh,
  type CountryFeature,
  type CachedEarthquakes,
  type EarthquakePulse,
} from '@/lib/demos/world-map';
import { useDebouncedActivation } from '@/hooks/use-debounced-activation';
import { UI_TIMINGS } from '@/lib/constants';
import {
  escapeHtml,
  formatMinutesAgo,
  formatShortDateTime,
  getLegacyCssHslVariable,
} from '@/lib/utils';
import type { DemoComponentProps } from '@/types';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import { MeshPhongMaterial } from 'three';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});
const MIN_EARTHQUAKE_MAGNITUDE = 4.5;
const GLOBE_VIEWPOINT = { altitude: 1.7, lat: 42, lng: 8 };
const GLOBE_VIEW_TRANSITION = 900;
const GLOBE_AUTO_ROTATE_SPEED = 0.18;
const GLOBE_ROTATE_SPEED = 0.12;
const GLOBE_ZOOM_SPEED = 0.35;
const isCompactDemoViewport = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 1023px)').matches;
const getMagnitudeScale = (magnitude: number) => {
  const min = MIN_EARTHQUAKE_MAGNITUDE;
  const base = Math.max(0, magnitude - min + 1);
  return Math.max(0, base ** 1.7 / 6);
};

const getGlobeTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return {
    dot: getLegacyCssHslVariable('--primary'),
    globe: isDarkMode ? 'hsl(0, 0%, 6%)' : 'hsl(0, 0%, 96%)',
    land: isDarkMode ? 'hsla(0, 0%, 76%, 0.6)' : 'hsla(0, 0%, 3%, 0.54)',
    halo: getLegacyCssHslVariable('--primary'),
  };
};

const getInitialGlobeTheme = () => {
  if (typeof window === 'undefined') {
    return {
      dot: 'hsl(30, 100%, 50%)',
      globe: 'hsl(0, 0%, 8%)',
      halo: 'hsl(30, 100%, 50%)',
      land: 'hsla(0, 0%, 76%, 0.6)',
    };
  }

  return getGlobeTheme();
};

const getPointLabel = (point: object) => {
  const earthquake = point as EarthquakePulse;
  const place = escapeHtml(earthquake.place);

  return `
    <div style="font-family: var(--font-roboto-flex), sans-serif; line-height: 1.15; min-width: 9rem;">
      <div style="color: hsl(var(--primary)); font-family: var(--font-anton), sans-serif; font-size: 0.95rem; text-transform: uppercase;">
        M ${earthquake.magnitude.toFixed(1)} earthquake
      </div>
      <div class="world-map-tooltip-muted" style="margin-top: 0.35rem; font-size: 0.72rem;">
        ${place}
      </div>
      <div style="margin-top: 0.65rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; font-size: 0.72rem;">
        <span style="color: hsl(var(--primary)); font-family: var(--font-anton), sans-serif;">Depth ${earthquake.depth.toFixed(0)} km</span>
        <span class="world-map-tooltip-foreground">USGS</span>
      </div>
      <div class="world-map-tooltip-muted" style="margin-top: 0.5rem; font-size: 0.68rem;">
        ${formatShortDateTime(earthquake.timestamp)}
      </div>
    </div>
  `;
};

type GlobeSurfaceProps = {
  earthquakes: EarthquakePulse[];
  isActive: boolean;
  isVisible: boolean;
  isLoading: boolean;
};

const GlobeSurface = ({
  earthquakes,
  isActive,
  isVisible,
  isLoading,
}: GlobeSurfaceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState<CountryFeature[]>(
    () => getCountriesCache({ allowStale: true })?.countries ?? [],
  );
  const [dimensions, setDimensions] = useState({ height: 1, width: 1 });
  const [hoveredEarthquakeId, setHoveredEarthquakeId] = useState<string>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [theme, setTheme] = useState(getInitialGlobeTheme);
  const globeMaterial = useMemo(() => {
    if (typeof window === 'undefined') return undefined;

    return new MeshPhongMaterial({
      color: theme.globe,
      emissive: theme.globe,
      emissiveIntensity: 0.12,
      shininess: 4,
      transparent: true,
    });
  }, [theme.globe]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getGlobeTheme());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    void isVisible;

    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      const isCompactDemo = isCompactDemoViewport();

      setDimensions({
        height: Math.max(
          1,
          isCompactDemo ? container.offsetHeight : Math.round(rect.height),
        ),
        width: Math.max(
          1,
          isCompactDemo ? container.offsetWidth : Math.round(rect.width),
        ),
      });
    };

    updateDimensions();
    const animationFrame = requestAnimationFrame(updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    fetchCountries()
      .then((cache) => setCountries(cache.countries))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!isGlobeReady) return;

    const globe = globeRef.current;
    if (!globe) return;

    const renderer = globe.renderer();
    const canvas = renderer.domElement;
    const controls = globe.controls();

    controls.autoRotate = true;
    controls.autoRotateSpeed = GLOBE_AUTO_ROTATE_SPEED;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.rotateSpeed = GLOBE_ROTATE_SPEED;
    controls.zoomSpeed = GLOBE_ZOOM_SPEED;

    renderer.setClearAlpha(0);
    canvas.style.cursor = 'none';

    const animationFrame = requestAnimationFrame(() => {
      globe.pointOfView(GLOBE_VIEWPOINT, GLOBE_VIEW_TRANSITION);
      controls.update();
    });

    return () => {
      controls.autoRotate = false;
      canvas.style.cursor = '';
      cancelAnimationFrame(animationFrame);
    };
  }, [isGlobeReady]);

  useEffect(() => {
    if (!isGlobeReady) return;

    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();

    if (isActive && isVisible) {
      globe.resumeAnimation();
      controls.enabled = true;
      controls.autoRotate = !hoveredEarthquakeId;
      return;
    }

    controls.autoRotate = false;
    controls.enabled = false;
    globe.pauseAnimation();
  }, [hoveredEarthquakeId, isActive, isGlobeReady, isVisible]);

  useEffect(() => {
    if (!isGlobeReady || !isCompactDemoViewport()) return;

    const globe = globeRef.current;
    if (!globe) return;

    const renderer = globe.renderer();

    renderer.setSize(dimensions.width, dimensions.height, true);
    globe.controls().update();
  }, [dimensions.height, dimensions.width, isGlobeReady]);

  return (
    <div
      className="absolute inset-0 z-0 transition-opacity duration-150 max-lg:[&>div]:h-full! max-lg:[&>div]:w-full! max-lg:[&_canvas]:h-full! max-lg:[&_canvas]:w-full!"
      ref={containerRef}
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      <Globe
        ref={globeRef}
        animateIn={false}
        atmosphereAltitude={0.1}
        atmosphereColor={theme.halo}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        height={dimensions.height}
        onGlobeReady={() => {
          setIsGlobeReady(true);
        }}
        pointAltitude={(earthquake) =>
          (earthquake as EarthquakePulse).id === hoveredEarthquakeId
            ? 0.12
            : 0.03 +
              getMagnitudeScale((earthquake as EarthquakePulse).magnitude) *
                0.018
        }
        pointColor={() => theme.dot}
        pointLabel={getPointLabel}
        pointLat={(earthquake) => (earthquake as EarthquakePulse).lat}
        pointLng={(earthquake) => (earthquake as EarthquakePulse).lng}
        pointRadius={(earthquake) =>
          (earthquake as EarthquakePulse).id === hoveredEarthquakeId
            ? 1.45
            : 0.34 +
              getMagnitudeScale((earthquake as EarthquakePulse).magnitude) *
                0.52
        }
        onPointHover={(point) => {
          setHoveredEarthquakeId(
            point ? (point as EarthquakePulse).id : undefined,
          );

          const globe = globeRef.current;
          if (!globe) return;

          globe.controls().autoRotate = !point;
        }}
        pointerEventsFilter={(object) => {
          return (
            (object as { __globeObjType?: string }).__globeObjType === 'point'
          );
        }}
        pointResolution={18}
        pointsData={earthquakes}
        pointsTransitionDuration={300}
        polygonAltitude={0.004}
        polygonCapColor={() => 'rgba(255,255,255,0)'}
        polygonCapCurvatureResolution={2}
        polygonGeoJsonGeometry="geometry"
        polygonSideColor={() => 'rgba(255,255,255,0)'}
        polygonStrokeColor={() => theme.land}
        polygonsData={countries}
        polygonsTransitionDuration={0}
        showAtmosphere
        showGlobe
        showGraticules={false}
        showPointerCursor={false}
        width={dimensions.width}
      />
      {isLoading && earthquakes.length === 0 ? (
        <Loader2
          aria-label="Loading earthquakes"
          className="absolute right-4 bottom-4 animate-spin text-primary"
          size={22}
        />
      ) : null}
    </div>
  );
};

const WorldMapDemo = ({ isActive = false }: DemoComponentProps) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [earthquakes, setEarthquakes] = useState<EarthquakePulse[]>([]);
  const [snapshotSavedAt, setSnapshotSavedAt] = useState<number>();
  const { hasMounted, isVisible } = useDebouncedActivation(isActive, {
    delayMs: UI_TIMINGS.demoTabVisibilityDelayMs,
    preferIdleMount: true,
  });

  useEffect(() => {
    const cachedEarthquakes = getEarthquakesCache({ allowStale: true });
    if (cachedEarthquakes) {
      queueMicrotask(() => {
        setEarthquakes(cachedEarthquakes.earthquakes);
        setSnapshotSavedAt(cachedEarthquakes.savedAt);
        setError(undefined);
        setIsLoading(!isEarthquakesFresh(cachedEarthquakes));
      });
    }

    let ignoreRequest = false;

    fetchEarthquakes()
      .then((earthquakeCache: CachedEarthquakes) => {
        if (ignoreRequest) return;

        setEarthquakes(earthquakeCache.earthquakes);
        setSnapshotSavedAt(earthquakeCache.savedAt);
        setError(undefined);
      })
      .catch(() => {
        if (ignoreRequest) return;

        setError('USGS earthquake data unavailable. Try again in a moment.');
        if (!cachedEarthquakes) {
          setEarthquakes([]);
          setSnapshotSavedAt(undefined);
        }
      })
      .finally(() => {
        if (!ignoreRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      ignoreRequest = true;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {hasMounted ? (
        <GlobeSurface
          earthquakes={error ? [] : earthquakes}
          isActive={isActive}
          isVisible={isVisible}
          isLoading={isLoading}
        />
      ) : null}
      <p className="pointer-events-none absolute bottom-2 left-3 z-1 text-[0.45rem] text-muted-foreground leading-none lg:bottom-5 lg:left-4 lg:text-sm lg:leading-normal">
        Source: USGS Earthquake Catalog
        {snapshotSavedAt ? ` (${formatMinutesAgo(snapshotSavedAt)})` : ''}.
      </p>
    </div>
  );
};

export default WorldMapDemo;
