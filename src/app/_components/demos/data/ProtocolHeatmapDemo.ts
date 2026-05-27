import { createStorageNamespace } from '@/lib/storage';
import { toFiniteNumber } from '@/lib/utils';

const LLAMA_API_BASE_URL = 'https://api.llama.fi';
const PROTOCOL_REVENUE_NAMESPACE = createStorageNamespace(
  'local',
  'demos.protocol-heatmap.v5',
);
const PROTOCOL_REVENUE_CACHE_TTL = 60 * 60 * 1000;
const PROTOCOL_DIRECTORY_CACHE_TTL = 24 * 60 * 60 * 1000;
const DEFAULT_PROTOCOL_LIMIT = 50;
let protocolDirectorySnapshot: LlamaProtocolDirectoryItem[] | null = null;

type LlamaOverviewProtocol = {
  category?: string;
  change_1m?: number;
  chains?: string[];
  module?: string;
  name?: string;
  parentProtocol?: string;
  total30d?: number;
  total30dRevenue?: number;
  total60dto30d?: number;
  total60dto30dRevenue?: number;
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

type CachedProtocolRevenueSnapshot = {
  protocols: HeatmapProtocol[];
  savedAt: number;
};

export type HeatmapProtocol = {
  category: string;
  detailSlug: string;
  growth30d: number;
  id: string;
  name: string;
  primaryChain: string;
  revenue30d: number;
  slug: string;
  tvl: number;
};

const overviewRequests = new Map<
  string,
  Promise<CachedProtocolRevenueSnapshot>
>();

const isCacheFresh = (savedAt: number, ttl: number) =>
  Date.now() - savedAt < ttl;

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizePercent = (value: unknown) => {
  const numericValue = toFiniteNumber(value);
  return Math.abs(numericValue) <= 1.5 ? numericValue * 100 : numericValue;
};

const computeGrowth = (currentValue: number, previousValue: number) => {
  if (!previousValue) return 0;

  return ((currentValue - previousValue) / previousValue) * 100;
};

const toLookupKey = (value: string | undefined) =>
  value
    ?.trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') ?? '';

const toLookupKeys = (value: string | undefined): string[] => {
  if (!value) return [];

  const trimmedValue = value.trim().toLowerCase();
  const hyphenatedKey = toLookupKey(value);
  const compactKey = trimmedValue.replaceAll(/[^a-z0-9]+/g, '');
  const hashSuffix = trimmedValue.includes('#')
    ? trimmedValue.split('#').at(-1)
    : undefined;

  return [
    ...new Set(
      [
        hyphenatedKey,
        compactKey,
        toLookupKey(hashSuffix),
        hashSuffix?.replaceAll(/[^a-z0-9]+/g, ''),
      ].filter((lookupKey): lookupKey is string => Boolean(lookupKey)),
    ),
  ];
};

const isValidProtocolIdentifier = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.trim().toLowerCase() !== 'undefined'
  );
};

const isHeatmapProtocol = (value: unknown): value is HeatmapProtocol => {
  if (!isObjectRecord(value)) return false;

  return (
    isValidProtocolIdentifier(value.slug) &&
    isValidProtocolIdentifier(value.detailSlug) &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.primaryChain === 'string' &&
    typeof value.revenue30d === 'number' &&
    typeof value.growth30d === 'number' &&
    typeof value.tvl === 'number'
  );
};

