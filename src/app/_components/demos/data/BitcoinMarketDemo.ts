import { readStorageValue, writeStorageValue } from '@/lib/storage';
import { toFiniteNumber } from '@/lib/utils';

export type BitcoinRange = '1' | '7' | '30';

type MarketChartResponse = {
  market_caps?: [number, number][];
  prices: [number, number][];
  total_volumes?: [number, number][];
};

export type MarketPoint = {
  marketCap?: number;
  price: number;
  timestamp: number;
  volume?: number;
};

export type CachedMarketPoints = {
  points: MarketPoint[];
  savedAt: number;
};

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export const BITCOIN_RANGES: { days: BitcoinRange; label: string }[] = [
  { days: '1', label: '1D' },
  { days: '7', label: '7D' },
  { days: '30', label: '30D' },
];

const COINGECKO_MARKET_CHART_URL =
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';
const BITCOIN_MARKET_API_PATH = '/api/demos/bitcoin-market';

const BITCOIN_MARKET_CACHE_KEY = 'demos.bitcoin-market-chart';
const BITCOIN_MARKET_CACHE_TTL = 5 * 60 * 1000;
const BITCOIN_MARKET_SERVER_REVALIDATE = 5 * 60;

export const DEFAULT_BITCOIN_RANGE: BitcoinRange = '30';

const normalizeMarketChart = (data: MarketChartResponse): MarketPoint[] =>
  data.prices.map(([timestamp, price], index) => ({
    marketCap: toFiniteNumber(data.market_caps?.[index]?.[1], undefined),
    price: toFiniteNumber(price),
    timestamp: toFiniteNumber(timestamp),
    volume: toFiniteNumber(data.total_volumes?.[index]?.[1], undefined),
  }));

export const getBitcoinMarketSnapshot = (range: BitcoinRange) => {
  const marketCache =
    readStorageValue<Partial<Record<BitcoinRange, CachedMarketPoints>>>(
      'session',
      BITCOIN_MARKET_CACHE_KEY,
    ) ?? {};
  const rangeCache = marketCache[range];
  if (!rangeCache) return undefined;

  const isFresh = Date.now() - rangeCache.savedAt < BITCOIN_MARKET_CACHE_TTL;

  return isFresh && rangeCache.points.length > 0 ? rangeCache : undefined;
};

export const getBitcoinMarketCache = (range: BitcoinRange) =>
  getBitcoinMarketSnapshot(range)?.points;

const setBitcoinMarketCache = (range: BitcoinRange, points: MarketPoint[]) => {
  const cache = {
    points,
    savedAt: Date.now(),
  } satisfies CachedMarketPoints;

  try {
    const marketCache =
      readStorageValue<Partial<Record<BitcoinRange, CachedMarketPoints>>>(
        'session',
        BITCOIN_MARKET_CACHE_KEY,
      ) ?? {};

    writeStorageValue('session', BITCOIN_MARKET_CACHE_KEY, {
      ...marketCache,
      [range]: cache,
    });
  } catch {}

  return cache;
};

export const fetchBitcoinMarketSnapshot = (
  range: BitcoinRange,
  options: { signal?: AbortSignal } = {},
) => {
  const cachedSnapshot = getBitcoinMarketSnapshot(range);
  if (cachedSnapshot) {
    return Promise.resolve(cachedSnapshot);
  }

  const isBrowser = typeof window !== 'undefined';
  const marketChartUrl = new URL(
    isBrowser ? BITCOIN_MARKET_API_PATH : COINGECKO_MARKET_CHART_URL,
    isBrowser ? window.location.origin : undefined,
  );
  marketChartUrl.searchParams.set('vs_currency', 'usd');
  marketChartUrl.searchParams.set('days', range);

  const fetchOptions: NextFetchInit = {
    signal: options.signal,
    next: isBrowser
      ? undefined
      : {
          revalidate: BITCOIN_MARKET_SERVER_REVALIDATE,
          tags: [`demo:bitcoin-market:${range}`],
        },
  };

  return fetch(marketChartUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`CoinGecko returned ${response.status}`);
      }

      return response.json() as Promise<
        MarketChartResponse | CachedMarketPoints
      >;
    })
    .then((data) => {
      if ('savedAt' in data) {
        return setBitcoinMarketCache(range, data.points);
      }

      return setBitcoinMarketCache(range, normalizeMarketChart(data));
    });
};

export const fetchBitcoinMarketPoints = (
  range: BitcoinRange,
  options: { signal?: AbortSignal } = {},
) =>
  fetchBitcoinMarketSnapshot(range, options).then(
    (snapshot) => snapshot.points,
  );

export const preloadBitcoinMarketDemo = async () => {
  if (typeof window === 'undefined') return;

  try {
    await fetchBitcoinMarketPoints(DEFAULT_BITCOIN_RANGE);
  } catch {}
};

export const getClosestPoint = (points: MarketPoint[], timestamp: number) =>
  points.reduce((closestPoint, point) => {
    const closestDistance = Math.abs(closestPoint.timestamp - timestamp);
    const pointDistance = Math.abs(point.timestamp - timestamp);

    return pointDistance < closestDistance ? point : closestPoint;
  }, points[0]);
