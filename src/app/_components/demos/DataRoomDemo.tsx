'use client';

import type {
  DemoComponentProps,
  DemoTrack,
} from '@/app/_components/demos/types';
import { UI_TIMINGS } from '@/lib/constants';
import {
  type RevenueMetricKey,
  type RevenueTimeframe,
  fetchProtocolMetricHistory,
  fetchProtocolRevenueSnapshot,
  preloadProtocolRevenueTerminal as preloadProtocolRevenueTerminalData,
  type TerminalChartPoint,
  type TerminalProtocol,
} from '@/lib/protocol-revenue-terminal';
import { useDebouncedActivation } from '@/lib/use-debounced-activation';
import { cn } from '@/lib/utils';
import { BarChart3, Loader2, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const DEFAULT_CHAIN_FILTER = 'All chains';
const DEFAULT_CATEGORY_FILTER = 'All categories';
const DEFAULT_TIMEFRAME: RevenueTimeframe = '30d';
const DEFAULT_METRIC: RevenueMetricKey = 'revenue';
const TREEMAP_PROTOCOL_COUNT = 12;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
});

const ratioFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  style: 'percent',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  signDisplay: 'always',
  style: 'percent',
});

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
});

const dataRoomContent = {
  detail:
    'Protocol revenue, fee capture and TVL efficiency from DefiLlama’s free API.',
  eyebrow: 'Public API dashboard',
  icon: BarChart3,
  id: 'data-room',
  label: 'Protocol Revenue Terminal',
  metrics: ['Fees', 'Revenue', 'TVL'],
  title: 'A dense terminal for crypto protocol fundamentals.',
};

export const preloadProtocolRevenueTerminal = async () => {
  await preloadProtocolRevenueTerminalData();
};

type ProtocolMetricHistory = {
  fees: TerminalChartPoint[];
  revenue: TerminalChartPoint[];
};

const timeframeOptions: {
  id: RevenueTimeframe;
  label: string;
}[] = [
  { id: '24h', label: '24H' },
  { id: '7d', label: '7D' },
  { id: '30d', label: '30D' },
];

const chartMetricOptions: {
  id: RevenueMetricKey;
  label: string;
}[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'fees', label: 'Fees' },
];

const TILE_SPARKLINE_KEYS = ['day', 'week', 'month'] as const;

const getProtocolMetricValue = (
  protocol: TerminalProtocol,
  metric: RevenueMetricKey,
  timeframe: RevenueTimeframe,
) => {
  if (metric === 'fees') {
    if (timeframe === '24h') return protocol.fees24h;
    if (timeframe === '7d') return protocol.fees7d;
    return protocol.fees30d;
  }

  if (timeframe === '24h') return protocol.revenue24h;
  if (timeframe === '7d') return protocol.revenue7d;
  return protocol.revenue30d;
};

const getGrowthValue = (
  protocol: TerminalProtocol,
  timeframe: RevenueTimeframe,
) => {
  if (timeframe === '24h') return protocol.growth24h;
  if (timeframe === '7d') return protocol.growth7d;
  return protocol.growth30d;
};

const formatCurrency = (value: number) => currencyFormatter.format(value);
const _formatCompactNumber = (value: number) =>
  compactNumberFormatter.format(value);
const formatRatio = (value: number) => ratioFormatter.format(value);
const formatGrowth = (value: number) => percentFormatter.format(value / 100);

const getTileTone = (
  protocol: TerminalProtocol,
  timeframe: RevenueTimeframe,
) => {
  const growth = getGrowthValue(protocol, timeframe);

  if (growth >= 12) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';
  }

  if (growth <= -12) {
    return 'border-rose-500/30 bg-rose-500/10 text-rose-100';
  }

  if (protocol.feeCapture < 0.18) {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-100';
  }

  return 'border-primary/30 bg-primary/10 text-foreground';
};

const getProtocolRenderKey = (protocol: TerminalProtocol) =>
  [
    protocol.id,
    protocol.name,
    protocol.primaryChain,
    protocol.category,
    protocol.revenue30d,
    protocol.fees30d,
  ].join(':');

