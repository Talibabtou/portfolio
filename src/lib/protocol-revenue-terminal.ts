import { createStorageNamespace } from '@/lib/storage';

const LLAMA_API_BASE_URL = 'https://api.llama.fi';
const PROTOCOL_REVENUE_NAMESPACE = createStorageNamespace(
  'local',
  'demos.protocol-revenue-terminal',
);
const PROTOCOL_REVENUE_CACHE_TTL = 60 * 60 * 1000;
const PROTOCOL_DIRECTORY_CACHE_TTL = 24 * 60 * 60 * 1000;
const PROTOCOL_DETAIL_CACHE_TTL = 60 * 60 * 1000;
const DEFAULT_PROTOCOL_LIMIT = 18;
let protocolDirectorySnapshot: LlamaProtocolDirectoryItem[] | null = null;

type LlamaOverviewProtocol = {
  category?: string;
  change_1d?: number;
  change_7d?: number;
  change_1m?: number;
  chains?: string[];
  dailyFees?: number;
  dailyRevenue?: number;
  module?: string;
  name?: string;
  parentProtocol?: string;
  total14dto7d?: number;
  total14dto7dRevenue?: number;
  total24h?: number;
  total24hRevenue?: number;
  total30d?: number;
  total30dRevenue?: number;
  total48hto24h?: number;
  total48hto24hRevenue?: number;
  total60dto30d?: number;
  total60dto30dRevenue?: number;
  total7d?: number;
  total7dRevenue?: number;
};

type LlamaOverviewResponse = {
  protocols?: LlamaOverviewProtocol[];
};

type LlamaProtocolDirectoryItem = {
  category?: string;
  chains?: string[];
  name?: string;
  slug?: string;
  symbol?: string;
  tvl?: number;
};

type LlamaProtocolDetailResponse = {
  totalDataChart?: unknown[];
};

type CachedProtocolRevenueSnapshot = {
  protocols: TerminalProtocol[];
  savedAt: number;
};

type CachedProtocolDetail = {
  points: TerminalChartPoint[];
  savedAt: number;
};

export type RevenueMetricKey = 'fees' | 'revenue';
export type RevenueTimeframe = '24h' | '7d' | '30d';

export type TerminalChartPoint = {
  timestamp: number;
  value: number;
};

export type TerminalProtocol = {
  category: string;
  chains: string[];
  detailSlug: string;
  feeCapture: number;
  fees24h: number;
  fees30d: number;
  fees7d: number;
  feesToTvl: number;
  growth24h: number;
  growth30d: number;
  growth7d: number;
  name: string;
  primaryChain: string;
  revenue24h: number;
  revenue30d: number;
  revenue7d: number;
  revenueToTvl: number;
  id: string;
  slug: string;
  symbol: string;
  tvl: number;
};

const overviewRequests = new Map<
  string,
  Promise<CachedProtocolRevenueSnapshot>
>();
const detailRequests = new Map<string, Promise<CachedProtocolDetail>>();

const isCacheFresh = (savedAt: number, ttl: number) =>
  Date.now() - savedAt < ttl;

const toFiniteNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

const normalizePercent = (value: unknown) => {
  const numericValue = toFiniteNumber(value);
  return Math.abs(numericValue) <= 1.5 ? numericValue * 100 : numericValue;
};

const computeGrowth = (currentValue: number, previousValue: number) => {
  if (!previousValue) return 0;

  return ((currentValue - previousValue) / previousValue) * 100;
};

const toLookupKey = (value: string | undefined) =>
  value?.trim().toLowerCase().replaceAll(/\s+/g, '-') ?? '';

const isValidProtocolIdentifier = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.trim().toLowerCase() !== 'undefined'
  );
};

const isTerminalProtocol = (value: unknown): value is TerminalProtocol => {
  if (typeof value !== 'object' || value === null) return false;

  const protocol = value as Partial<TerminalProtocol>;

  return (
    isValidProtocolIdentifier(protocol.slug) &&
    isValidProtocolIdentifier(protocol.detailSlug) &&
    typeof protocol.name === 'string' &&
    typeof protocol.category === 'string' &&
    Array.isArray(protocol.chains) &&
    typeof protocol.primaryChain === 'string' &&
    typeof protocol.symbol === 'string'
  );
};

