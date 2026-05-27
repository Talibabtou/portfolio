import { readStorageValue, writeStorageValue } from '@/lib/storage';
import { getIsoDateDaysAgo, toFiniteNumber } from '@/lib/utils';

export const preloadGlobeLibrary = () => import('react-globe.gl');

export type EarthquakePulse = {
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

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export type CountryFeature = {
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
const WORLD_MAP_EARTHQUAKES_API_PATH = '/api/demos/world-map/earthquakes';
const WORLD_MAP_COUNTRIES_API_PATH = '/api/demos/world-map/countries';
const WORLD_MAP_COUNTRIES_CACHE_KEY = 'demos.world-map.countries';
const WORLD_MAP_CACHE_KEY = 'demos.world-map.earthquakes.v1';
const WORLD_MAP_CACHE_TTL = 24 * 60 * 60 * 1000;
const WORLD_MAP_COUNTRIES_SERVER_REVALIDATE = 7 * 24 * 60 * 60;
const WORLD_MAP_EARTHQUAKES_SERVER_REVALIDATE = 24 * 60 * 60;
const EARTHQUAKE_LOOKBACK_DAYS = 365;
const EARTHQUAKE_LIMIT = 160;
const MIN_EARTHQUAKE_MAGNITUDE = 4.5;
const earthquakeRequest = new Map<string, Promise<CachedEarthquakes>>();
const countriesRequest = new Map<string, Promise<CachedCountries>>();

const getEarthquakeStartDate = () =>
  getIsoDateDaysAgo(EARTHQUAKE_LOOKBACK_DAYS);

export const isEarthquakesFresh = (cache: CachedEarthquakes) =>
  Date.now() - cache.savedAt < WORLD_MAP_CACHE_TTL;

export const isCountriesCacheFresh = (cache: CachedCountries) =>
  Date.now() - cache.savedAt < WORLD_MAP_CACHE_TTL;

export const getEarthquakesCache = (options: { allowStale?: boolean } = {}) => {
  const cache = readStorageValue<CachedEarthquakes>(
    'local',
    WORLD_MAP_CACHE_KEY,
  );

  if (!cache || cache.earthquakes.length === 0) return undefined;

  return options.allowStale || isEarthquakesFresh(cache) ? cache : undefined;
};

export const getCountriesCache = (options: { allowStale?: boolean } = {}) => {
  const cache = readStorageValue<CachedCountries>(
    'local',
    WORLD_MAP_COUNTRIES_CACHE_KEY,
  );

  if (!cache || cache.countries.length === 0) return undefined;

  return options.allowStale || isCountriesCacheFresh(cache) ? cache : undefined;
};

const setEarthquakesCache = (cache: CachedEarthquakes) => {
  try {
    writeStorageValue('local', WORLD_MAP_CACHE_KEY, cache);
  } catch {}
};

const setCountriesCache = (cache: CachedCountries) => {
  try {
    writeStorageValue('local', WORLD_MAP_COUNTRIES_CACHE_KEY, cache);
  } catch {}
};

const normalizeEarthquakes = (
  features: UsgsEarthquakeFeature[],
): EarthquakePulse[] => {
  return features
    .map((feature) => {
      const [lng, lat, depth = 0] = feature.geometry.coordinates;

      return {
        depth: toFiniteNumber(depth),
        id: feature.id,
        lat: toFiniteNumber(lat),
        lng: toFiniteNumber(lng),
        magnitude: toFiniteNumber(feature.properties.mag),
        place: feature.properties.place ?? 'Unknown location',
        timestamp: toFiniteNumber(feature.properties.time, Date.now()),
      } satisfies EarthquakePulse;
    })
    .filter((earthquake) => earthquake.magnitude > 0)
    .sort(
      (firstEarthquake, secondEarthquake) =>
        secondEarthquake.magnitude - firstEarthquake.magnitude,
    );
};

export const fetchEarthquakes = () => {
  const cachedEarthquakes = getEarthquakesCache();
  if (cachedEarthquakes) {
    return Promise.resolve(cachedEarthquakes);
  }

  const pendingRequest = earthquakeRequest.get(WORLD_MAP_CACHE_KEY);
  if (pendingRequest) return pendingRequest;

  const isBrowser = typeof window !== 'undefined';
  const earthquakeUrl = new URL(
    isBrowser ? WORLD_MAP_EARTHQUAKES_API_PATH : USGS_EARTHQUAKES_URL,
    isBrowser ? window.location.origin : undefined,
  );

  if (!isBrowser) {
    earthquakeUrl.searchParams.set('format', 'geojson');
    earthquakeUrl.searchParams.set('orderby', 'magnitude');
    earthquakeUrl.searchParams.set('starttime', getEarthquakeStartDate());
    earthquakeUrl.searchParams.set(
      'minmagnitude',
      String(MIN_EARTHQUAKE_MAGNITUDE),
    );
    earthquakeUrl.searchParams.set('limit', String(EARTHQUAKE_LIMIT));
  }

  const fetchOptions: NextFetchInit = isBrowser
    ? {}
    : {
        next: {
          revalidate: WORLD_MAP_EARTHQUAKES_SERVER_REVALIDATE,
          tags: ['demo:world-map:earthquakes'],
        },
      };

  const request = fetch(earthquakeUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`USGS returned ${response.status}`);
      }

      return response.json() as Promise<
        UsgsEarthquakeResponse | CachedEarthquakes
      >;
    })
    .then((data) => {
      if ('savedAt' in data) {
        setEarthquakesCache(data);
        return data;
      }

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

export const fetchCountries = () => {
  const cachedCountries = getCountriesCache();
  if (cachedCountries) {
    return Promise.resolve(cachedCountries);
  }

  const pendingRequest = countriesRequest.get(WORLD_MAP_COUNTRIES_CACHE_KEY);
  if (pendingRequest) return pendingRequest;

  const isBrowser = typeof window !== 'undefined';
  const countriesUrl = new URL(
    isBrowser ? WORLD_MAP_COUNTRIES_API_PATH : COUNTRIES_GEOJSON_URL,
    isBrowser ? window.location.origin : undefined,
  );
  const fetchOptions: NextFetchInit = isBrowser
    ? {}
    : {
        next: {
          revalidate: WORLD_MAP_COUNTRIES_SERVER_REVALIDATE,
          tags: ['demo:world-map:countries'],
        },
      };

  const request = fetch(countriesUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Countries returned ${response.status}`);
      }

      return response.json() as Promise<CountriesResponse | CachedCountries>;
    })
    .then((data) => {
      if ('savedAt' in data) {
        setCountriesCache(data);
        return data;
      }

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

export const preloadWorldMapDemo = async () => {
  if (typeof window === 'undefined') return;

  void preloadGlobeLibrary();

  await Promise.allSettled([fetchEarthquakes(), fetchCountries()]);
};