const getMetricRibbon = (protocols: TerminalProtocol[]) => {
  const totalRevenue30d = protocols.reduce(
    (sum, protocol) => sum + protocol.revenue30d,
    0,
  );
  const totalFees30d = protocols.reduce(
    (sum, protocol) => sum + protocol.fees30d,
    0,
  );
  const totalTvl = protocols.reduce((sum, protocol) => sum + protocol.tvl, 0);
  const topChain =
    [...protocols]
      .sort((firstProtocol, secondProtocol) => {
        return secondProtocol.revenue30d - firstProtocol.revenue30d;
      })
      .at(0)?.primaryChain ?? 'N/A';

  const chainTotals = new Map<string, number>();
  protocols.forEach((protocol) => {
    const currentRevenue = chainTotals.get(protocol.primaryChain) ?? 0;
    chainTotals.set(
      protocol.primaryChain,
      currentRevenue + protocol.revenue30d,
    );
  });

  const dominantChain =
    [...chainTotals.entries()].sort((firstEntry, secondEntry) => {
      return secondEntry[1] - firstEntry[1];
    })[0]?.[0] ?? topChain;

  return [
    {
      label: '30D revenue',
      value: formatCurrency(totalRevenue30d),
    },
    {
      label: '30D fees',
      value: formatCurrency(totalFees30d),
    },
    {
      label: 'Tracked TVL',
      value: formatCurrency(totalTvl),
    },
    {
      label: 'Dominant chain',
      value: dominantChain,
    },
  ];
};