const getCachedOverview = (allowStale = false) => {
  const cache =
    PROTOCOL_REVENUE_NAMESPACE.get<CachedProtocolRevenueSnapshot>('snapshot');
  if (!cache || cache.protocols.length === 0) return undefined;
  if (!cache.protocols.every(isTerminalProtocol)) {
    PROTOCOL_REVENUE_NAMESPACE.remove('snapshot');
    return undefined;
  }

  return allowStale || isCacheFresh(cache.savedAt, PROTOCOL_REVENUE_CACHE_TTL)
    ? cache
    : undefined;
};

const setCachedOverview = (cache: CachedProtocolRevenueSnapshot) => {
  PROTOCOL_REVENUE_NAMESPACE.set('snapshot', cache);
};

const getCachedDirectory = (allowStale = false) => {
  const cache = PROTOCOL_REVENUE_NAMESPACE.get<{
    items: LlamaProtocolDirectoryItem[];
    savedAt: number;
  }>('directory');
  if (!cache || cache.items.length === 0) return undefined;

  return allowStale || isCacheFresh(cache.savedAt, PROTOCOL_DIRECTORY_CACHE_TTL)
    ? cache.items
    : undefined;
};

const setCachedDirectory = (items: LlamaProtocolDirectoryItem[]) => {
  PROTOCOL_REVENUE_NAMESPACE.set('directory', {
    items,
    savedAt: Date.now(),
  });
};

const getDetailCacheKey = (slug: string, metric: RevenueMetricKey) =>
  `detail.${metric}.${slug}`;

const getCachedDetail = (
  slug: string,
  metric: RevenueMetricKey,
  allowStale = false,
) => {
  const cache = PROTOCOL_REVENUE_NAMESPACE.get<CachedProtocolDetail>(
    getDetailCacheKey(slug, metric),
  );
  if (!cache || cache.points.length === 0) return undefined;

  return allowStale || isCacheFresh(cache.savedAt, PROTOCOL_DETAIL_CACHE_TTL)
    ? cache
    : undefined;
};

const setCachedDetail = (
  slug: string,
  metric: RevenueMetricKey,
  cache: CachedProtocolDetail,
) => {
  PROTOCOL_REVENUE_NAMESPACE.set(getDetailCacheKey(slug, metric), cache);
};

