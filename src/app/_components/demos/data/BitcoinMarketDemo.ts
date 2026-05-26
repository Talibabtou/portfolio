import { readStorageValue, writeStorageValue } from '@/lib/storage';

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

type CachedMarketPoints = {
  points: MarketPoint[];
  savedAt: number;
};

export const BITCOIN_RANGES: { days: BitcoinRange; label: string }[] = [
  { days: '1', label: '1D' },
  { days: '7', label: '7D' },
  { days: '30', label: '30D' },
];

const COINGECKO_MARKET_CHART_URL =
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';

const BITCOIN_MARKET_CACHE_KEY = 'demos.bitcoin-market-chart';
const BITCOIN_MARKET_CACHE_TTL = 5 * 60 * 1000;

export const DEFAULT_BITCOIN_RANGE: BitcoinRange = '30';
export const MILLISECONDS_IN_DAY = 86_400_000;

const normalizeMarketChart = (data: MarketChartResponse): MarketPoint[] =>
  data.prices.map(([timestamp, price], index) => ({
    marketCap: data.market_caps?.[index]?.[1],
    price,
    timestamp,
    volume: data.total_volumes?.[index]?.[1],
  }));

export const getBitcoinMarketCache = (range: BitcoinRange) => {
  const marketCache =
    readStorageValue<Partial<Record<BitcoinRange, CachedMarketPoints>>>(
      'session',
      BITCOIN_MARKET_CACHE_KEY,
    ) ?? {};
  const rangeCache = marketCache[range];
  if (!rangeCache) return undefined;

  const isFresh = Date.now() - rangeCache.savedAt < BITCOIN_MARKET_CACHE_TTL;

  return isFresh && rangeCache.points.length > 0
    ? rangeCache.points
    : undefined;
};

const setBitcoinMarketCache = (range: BitcoinRange, points: MarketPoint[]) => {
  try {
    const marketCache =
      readStorageValue<Partial<Record<BitcoinRange, CachedMarketPoints>>>(
        'session',
        BITCOIN_MARKET_CACHE_KEY,
      ) ?? {};

    writeStorageValue('session', BITCOIN_MARKET_CACHE_KEY, {
      ...marketCache,
      [range]: {
        points,
        savedAt: Date.now(),
      } satisfies CachedMarketPoints,
    });
  } catch {
    // Session storage is a progressive enhancement for rate-limit friendliness.
  }
};

export const fetchBitcoinMarketPoints = (
  range: BitcoinRange,
  options: { signal?: AbortSignal } = {},
) => {
  const cachedPoints = getBitcoinMarketCache(range);
  if (cachedPoints) {
    return Promise.resolve(cachedPoints);
  }

  const marketChartUrl = new URL(COINGECKO_MARKET_CHART_URL);
  marketChartUrl.searchParams.set('vs_currency', 'usd');
  marketChartUrl.searchParams.set('days', range);

  return fetch(marketChartUrl, { signal: options.signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`CoinGecko returned ${response.status}`);
      }

      return response.json() as Promise<MarketChartResponse>;
    })
    .then((data) => {
      const normalizedPoints = normalizeMarketChart(data);
      setBitcoinMarketCache(range, normalizedPoints);

      return normalizedPoints;
    });
};

export const preloadBitcoinMarketDemo = async () => {
  if (typeof window === 'undefined') return;

  try {
    await fetchBitcoinMarketPoints(DEFAULT_BITCOIN_RANGE);
  } catch {
    // Preloading is opportunistic; mounted state handles recoverable failures.
  }
};

export const getClosestPoint = (points: MarketPoint[], timestamp: number) =>
  points.reduce((closestPoint, point) => {
    const closestDistance = Math.abs(closestPoint.timestamp - timestamp);
    const pointDistance = Math.abs(point.timestamp - timestamp);

    return pointDistance < closestDistance ? point : closestPoint;
  }, points[0]);