const buildChartPath = (
  points: TerminalChartPoint[],
  width: number,
  height: number,
) => {
  if (points.length < 2) return '';

  const minTimestamp = points[0]?.timestamp ?? 0;
  const maxTimestamp = points.at(-1)?.timestamp ?? minTimestamp + 1;
  const minValue = Math.min(...points.map((point) => point.value));
  const maxValue = Math.max(...points.map((point) => point.value));
  const yDomain = maxValue - minValue || 1;
  const xDomain = maxTimestamp - minTimestamp || 1;

  return points
    .map((point, index) => {
      const x = ((point.timestamp - minTimestamp) / xDomain) * width;
      const y = height - ((point.value - minValue) / yDomain) * height;

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
};

const TreemapTile = ({
  isDimmed,
  isSelected,
  onHoverEnd,
  onHoverStart,
  onSelect,
  protocol,
  timeframe,
  totalValue,
}: {
  isDimmed: boolean;
  isSelected: boolean;
  onHoverEnd: () => void;
  onHoverStart: () => void;
  onSelect: (protocolId: string) => void;
  protocol: TerminalProtocol;
  timeframe: RevenueTimeframe;
  totalValue: number;
}) => {
  const currentValue = getProtocolMetricValue(protocol, 'revenue', timeframe);
  const weight = totalValue > 0 ? currentValue / totalValue : 0;
  const columnSpan = Math.min(12, Math.max(3, Math.round(weight * 28)));
  const rowSpan = Math.min(8, Math.max(2, Math.round(weight * 18)));

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        'relative flex min-h-24 flex-col justify-between overflow-hidden border p-3 text-left transition-all duration-200',
        getTileTone(protocol, timeframe),
        {
          'opacity-35': isDimmed,
          'ring-1 ring-primary/50': isSelected,
        },
      )}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={() => onSelect(protocol.id)}
      style={{
        gridColumn: `span ${columnSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
      type="button"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="font-anton text-muted-foreground text-xs uppercase tracking-wide">
            {protocol.primaryChain}
          </span>
          <h4 className="truncate font-anton text-2xl leading-none">
            {protocol.name}
          </h4>
        </div>
        <span className="shrink-0 font-anton text-muted-foreground text-xs uppercase">
          {protocol.category}
        </span>
      </div>

      <div className="relative mt-3 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-anton text-3xl leading-none">
            {formatCurrency(currentValue)}
          </span>
          <span className="font-anton text-muted-foreground text-sm">
            {formatGrowth(getGrowthValue(protocol, timeframe))}
          </span>
        </div>
        <div className="h-10 rounded-sm border border-white/10 bg-black/10 p-2 dark:bg-white/5">
          <div className="flex h-full items-end gap-1">
            {[
              protocol.revenue24h,
              protocol.revenue7d / 7,
              protocol.revenue30d / 30,
            ].map((value, index) => (
              <span
                className="flex-1 rounded-sm bg-current/45"
                key={`${protocol.slug}-${TILE_SPARKLINE_KEYS[index]}`}
                style={{
                  height: `${Math.max(
                    18,
                    Math.min(
                      100,
                      (value /
                        Math.max(
                          protocol.revenue24h,
                          protocol.revenue7d / 7,
                          protocol.revenue30d / 30,
                          1,
                        )) *
                        100,
                    ),
                  )}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};

const ChartPanel = ({
  chartMetric,
  history,
  protocol,
  setChartMetric,
}: {
  chartMetric: RevenueMetricKey;
  history: ProtocolMetricHistory;
  protocol: TerminalProtocol | undefined;
  setChartMetric: (metric: RevenueMetricKey) => void;
}) => {
  const points = history[chartMetric];
  const path = useMemo(() => buildChartPath(points, 900, 180), [points]);

  return (
    <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_19rem] border border-foreground/10 bg-background-light max-lg:grid-cols-1">
      <div className="min-h-0 border-foreground/10 border-r p-4 max-lg:border-r-0 max-lg:border-b">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="font-anton text-muted-foreground text-xs uppercase">
              {protocol?.name ?? 'Protocol detail'}
            </span>
            <h4 className="mt-1 font-anton text-2xl leading-none">
              {protocol ? `${protocol.name} history` : 'Waiting for selection'}
            </h4>
          </div>
          <div className="flex border border-foreground/10">
            {chartMetricOptions.map((option) => (
              <button
                aria-pressed={chartMetric === option.id}
                className={cn(
                  'h-9 border-foreground/10 border-l px-3 font-anton text-xs uppercase transition-colors first:border-l-0',
                  chartMetric === option.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-foreground hover:text-background',
                )}
                key={option.id}
                onClick={() => setChartMetric(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 h-48 border border-foreground/10 bg-background p-3">
          {points.length > 1 ? (
            <svg
              aria-hidden="true"
              className="h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 900 180"
            >
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground text-sm">
              Historical series unavailable for this protocol.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <span className="font-anton text-muted-foreground text-xs uppercase">
            Current profile
          </span>
          <div className="mt-3 grid gap-3">
            {protocol ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-sm">
                    30D revenue
                  </span>
                  <span className="font-anton text-lg">
                    {formatCurrency(protocol.revenue30d)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-sm">
                    30D fees
                  </span>
                  <span className="font-anton text-lg">
                    {formatCurrency(protocol.fees30d)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-sm">TVL</span>
                  <span className="font-anton text-lg">
                    {formatCurrency(protocol.tvl)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-sm">
                    Revenue / TVL
                  </span>
                  <span className="font-anton text-lg">
                    {formatRatio(protocol.revenueToTvl)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-sm">
                    Fee capture
                  </span>
                  <span className="font-anton text-lg">
                    {formatRatio(protocol.feeCapture)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Select a protocol to inspect its trailing fees and revenue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DataRoomDemo = ({ isActive = false }: DemoComponentProps) => {
  const [activeChain, setActiveChain] = useState(DEFAULT_CHAIN_FILTER);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY_FILTER);
  const [activeProtocolId, setActiveProtocolId] = useState<string>();
  const [chartMetric, setChartMetric] =
    useState<RevenueMetricKey>(DEFAULT_METRIC);
  const [error, setError] = useState<string>();
  const [history, setHistory] = useState<ProtocolMetricHistory>({
    fees: [],
    revenue: [],
  });
  const [hoveredProtocolId, setHoveredProtocolId] = useState<string>();
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [protocols, setProtocols] = useState<TerminalProtocol[]>([]);
  const [timeframe, setTimeframe] =
    useState<RevenueTimeframe>(DEFAULT_TIMEFRAME);
  const { hasMounted, isVisible } = useDebouncedActivation(isActive, {
    delayMs: UI_TIMINGS.demoTabVisibilityDelayMs,
  });

  useEffect(() => {
    let ignoreRequest = false;

    fetchProtocolRevenueSnapshot()
      .then((snapshot) => {
        if (ignoreRequest) return;

        setProtocols(snapshot.protocols);
        setActiveProtocolId(
          (currentId) => currentId ?? snapshot.protocols[0]?.id,
        );
      })
      .catch(() => {
        if (ignoreRequest) return;

        setError('DefiLlama revenue data unavailable. Try again in a moment.');
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

  const chainOptions = useMemo(() => {
    return [
      DEFAULT_CHAIN_FILTER,
      ...new Set(protocols.map((protocol) => protocol.primaryChain)),
    ];
  }, [protocols]);

  const categoryOptions = useMemo(() => {
    return [
      DEFAULT_CATEGORY_FILTER,
      ...new Set(protocols.map((protocol) => protocol.category)),
    ];
  }, [protocols]);

  const filteredProtocols = useMemo(() => {
    return protocols.filter((protocol) => {
      const matchesChain =
        activeChain === DEFAULT_CHAIN_FILTER ||
        protocol.primaryChain === activeChain;
      const matchesCategory =
        activeCategory === DEFAULT_CATEGORY_FILTER ||
        protocol.category === activeCategory;

      return matchesChain && matchesCategory;
    });
  }, [activeCategory, activeChain, protocols]);

  const sortedProtocols = useMemo(() => {
    return [...filteredProtocols].sort((firstProtocol, secondProtocol) => {
      return (
        getProtocolMetricValue(secondProtocol, 'revenue', timeframe) -
        getProtocolMetricValue(firstProtocol, 'revenue', timeframe)
      );
    });
  }, [filteredProtocols, timeframe]);

  const treemapProtocols = sortedProtocols.slice(0, TREEMAP_PROTOCOL_COUNT);
  const totalTreemapRevenue = treemapProtocols.reduce((sum, protocol) => {
    return sum + getProtocolMetricValue(protocol, 'revenue', timeframe);
  }, 0);
  const selectedProtocol =
    sortedProtocols.find((protocol) => protocol.id === activeProtocolId) ??
    sortedProtocols[0];
  const selectedProtocolDetailSlug = selectedProtocol?.detailSlug ?? '';
  const metricRibbon = getMetricRibbon(filteredProtocols);

  useEffect(() => {
    if (!selectedProtocolDetailSlug) return;

    let ignoreRequest = false;
    queueMicrotask(() => {
      if (!ignoreRequest) {
        setIsHistoryLoading(true);
      }
    });

    Promise.all([
      fetchProtocolMetricHistory(selectedProtocolDetailSlug, 'fees'),
      fetchProtocolMetricHistory(selectedProtocolDetailSlug, 'revenue'),
    ])
      .then(([feesHistory, revenueHistory]) => {
        if (ignoreRequest) return;

        setHistory({
          fees: feesHistory.points,
          revenue: revenueHistory.points,
        });
      })
      .finally(() => {
        if (!ignoreRequest) {
          setIsHistoryLoading(false);
        }
      });

    return () => {
      ignoreRequest = true;
    };
  }, [selectedProtocolDetailSlug]);

  if (!hasMounted) return null;

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden transition-opacity duration-150"
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {isLoading ? (
        <div className="grid h-full place-items-center border border-foreground/10 bg-background-light">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : error ? (
        <div className="grid h-full place-items-center border border-foreground/10 bg-background-light px-6 text-center">
          <span className="max-w-96 text-muted-foreground">{error}</span>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col border border-foreground/10 bg-background-light">
          <div className="flex flex-wrap items-start justify-between gap-4 border-foreground/10 border-b px-4 py-3">
            <div>
              <span className="font-anton text-muted-foreground text-xs uppercase">
                DefiLlama free API
              </span>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <strong className="font-anton text-4xl leading-none md:text-5xl">
                  Protocol Revenue Terminal
                </strong>
                <span className="font-anton text-lg text-muted-foreground">
                  Where crypto economic activity is flowing
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 border border-foreground/10 bg-background px-3 font-anton text-sm outline-none"
                onChange={(event) => setActiveChain(event.target.value)}
                value={activeChain}
              >
                {chainOptions.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </select>
              <select
                className="h-10 border border-foreground/10 bg-background px-3 font-anton text-sm outline-none"
                onChange={(event) => setActiveCategory(event.target.value)}
                value={activeCategory}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="flex border border-foreground/10">
                {timeframeOptions.map((option) => (
                  <button
                    aria-pressed={timeframe === option.id}
                    className={cn(
                      'h-10 border-foreground/10 border-l px-3 font-anton text-xs uppercase transition-colors first:border-l-0',
                      timeframe === option.id
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-foreground hover:text-background',
                    )}
                    key={option.id}
                    onClick={() => setTimeframe(option.id)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-px border-foreground/10 border-b bg-foreground/10">
            {metricRibbon.map((metric) => (
              <div className="bg-background px-4 py-3" key={metric.label}>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  {metric.label}
                </span>
                <p className="mt-2 font-anton text-2xl leading-none">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.45fr)_20rem] border-foreground/10 border-b max-lg:grid-cols-1">
            <div className="min-h-0 border-foreground/10 border-r p-3 max-lg:border-r-0 max-lg:border-b">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-anton text-muted-foreground text-xs uppercase">
                    Revenue heatmap
                  </span>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Size = {timeframe} revenue. Tone = growth and fee capture.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <TrendingUp size={14} />
                  Hover dims unrelated protocols
                </div>
              </div>

              <div className="grid h-92 auto-rows-[3rem] grid-cols-12 gap-2">
                {treemapProtocols.map((protocol) => {
                  const isSelected = protocol.id === selectedProtocol?.id;
                  const isDimmed =
                    Boolean(hoveredProtocolId) &&
                    hoveredProtocolId !== protocol.id;

                  return (
                    <TreemapTile
                      isDimmed={isDimmed}
                      isSelected={isSelected}
                      key={`treemap:${getProtocolRenderKey(protocol)}`}
                      onHoverEnd={() => setHoveredProtocolId(undefined)}
                      onHoverStart={() => setHoveredProtocolId(protocol.id)}
                      onSelect={setActiveProtocolId}
                      protocol={protocol}
                      timeframe={timeframe}
                      totalValue={totalTreemapRevenue}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex min-h-0 flex-col">
              <div className="border-foreground/10 border-b px-4 py-3">
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Top protocols
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {sortedProtocols.slice(0, 8).map((protocol, index) => (
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 border-foreground/10 border-b px-4 py-3 text-left transition-colors hover:bg-foreground hover:text-background',
                      {
                        'bg-foreground text-background':
                          protocol.id === selectedProtocol?.id,
                      },
                    )}
                    key={`list:${getProtocolRenderKey(protocol)}`}
                    onClick={() => setActiveProtocolId(protocol.id)}
                    type="button"
                  >
                    <span className="font-anton text-muted-foreground text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="grid size-10 place-items-center border border-current/15 font-anton text-sm">
                      {protocol.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-anton text-lg leading-none">
                        {protocol.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-muted-foreground text-xs uppercase">
                        <span>{protocol.primaryChain}</span>
                        <span>{protocol.category}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-anton text-lg leading-none">
                        {formatCurrency(
                          getProtocolMetricValue(
                            protocol,
                            'revenue',
                            timeframe,
                          ),
                        )}
                      </div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        {formatGrowth(getGrowthValue(protocol, timeframe))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative min-h-0">
            {isHistoryLoading ? (
              <div className="absolute inset-0 grid place-items-center bg-background-light/90">
                <Loader2 className="animate-spin text-primary" size={22} />
              </div>
            ) : null}
            <ChartPanel
              chartMetric={chartMetric}
              history={history}
              protocol={selectedProtocol}
              setChartMetric={setChartMetric}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const dataRoomDemo = {
  ...dataRoomContent,
  Component: DataRoomDemo,
  preload: preloadProtocolRevenueTerminal,
} satisfies DemoTrack;