const fetchJson = async <Response>(path: string) => {
  const response = await fetch(`${LLAMA_API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`DefiLlama returned ${response.status}`);
  }

  return (await response.json()) as Response;
};

const fetchProtocolDirectory = async () => {
  if (protocolDirectorySnapshot) return protocolDirectorySnapshot;

  const cachedDirectory = getCachedDirectory();
  if (cachedDirectory) {
    protocolDirectorySnapshot = cachedDirectory;
    return cachedDirectory;
  }

  const directory = await fetchJson<LlamaProtocolDirectoryItem[]>('/protocols');

  protocolDirectorySnapshot = directory;
  setCachedDirectory(directory);

  return directory;
};

const getOverviewProtocols = (
  response: LlamaOverviewResponse | LlamaOverviewProtocol[],
) => (Array.isArray(response) ? response : (response.protocols ?? []));

const getOverviewProtocolKey = (overviewProtocol: LlamaOverviewProtocol) =>
  toLookupKey(
    overviewProtocol.parentProtocol ??
      overviewProtocol.module ??
      overviewProtocol.name,
  );

const getProtocolMetric = (
  overviewProtocol: LlamaOverviewProtocol,
  timeframe: RevenueTimeframe,
): number => {
  if (timeframe === '24h') {
    return toFiniteNumber(overviewProtocol.total24h);
  }

  if (timeframe === '7d') {
    return toFiniteNumber(overviewProtocol.total7d);
  }

  return toFiniteNumber(overviewProtocol.total30d);
};

const createDirectoryLookup = (directory: LlamaProtocolDirectoryItem[]) => {
  const lookup = new Map<string, LlamaProtocolDirectoryItem>();

  directory.forEach((protocol) => {
    [protocol.slug, protocol.name].forEach((candidate) => {
      const lookupKey = toLookupKey(candidate);
      if (lookupKey) {
        lookup.set(lookupKey, protocol);
      }
    });
  });

  return lookup;
};

const normalizeProtocol = (
  feesOverviewProtocol: LlamaOverviewProtocol,
  revenueOverviewProtocol: LlamaOverviewProtocol | undefined,
  directoryLookup: Map<string, LlamaProtocolDirectoryItem>,
): TerminalProtocol | undefined => {
  const slugCandidate =
    feesOverviewProtocol.parentProtocol ??
    feesOverviewProtocol.module ??
    feesOverviewProtocol.name;
  const lookupProtocol = directoryLookup.get(toLookupKey(slugCandidate));
  const slug =
    lookupProtocol?.slug ??
    feesOverviewProtocol.parentProtocol ??
    feesOverviewProtocol.module;
  const name =
    lookupProtocol?.name ??
    feesOverviewProtocol.name ??
    feesOverviewProtocol.module;
  const detailSlug =
    feesOverviewProtocol.parentProtocol ?? feesOverviewProtocol.module ?? slug;

  if (
    !isValidProtocolIdentifier(slug) ||
    !name ||
    !isValidProtocolIdentifier(detailSlug)
  ) {
    return undefined;
  }

  const tvl = toFiniteNumber(lookupProtocol?.tvl);
  const fees24h = getProtocolMetric(feesOverviewProtocol, '24h');
  const fees7d = getProtocolMetric(feesOverviewProtocol, '7d');
  const fees30d = getProtocolMetric(feesOverviewProtocol, '30d');
  const revenue24h = revenueOverviewProtocol
    ? getProtocolMetric(revenueOverviewProtocol, '24h')
    : 0;
  const revenue7d = revenueOverviewProtocol
    ? getProtocolMetric(revenueOverviewProtocol, '7d')
    : 0;
  const revenue30d = revenueOverviewProtocol
    ? getProtocolMetric(revenueOverviewProtocol, '30d')
    : 0;
  const growth24h =
    normalizePercent(revenueOverviewProtocol?.change_1d) ||
    normalizePercent(feesOverviewProtocol.change_1d) ||
    computeGrowth(fees24h, toFiniteNumber(feesOverviewProtocol.total48hto24h));
  const growth7d =
    normalizePercent(revenueOverviewProtocol?.change_7d) ||
    normalizePercent(feesOverviewProtocol.change_7d) ||
    computeGrowth(fees7d, toFiniteNumber(feesOverviewProtocol.total14dto7d));
  const growth30d =
    normalizePercent(revenueOverviewProtocol?.change_1m) ||
    normalizePercent(feesOverviewProtocol.change_1m) ||
    computeGrowth(fees30d, toFiniteNumber(feesOverviewProtocol.total60dto30d));

  return {
    category:
      lookupProtocol?.category ?? feesOverviewProtocol.category ?? 'Other',
    chains: lookupProtocol?.chains?.length
      ? lookupProtocol.chains
      : feesOverviewProtocol.chains?.length
        ? feesOverviewProtocol.chains
        : ['Multi-chain'],
    detailSlug,
    feeCapture: fees30d > 0 ? revenue30d / fees30d : 0,
    fees24h,
    fees30d,
    fees7d,
    feesToTvl: tvl > 0 ? fees30d / tvl : 0,
    growth24h,
    growth30d,
    growth7d,
    id: `${detailSlug}:${lookupProtocol?.chains?.[0] ?? feesOverviewProtocol.chains?.[0] ?? 'multi'}:${slug}`,
    name,
    primaryChain:
      lookupProtocol?.chains?.[0] ??
      feesOverviewProtocol.chains?.[0] ??
      'Multi-chain',
    revenue24h,
    revenue30d,
    revenue7d,
    revenueToTvl: tvl > 0 ? revenue30d / tvl : 0,
    slug,
    symbol: lookupProtocol?.symbol ?? name.slice(0, 4).toUpperCase(),
    tvl,
  };
};

export const fetchProtocolRevenueSnapshot = async () => {
  const cachedSnapshot = getCachedOverview();
  if (cachedSnapshot) return cachedSnapshot;

  const requestKey = 'snapshot';
  const pendingRequest = overviewRequests.get(requestKey);
  if (pendingRequest) return pendingRequest;

  const request = Promise.all([
    fetchJson<LlamaOverviewResponse | LlamaOverviewProtocol[]>(
      '/overview/fees?dataType=dailyFees',
    ),
    fetchJson<LlamaOverviewResponse | LlamaOverviewProtocol[]>(
      '/overview/fees?dataType=dailyRevenue',
    ),
    fetchProtocolDirectory(),
  ])
    .then(([feesOverviewResponse, revenueOverviewResponse, directory]) => {
      const directoryLookup = createDirectoryLookup(directory);
      const revenueLookup = new Map(
        getOverviewProtocols(revenueOverviewResponse).map(
          (overviewProtocol) => [
            getOverviewProtocolKey(overviewProtocol),
            overviewProtocol,
          ],
        ),
      );
      const protocols = getOverviewProtocols(feesOverviewResponse)
        .map((overviewProtocol) =>
          normalizeProtocol(
            overviewProtocol,
            revenueLookup.get(getOverviewProtocolKey(overviewProtocol)),
            directoryLookup,
          ),
        )
        .filter((protocol): protocol is TerminalProtocol => Boolean(protocol))
        .sort((firstProtocol, secondProtocol) => {
          return secondProtocol.revenue30d - firstProtocol.revenue30d;
        })
        .map((protocol, index) => ({
          ...protocol,
          id: `${protocol.id}:${index}`,
        }))
        .slice(0, DEFAULT_PROTOCOL_LIMIT);

      const snapshot = {
        protocols,
        savedAt: Date.now(),
      } satisfies CachedProtocolRevenueSnapshot;

      setCachedOverview(snapshot);

      return snapshot;
    })
    .finally(() => {
      overviewRequests.delete(requestKey);
    });

  overviewRequests.set(requestKey, request);

  return request;
};

const normalizeChartPoints = (response: LlamaProtocolDetailResponse) => {
  return (response.totalDataChart ?? [])
    .map((entry) => {
      if (!Array.isArray(entry) || entry.length < 2) return undefined;

      const [timestamp, value] = entry;
      const normalizedTimestamp = toFiniteNumber(timestamp) * 1000;
      const normalizedValue = toFiniteNumber(value);

      if (!normalizedTimestamp || !Number.isFinite(normalizedValue)) {
        return undefined;
      }

      return {
        timestamp: normalizedTimestamp,
        value: normalizedValue,
      } satisfies TerminalChartPoint;
    })
    .filter((point): point is TerminalChartPoint => Boolean(point));
};

export const fetchProtocolMetricHistory = async (
  detailSlug: string,
  metric: RevenueMetricKey,
) => {
  const cachedDetail = getCachedDetail(detailSlug, metric);
  if (cachedDetail) return cachedDetail;

  const requestKey = `${metric}.${detailSlug}`;
  const pendingRequest = detailRequests.get(requestKey);
  if (pendingRequest) return pendingRequest;

  const dataType = metric === 'fees' ? 'dailyFees' : 'dailyRevenue';

  const request = fetchJson<LlamaProtocolDetailResponse>(
    `/summary/fees/${detailSlug}?dataType=${dataType}`,
  )
    .then((response) => {
      const cache = {
        points: normalizeChartPoints(response),
        savedAt: Date.now(),
      } satisfies CachedProtocolDetail;

      setCachedDetail(detailSlug, metric, cache);

      return cache;
    })
    .finally(() => {
      detailRequests.delete(requestKey);
    });

  detailRequests.set(requestKey, request);

  return request;
};

export const preloadProtocolRevenueTerminal = async () => {
  if (typeof window === 'undefined') return;

  const snapshot = await fetchProtocolRevenueSnapshot();
  const leadProtocol = snapshot.protocols[0];
  if (!leadProtocol) return;

  await Promise.allSettled([
    fetchProtocolMetricHistory(leadProtocol.detailSlug, 'fees'),
    fetchProtocolMetricHistory(leadProtocol.detailSlug, 'revenue'),
  ]);
};
