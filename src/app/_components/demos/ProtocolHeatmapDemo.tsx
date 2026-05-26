'use client';

import type {
  DemoComponentProps,
  DemoTrack,
} from '@/app/_components/demos/types';
import {
  fetchProtocolMetricHistory,
  fetchProtocolRevenueSnapshot,
  preloadProtocolRevenueTerminal,
  type TerminalChartPoint,
  type TerminalProtocol,
} from '@/app/_components/demos/data/ProtocolHeatmapDemo';
import { useDebouncedActivation } from '@/hooks/use-debounced-activation';
import { THEME_VALUES, UI_TIMINGS } from '@/lib/constants';
import { useThemePreference } from '@/lib/theme-preference';
import type {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import { TreemapChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart3, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

echarts.use([TreemapChart, TooltipComponent, CanvasRenderer]);

const TREEMAP_PROTOCOL_COUNT = 24;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  signDisplay: 'always',
  style: 'percent',
});

const protocolHeatmapContent = {
  detail:
    'Protocol revenue, fee capture and TVL efficiency from DefiLlama’s free API.',
  eyebrow: 'Protocol Heatmap',
  icon: BarChart3,
  id: 'protocol-heatmap',
  label: 'Protocol Heatmap',
  metrics: ['Revenue', 'TVL', 'Growth'],
  title: 'A dense terminal for crypto protocol fundamentals.',
};

type ProtocolMetricHistory = {
  protocolId?: string;
  revenue: TerminalChartPoint[];
};

const EMPTY_HISTORY: ProtocolMetricHistory = {
  revenue: [],
};

type ThemePalette = {
  detailGradient: string;
  divider: string;
  primary: string;
  primarySoft: string;
  surfaceBorder: string;
  textMuted: string;
  textPrimary: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tileBorder: string;
  tileColor: (intensity: number) => string;
};

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatGrowth = (value: number) => percentFormatter.format(value / 100);

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const getConsistencyScore = (points: TerminalChartPoint[]) => {
  if (points.length < 4) return 50;

  const values = points.slice(-30).map((point) => point.value);
  const mean =
    values.reduce((sum, value) => sum + value, 0) / values.length || 1;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;

  return clampScore(100 - coefficientOfVariation * 100);
};

const getThemePalette = (isDarkMode: boolean): ThemePalette => {
  if (isDarkMode) {
    return {
      detailGradient:
        'linear-gradient(180deg, hsl(0 0% 9% / 0.96) 0%, hsl(196 100% 78% / 0.08) 100%)',
      divider: 'hsl(196 100% 78% / 0.12)',
      primary: 'hsl(196 100% 78%)',
      primarySoft: 'hsl(196 100% 78% / 0.16)',
      surfaceBorder: 'hsl(196 100% 78% / 0.26)',
      textMuted: 'hsl(0 0% 71% / 0.78)',
      textPrimary: 'hsl(0 0% 94%)',
      tileBorder: 'hsl(196 100% 78% / 0.22)',
      tooltipBackground: 'hsl(0 0% 9% / 0.98)',
      tooltipBorder: 'hsl(196 100% 78% / 0.36)',
      tileColor: (intensity) => `hsl(196 100% ${12 + intensity * 24}%)`,
    };
  }

  return {
    detailGradient:
      'linear-gradient(180deg, hsl(42 78% 96% / 0.98) 0%, hsl(24 100% 56% / 0.08) 100%)',
    divider: 'hsl(24 38% 8% / 0.12)',
    primary: 'hsl(24 100% 56%)',
    primarySoft: 'hsl(24 100% 56% / 0.14)',
    surfaceBorder: 'hsl(24 100% 56% / 0.24)',
    textMuted: 'hsl(24 18% 32% / 0.82)',
    textPrimary: 'hsl(24 38% 8%)',
    tileBorder: 'hsl(24 100% 56% / 0.22)',
    tooltipBackground: 'hsl(42 78% 97% / 0.99)',
    tooltipBorder: 'hsl(24 100% 56% / 0.32)',
    tileColor: (intensity) => `hsl(24 100% ${96 - intensity * 28}%)`,
  };
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

type TreemapDataParams = {
  data?: {
    chainLabel?: string;
    protocolId?: string;
    revenueLabel?: string;
  };
};

type TreemapNodeData = NonNullable<TreemapDataParams['data']>;

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="border-foreground/10 border-t py-3 first:border-t-0">
    <span className="font-anton text-[10px] text-muted-foreground uppercase">
      {label}
    </span>
    <p className="mt-1.5 font-anton text-2xl leading-none sm:text-[1.75rem]">
      {value}
    </p>
  </div>
);

