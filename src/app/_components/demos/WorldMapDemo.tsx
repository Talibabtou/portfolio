'use client';

import type { DemoTrack } from '@/app/_components/demos/types';
import {
  readPortfolioStorageValue,
  writePortfolioStorageValue,
} from '@/lib/user-preferences';
import { Globe2, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import { MeshPhongMaterial } from 'three';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

type EarthquakePulse = {
  depth: number;
  id: string;
  lat: number;
  lng: number;
  magnitude: number;
  place: string;
  timestamp: number;
};

type CachedEarthquakes = {
  earthquakes: EarthquakePulse[];
  savedAt: number;
};

type CachedCountries = {
  countries: CountryFeature[];
  savedAt: number;
};

type CountryFeature = {
  geometry: {
    coordinates: unknown[];
    type: 'MultiPolygon' | 'Polygon';
  };
  properties?: {
    name?: string;
  };
  type: 'Feature';
};

type CountriesResponse = {
  features: CountryFeature[];
  type: 'FeatureCollection';
};

type UsgsEarthquakeFeature = {
  geometry: {
    coordinates: [number, number, number?];
    type: 'Point';
  };
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number | null;
  };
  type: 'Feature';
};

type UsgsEarthquakeResponse = {
  features: UsgsEarthquakeFeature[];
  type: 'FeatureCollection';
};

const USGS_EARTHQUAKES_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const COUNTRIES_GEOJSON_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
const WORLD_MAP_COUNTRIES_CACHE_KEY = 'demos.world-map.countries';
const WORLD_MAP_CACHE_KEY = 'demos.world-map.earthquakes.v1';
const WORLD_MAP_CACHE_TTL = 15 * 60 * 1000;
const EARTHQUAKE_LOOKBACK_DAYS = 365;
const EARTHQUAKE_LIMIT = 160;
const MIN_EARTHQUAKE_MAGNITUDE = 4.5;
const MILLISECONDS_IN_DAY = 86_400_000;
const GLOBE_VIEWPOINT = { altitude: 1.5, lat: 42, lng: 8 };
const GLOBE_VIEW_TRANSITION = 900;
const MAP_RENDER_DELAY = 350;
const GLOBE_AUTO_ROTATE_SPEED = 0.18;
const GLOBE_ROTATE_SPEED = 0.12;
const GLOBE_ZOOM_SPEED = 0.35;
const getMagnitudeScale = (magnitude: number) => {
  const min = MIN_EARTHQUAKE_MAGNITUDE;
  const base = Math.max(0, magnitude - min + 1);
  return Math.max(0, base ** 1.7 / 6);
};

const earthquakeRequest = new Map<string, Promise<CachedEarthquakes>>();
const countriesRequest = new Map<string, Promise<CachedCountries>>();

const worldMapContent = {
  detail:
    'Real earthquake coordinates from the past year, scaled by magnitude.',
  eyebrow: 'Seismic Activity',
  icon: Globe2,
  id: 'world-map',
  label: 'World Map',
  metrics: ['USGS', 'Real geo', '365 days'],
  title: 'A rotating map of global earthquakes from public geodata.',
};

const getThemeColor = (token: string, alpha?: number) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const [hue, saturation, lightness] = value.split(' ');

  return alpha
    ? `hsla(${hue}, ${saturation}, ${lightness}, ${alpha})`
    : `hsl(${hue}, ${saturation}, ${lightness})`;
};

const getGlobeTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return {
    dot: getThemeColor('--primary'),
    globe: isDarkMode ? 'hsl(0, 0%, 6%)' : 'hsl(0, 0%, 96%)',
    land: isDarkMode ? 'hsla(0, 0%, 76%, 0.6)' : 'hsla(0, 0%, 3%, 0.54)',
    halo: getThemeColor('--primary'),
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

const getEarthquakeDateLabel = (timestamp: number) => {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(timestamp);
};

const getEarthquakeStartDate = () =>
  new Date(Date.now() - EARTHQUAKE_LOOKBACK_DAYS * MILLISECONDS_IN_DAY)
    .toISOString()
    .slice(0, 10);

const isEarthquakesFresh = (cache: CachedEarthquakes) =>
  Date.now() - cache.savedAt < WORLD_MAP_CACHE_TTL;

const isCountriesCacheFresh = (cache: CachedCountries) =>
  Date.now() - cache.savedAt < WORLD_MAP_CACHE_TTL;

const getEarthquakesCache = (options: { allowStale?: boolean } = {}) => {
  const cache = readPortfolioStorageValue<CachedEarthquakes>(
    'local',
    WORLD_MAP_CACHE_KEY,
  );

  if (!cache || cache.earthquakes.length === 0) return undefined;

  return options.allowStale || isEarthquakesFresh(cache) ? cache : undefined;
};

const getCountriesCache = (options: { allowStale?: boolean } = {}) => {
  const cache = readPortfolioStorageValue<CachedCountries>(
    'local',
    WORLD_MAP_COUNTRIES_CACHE_KEY,
  );

  if (!cache || cache.countries.length === 0) return undefined;

  return options.allowStale || isCountriesCacheFresh(cache) ? cache : undefined;
};

const setEarthquakesCache = (cache: CachedEarthquakes) => {
  try {
    writePortfolioStorageValue('local', WORLD_MAP_CACHE_KEY, cache);
  } catch {
    // The demo can still render from the live request when storage is full.
  }
};

const setCountriesCache = (cache: CachedCountries) => {
  try {
    writePortfolioStorageValue('local', WORLD_MAP_COUNTRIES_CACHE_KEY, cache);
  } catch {
    // Country outlines are visual enhancement only; the demo can still run live.
  }
};

const normalizeEarthquakes = (
  features: UsgsEarthquakeFeature[],
): EarthquakePulse[] => {
  return features
    .map((feature) => {
      const [lng, lat, depth = 0] = feature.geometry.coordinates;

      return {
        depth,
        id: feature.id,
        lat,
        lng,
        magnitude: feature.properties.mag ?? 0,
        place: feature.properties.place ?? 'Unknown location',
        timestamp: feature.properties.time ?? Date.now(),
      } satisfies EarthquakePulse;
    })
    .filter((earthquake) => earthquake.magnitude > 0)
    .sort(
      (firstEarthquake, secondEarthquake) =>
        secondEarthquake.magnitude - firstEarthquake.magnitude,
    );
};

const fetchEarthquakes = () => {
  const cachedEarthquakes = getEarthquakesCache();
  if (cachedEarthquakes) {
    return Promise.resolve(cachedEarthquakes);
  }

  const pendingRequest = earthquakeRequest.get(WORLD_MAP_CACHE_KEY);
  if (pendingRequest) return pendingRequest;

  const earthquakeUrl = new URL(USGS_EARTHQUAKES_URL);
  earthquakeUrl.searchParams.set('format', 'geojson');
  earthquakeUrl.searchParams.set('orderby', 'magnitude');
  earthquakeUrl.searchParams.set('starttime', getEarthquakeStartDate());
  earthquakeUrl.searchParams.set(
    'minmagnitude',
    String(MIN_EARTHQUAKE_MAGNITUDE),
  );
  earthquakeUrl.searchParams.set('limit', String(EARTHQUAKE_LIMIT));

  const request = fetch(earthquakeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`USGS returned ${response.status}`);
      }

      return response.json() as Promise<UsgsEarthquakeResponse>;
    })
    .then((data) => {
      const cache = {
        earthquakes: normalizeEarthquakes(data.features),
        savedAt: Date.now(),
      } satisfies CachedEarthquakes;

      setEarthquakesCache(cache);

      return cache;
    })
    .finally(() => {
      earthquakeRequest.delete(WORLD_MAP_CACHE_KEY);
    });

  earthquakeRequest.set(WORLD_MAP_CACHE_KEY, request);

  return request;
};