const getCachedOverview = (allowStale = false) => {
  const cache =
    PROTOCOL_REVENUE_NAMESPACE.get<CachedProtocolRevenueSnapshot>('snapshot');
  if (!isObjectRecord(cache) || !Array.isArray(cache.protocols)) {
    PROTOCOL_REVENUE_NAMESPACE.remove('snapshot');
    return undefined;
  }

  if (cache.protocols.length === 0) return undefined;
  if (!cache.protocols.every(isHeatmapProtocol)) {
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
  if (!isObjectRecord(cache) || !Array.isArray(cache.items)) {
    PROTOCOL_REVENUE_NAMESPACE.remove('directory');
    return undefined;
  }

  if (cache.items.length === 0) return undefined;

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

const getProtocolRevenue30d = (protocol: LlamaOverviewProtocol) =>
  toFiniteNumber(protocol.total30dRevenue) || toFiniteNumber(protocol.total30d);

const getProtocolPreviousRevenue30d = (protocol: LlamaOverviewProtocol) =>
  toFiniteNumber(protocol.total60dto30dRevenue) ||
  toFiniteNumber(protocol.total60dto30d);

const createDirectoryLookup = (directory: LlamaProtocolDirectoryItem[]) => {
  const lookup = new Map<string, LlamaProtocolDirectoryItem>();

  directory.forEach((protocol) => {
    [protocol.slug, protocol.name, protocol.symbol].forEach((candidate) => {
      toLookupKeys(candidate).forEach((lookupKey) => {
        lookup.set(lookupKey, protocol);
      });
    });
  });

  return lookup;
};

const resolveDirectoryProtocol = (
  directoryLookup: Map<string, LlamaProtocolDirectoryItem>,
  candidates: Array<string | undefined>,
) => {
  for (const candidate of candidates) {
    const protocol = toLookupKeys(candidate)
      .map((lookupKey) => directoryLookup.get(lookupKey))
      .find((lookupProtocol): lookupProtocol is LlamaProtocolDirectoryItem =>
        Boolean(lookupProtocol),
      );

    if (protocol) return protocol;
  }

  return undefined;
};

const normalizeProtocol = (
  overviewProtocol: LlamaOverviewProtocol,
  directoryLookup: Map<string, LlamaProtocolDirectoryItem>,
): HeatmapProtocol | undefined => {
  const lookupProtocol = resolveDirectoryProtocol(directoryLookup, [
    overviewProtocol.parentProtocol,
    overviewProtocol.module,
    overviewProtocol.name,
  ]);
  const slug =
    lookupProtocol?.slug ??
    overviewProtocol.parentProtocol ??
    overviewProtocol.module;
  const name =
    lookupProtocol?.name ?? overviewProtocol.name ?? overviewProtocol.module;
  const detailSlug =
    overviewProtocol.parentProtocol ?? overviewProtocol.module ?? slug;

  if (
    !isValidProtocolIdentifier(slug) ||
    !name ||
    !isValidProtocolIdentifier(detailSlug)
  ) {
    return undefined;
  }

  const revenue30d = getProtocolRevenue30d(overviewProtocol);
  if (revenue30d <= 0) return undefined;

  const tvl = toFiniteNumber(lookupProtocol?.tvl);
  const growth30d =
    normalizePercent(overviewProtocol.change_1m) ||
    computeGrowth(revenue30d, getProtocolPreviousRevenue30d(overviewProtocol));

  return {
    category: lookupProtocol?.category ?? overviewProtocol.category ?? 'Other',
    detailSlug,
    growth30d,
    id: `${detailSlug}:${lookupProtocol?.chains?.[0] ?? overviewProtocol.chains?.[0] ?? 'multi'}:${slug}`,
    name,
    primaryChain:
      lookupProtocol?.chains?.[0] ??
      overviewProtocol.chains?.[0] ??
      'Multi-chain',
    revenue30d,
    slug,
    tvl,
  };
};

export const fetchProtocolRevenueSnapshot = async () => {
  const cachedSnapshot = getCachedOverview();
  if (cachedSnapshot) return cachedSnapshot;

  const requestKey = 'snapshot';
  const pendingRequest = overviewRequests.get(requestKey);
  if (pendingRequest) return pendingRequest;

  if (typeof window !== 'undefined') {
    const request = fetch('/api/demos/protocol-heatmap')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Protocol heatmap API returned ${response.status}`);
        }

        return response.json() as Promise<CachedProtocolRevenueSnapshot>;
      })
      .then((snapshot) => {
        setCachedOverview(snapshot);
        return snapshot;
      })
      .finally(() => {
        overviewRequests.delete(requestKey);
      });

    overviewRequests.set(requestKey, request);

    return request;
  }

  const request = Promise.all([
    fetchJson<LlamaOverviewResponse | LlamaOverviewProtocol[]>(
      '/overview/fees?dataType=dailyRevenue',
    ),
    fetchProtocolDirectory(),
  ])
    .then(([revenueOverviewResponse, directory]) => {
      const directoryLookup = createDirectoryLookup(directory);
      const protocols = getOverviewProtocols(revenueOverviewResponse)
        .map((overviewProtocol) =>
          normalizeProtocol(overviewProtocol, directoryLookup),
        )
        .filter((protocol): protocol is HeatmapProtocol => Boolean(protocol))
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

export const preloadProtocolHeatmapDemo = async () => {
  if (typeof window === 'undefined') return;

  await fetchProtocolRevenueSnapshot();
};