const ProtocolHeatmapDemo = ({ isActive = false }: DemoComponentProps) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [protocolHistory, setProtocolHistory] =
    useState<ProtocolMetricHistory>(EMPTY_HISTORY);
  const [protocols, setProtocols] = useState<TerminalProtocol[]>([]);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>();
  const { theme } = useThemePreference();
  const isDarkMode = theme === THEME_VALUES.dark;
  const palette = useMemo(() => getThemePalette(isDarkMode), [isDarkMode]);
  const { hasMounted, isVisible } = useDebouncedActivation(isActive, {
    delayMs: UI_TIMINGS.demoTabVisibilityDelayMs,
  });

  useEffect(() => {
    let ignoreRequest = false;

    fetchProtocolRevenueSnapshot()
      .then((snapshot) => {
        if (ignoreRequest) return;
        setProtocols(snapshot.protocols);
        setSelectedProtocolId((currentSelectedProtocolId) => {
          return currentSelectedProtocolId ?? snapshot.protocols[0]?.id;
        });
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

  const treemapProtocols = useMemo(() => {
    return [...protocols]
      .sort((firstProtocol, secondProtocol) => {
        return secondProtocol.revenue30d - firstProtocol.revenue30d;
      })
      .slice(0, TREEMAP_PROTOCOL_COUNT);
  }, [protocols]);

  const selectedProtocol = useMemo(
    () =>
      selectedProtocolId
        ? treemapProtocols.find(
            (protocol) => protocol.id === selectedProtocolId,
          )
        : treemapProtocols[0],
    [selectedProtocolId, treemapProtocols],
  );
  const activeRevenueHistory =
    protocolHistory.protocolId === selectedProtocol?.id
      ? protocolHistory.revenue
      : EMPTY_HISTORY.revenue;
  const protocolsById = useMemo(
    () =>
      new Map(
        treemapProtocols.map((protocol) => [protocol.id, protocol] as const),
      ),
    [treemapProtocols],
  );
  const shouldShowDetailLoading =
    isLoadingDetail ||
    Boolean(
      selectedProtocol && protocolHistory.protocolId !== selectedProtocol.id,
    );

  useEffect(() => {
    if (!selectedProtocol) return;

    let ignoreRequest = false;

    fetchProtocolMetricHistory(selectedProtocol.detailSlug)
      .then((revenueHistory) => {
        if (ignoreRequest) return;
        setProtocolHistory({
          protocolId: selectedProtocol.id,
          revenue: revenueHistory.points,
        });
      })
      .catch(() => {
        if (ignoreRequest) return;
        setProtocolHistory({
          protocolId: selectedProtocol.id,
          revenue: [],
        });
        setError('Protocol detail unavailable. Try again in a moment.');
      })
      .finally(() => {
        if (!ignoreRequest) {
          setIsLoadingDetail(false);
        }
      });

    return () => {
      ignoreRequest = true;
    };
  }, [selectedProtocol]);

  const businessScore = useMemo(() => {
    if (!selectedProtocol) return 0;

    const revenueGrowthScore = clampScore(50 + selectedProtocol.growth30d * 2);
    const revenue30dScore = clampScore(
      Math.log10(Math.max(selectedProtocol.revenue30d, 1)) * 18,
    );
    const revenueConsistencyScore = getConsistencyScore(activeRevenueHistory);
    const revenueToTvlScore = clampScore(selectedProtocol.revenueToTvl * 1000);

    return Math.round(
      revenue30dScore * 0.25 +
        revenueGrowthScore * 0.3 +
        revenueConsistencyScore * 0.25 +
        revenueToTvlScore * 0.2,
    );
  }, [activeRevenueHistory, selectedProtocol]);

  const chartOption = useMemo<EChartsOption>(() => {
    const maxRevenue = Math.max(
      ...treemapProtocols.map((protocol) => protocol.revenue30d),
      1,
    );

    return {
      animation: false,
      animationDuration: 0,
      animationDurationUpdate: 0,
      backgroundColor: 'transparent',
      series: [
        {
          animation: false,
          animationDuration: 0,
          animationDurationUpdate: 0,
          breadcrumb: { show: false },
          roam: false,
          nodeClick: false,
          data: treemapProtocols.map((protocol) => {
            const intensity = Math.max(
              0.16,
              Math.min(1, protocol.revenue30d / maxRevenue),
            );
            return {
              chainLabel: protocol.primaryChain,
              id: protocol.id,
              itemStyle: {
                borderColor: palette.tileBorder,
                borderWidth: 1.2,
                color: palette.tileColor(intensity),
                gapWidth: 6,
              },
              name: protocol.name,
              protocolId: protocol.id,
              revenueLabel: formatCurrency(protocol.revenue30d),
              value: Math.max(protocol.revenue30d, 1),
            };
          }),
          emphasis: {
            itemStyle: {
              color: palette.primarySoft,
              borderColor: palette.primary,
              borderWidth: 2,
              shadowBlur: 0,
            },
            label: {
              color: palette.textPrimary,
            },
          },
          itemStyle: {
            borderJoin: 'round',
          },
          label: {
            color: palette.textPrimary,
            fontFamily: 'var(--font-anton)',
            fontSize: 16,
            formatter: (params) => {
              const data = params.data as TreemapNodeData | undefined;

              return [
                data?.protocolId ? params.name : undefined,
                data?.chainLabel,
                data?.revenueLabel,
              ]
                .filter(Boolean)
                .join('\n');
            },
            lineHeight: 19,
            overflow: 'truncate',
            padding: [8, 8, 8, 8],
            show: true,
          },
          leafDepth: 1,
          sort: 'desc',
          type: 'treemap',
          visibleMin: 1,
        },
      ],
      tooltip: {
        appendToBody: true,
        backgroundColor: palette.tooltipBackground,
        borderColor: palette.tooltipBorder,
        borderWidth: 1,
        className: 'protocol-heatmap-tooltip',
        extraCssText: 'box-shadow:none;border-radius:0;padding:12px 14px;',
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          if (Array.isArray(params)) return '';

          const protocolId = (params as TreemapDataParams).data?.protocolId;
          const protocol = protocolId
            ? protocolsById.get(protocolId)
            : undefined;
          if (!protocol) return '';

          const name = escapeHtml(protocol.name);
          const chain = escapeHtml(protocol.primaryChain);
          const category = escapeHtml(protocol.category);

          return `
            <div style="min-width: 12rem; font-family: var(--font-roboto-flex), sans-serif; color: ${palette.textPrimary};">
              <div style="font-family: var(--font-anton), sans-serif; font-size: 1.05rem; line-height: 1; color: ${palette.textPrimary};">
                ${name}
              </div>
              <div style="margin-top: 0.35rem; font-size: 0.72rem; color: ${palette.textMuted}; text-transform: uppercase;">
                ${chain} · ${category}
              </div>
              <div style="margin-top: 0.75rem; display: grid; gap: 0.4rem; font-size: 0.78rem;">
                <div><span style="color:${palette.textMuted};">30D revenue</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${formatCurrency(protocol.revenue30d)}</span></div>
                <div><span style="color:${palette.textMuted};">TVL</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${formatCurrency(protocol.tvl)}</span></div>
                <div><span style="color:${palette.textMuted};">30D growth</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${formatGrowth(protocol.growth30d)}</span></div>
              </div>
            </div>
          `;
        },
        textStyle: {
          color: palette.textPrimary,
          fontFamily: 'var(--font-roboto-flex)',
        },
        trigger: 'item',
      },
    };
  }, [palette, protocolsById, treemapProtocols]);

  const chartEvents = useMemo(
    () => ({
      click: (params: TreemapDataParams) => {
        const protocolId = params.data?.protocolId;
        const protocol = protocolId ? protocolsById.get(protocolId) : undefined;
        if (!protocol) return;

        setError(undefined);
        setIsLoadingDetail(true);
        setSelectedProtocolId(protocol.id);
      },
    }),
    [protocolsById],
  );

  if (!hasMounted) return null;

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden bg-background transition-opacity duration-150"
      style={{
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {isLoading ? (
        <div className="grid h-full place-items-center">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : error && !selectedProtocol ? (
        <div className="grid h-full place-items-center px-6 text-center">
          <span className="max-w-96 text-muted-foreground">{error}</span>
        </div>
      ) : (
        <div className="grid h-full grid-cols-1 gap-4 p-2 lg:grid-cols-[minmax(0,0.7fr)_minmax(10rem,0.3fr)]">
          <div className="min-h-0">
            <div className="h-full min-h-104">
              <ReactEChartsCore
                echarts={echarts}
                notMerge
                onEvents={chartEvents}
                option={chartOption}
                opts={{ renderer: 'canvas' }}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
          <aside
            className="flex min-h-0 flex-col justify-between border-l pl-4"
            style={{
              background: palette.detailGradient,
              borderColor: palette.surfaceBorder,
            }}
          >
            {selectedProtocol ? (
              <div className="flex h-full flex-col">
                <div
                  className="border-b pb-4"
                  style={{ borderColor: palette.divider }}
                >
                  <span className="font-anton text-[10px] text-muted-foreground uppercase">
                    {selectedProtocol.primaryChain} ·{' '}
                    {selectedProtocol.category}
                  </span>
                  <h2 className="mt-2 font-anton text-4xl leading-[0.95] sm:text-5xl">
                    {selectedProtocol.name}
                  </h2>
                </div>
                {shouldShowDetailLoading ? (
                  <div className="grid flex-1 place-items-center">
                    <Loader2 className="animate-spin text-primary" size={28} />
                  </div>
                ) : (
                  <div className="mt-4 grid content-start">
                    <div
                      className="mb-2 h-px w-full"
                      style={{ backgroundColor: palette.divider }}
                    />
                    <div className="grid content-start">
                      <MetricCard
                        label="Business score"
                        value={String(businessScore)}
                      />
                      <MetricCard
                        label="TVL"
                        value={formatCurrency(selectedProtocol.tvl)}
                      />
                      <MetricCard
                        label="30D revenue"
                        value={formatCurrency(selectedProtocol.revenue30d)}
                      />
                      <MetricCard
                        label="30D growth"
                        value={formatGrowth(selectedProtocol.growth30d)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </aside>
        </div>
      )}

      <p className="pointer-events-none absolute bottom-5 left-4 z-3 text-muted-foreground text-sm">
        Source: DefiLlama free API.
      </p>
    </div>
  );
};

export const protocolHeatmapDemo = {
  ...protocolHeatmapContent,
  Component: ProtocolHeatmapDemo,
  preload: preloadProtocolRevenueTerminal,
} satisfies DemoTrack;