const fetchCountries = () => {
  const cachedCountries = getCountriesCache();
  if (cachedCountries) {
    return Promise.resolve(cachedCountries);
  }

  const pendingRequest = countriesRequest.get(WORLD_MAP_COUNTRIES_CACHE_KEY);
  if (pendingRequest) return pendingRequest;

  const request = fetch(COUNTRIES_GEOJSON_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Countries returned ${response.status}`);
      }

      return response.json() as Promise<CountriesResponse>;
    })
    .then((data) => {
      const cache = {
        countries: data.features,
        savedAt: Date.now(),
      } satisfies CachedCountries;

      setCountriesCache(cache);

      return cache;
    })
    .finally(() => {
      countriesRequest.delete(WORLD_MAP_COUNTRIES_CACHE_KEY);
    });

  countriesRequest.set(WORLD_MAP_COUNTRIES_CACHE_KEY, request);

  return request;
};

const preloadWorldMapDemo = () => {
  if (typeof window === 'undefined') return;

  void fetchEarthquakes().catch(() => {
    // Preloading is opportunistic; the mounted demo renders the recoverable error.
  });
  void fetchCountries().catch(() => {
    // Country outlines can still be requested when the demo mounts.
  });
};

const getPointLabel = (point: object) => {
  const earthquake = point as EarthquakePulse;

  return `
    <div style="font-family: var(--font-roboto-flex), sans-serif; line-height: 1.15; min-width: 9rem;">
      <div style="color: hsl(var(--primary)); font-family: var(--font-anton), sans-serif; font-size: 0.95rem; text-transform: uppercase;">
        M ${earthquake.magnitude.toFixed(1)} earthquake
      </div>
      <div class="world-map-tooltip-muted" style="margin-top: 0.35rem; font-size: 0.72rem;">
        ${earthquake.place}
      </div>
      <div style="margin-top: 0.65rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; font-size: 0.72rem;">
        <span style="color: hsl(var(--primary)); font-family: var(--font-anton), sans-serif;">Depth ${earthquake.depth.toFixed(0)} km</span>
        <span class="world-map-tooltip-foreground">USGS</span>
      </div>
      <div class="world-map-tooltip-muted" style="margin-top: 0.5rem; font-size: 0.68rem;">
        ${getEarthquakeDateLabel(earthquake.timestamp)}
      </div>
    </div>
  `;
};

type GlobeSurfaceProps = {
  earthquakes: EarthquakePulse[];
  isLoading: boolean;
};

const GlobeSurface = ({ earthquakes, isLoading }: GlobeSurfaceProps) => {
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
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();

      setDimensions({
        height: Math.max(1, Math.round(rect.height)),
        width: Math.max(1, Math.round(rect.width)),
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

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

  return (
    <div
      className="absolute inset-0 z-0"
      data-lenis-prevent-wheel
      ref={containerRef}
    >
      <Globe
        ref={globeRef}
        animateIn
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

const WorldMapDemo = () => {
  const [canRenderGlobe, setCanRenderGlobe] = useState(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [earthquakes, setEarthquakes] = useState<EarthquakePulse[]>([]);

  useEffect(() => {
    const renderDelay = window.setTimeout(() => {
      setCanRenderGlobe(true);
    }, MAP_RENDER_DELAY);

    return () => {
      window.clearTimeout(renderDelay);
    };
  }, []);

  useEffect(() => {
    const cachedEarthquakes = getEarthquakesCache({ allowStale: true });
    if (cachedEarthquakes) {
      queueMicrotask(() => {
        setEarthquakes(cachedEarthquakes.earthquakes);
        setError(undefined);
        setIsLoading(!isEarthquakesFresh(cachedEarthquakes));
      });
    }

    let ignoreRequest = false;

    fetchEarthquakes()
      .then((earthquakeCache) => {
        if (ignoreRequest) return;

        setEarthquakes(earthquakeCache.earthquakes);
        setError(undefined);
      })
      .catch(() => {
        if (ignoreRequest) return;

        setError('USGS earthquake data unavailable. Try again in a moment.');
        if (!cachedEarthquakes) {
          setEarthquakes([]);
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
      {canRenderGlobe ? (
        <GlobeSurface
          earthquakes={error ? [] : earthquakes}
          isLoading={isLoading}
        />
      ) : null}
      <p className="pointer-events-none absolute bottom-5 left-4 z-1 text-muted-foreground text-sm">
        Source: USGS Earthquake Catalog.
      </p>
    </div>
  );
};

export const worldMapDemo = {
  ...worldMapContent,
  Component: WorldMapDemo,
  preload: preloadWorldMapDemo,
} satisfies DemoTrack;
