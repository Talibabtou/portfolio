'use client';

import type {
  DemoComponentProps,
  DemoTrack,
} from '@/app/_components/demos/types';
import {
  fetchProtocolRevenueSnapshot,
  preloadProtocolHeatmapDemo,
  type CachedProtocolRevenueSnapshot,
  type HeatmapProtocol,
} from '@/app/_components/demos/data/ProtocolHeatmapDemo';
import { useDebouncedActivation } from '@/hooks/use-debounced-activation';
import { THEME_VALUES, UI_TIMINGS } from '@/lib/constants';
import { useThemePreference } from '@/lib/theme-preference';
import {
  clamp,
  escapeHtml,
  formatCompactUsd,
  formatMinutesAgo,
  formatSignedPercent,
  normalizeLogRange,
} from '@/lib/utils';
import type {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts';
import { TreemapChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart3, CircleHelp, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

echarts.use([TreemapChart, TooltipComponent, CanvasRenderer]);

const TREEMAP_PROTOCOL_COUNT = 50;
const MIN_REALISTIC_TVL = 1000;
const MIN_LABEL_AREA_SHARE = 0.008;
const REVENUE_SCORE_FLOOR = 100_000;
const REVENUE_SCORE_CEILING = 100_000_000;
const GROWTH_SCORE_CAP = 50;

const protocolHeatmapContent = {
  detail: 'Protocol revenue and growth from DefiLlama’s free API.',
  eyebrow: 'Crypto Protocol Heatmap',
  icon: BarChart3,
  id: 'protocol-heatmap',
  label: 'Crypto Protocol Heatmap',
  metrics: ['Revenue', 'Growth', 'TVL'],
  title: 'A dense treemap for crypto protocol fundamentals.',
};

type ThemePalette = {
  primary: string;
  tileGap: string;
  textMuted: string;
  textPrimary: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tileColor: (rankOpacity: number) => string;
  tileHoverColor: (rankOpacity: number) => string;
};

const formatCurrency = formatCompactUsd;
const formatGrowth = formatSignedPercent;

const hasRealisticTvl = (value: number) => value >= MIN_REALISTIC_TVL;

const getProtocolBusinessScore = (protocol: HeatmapProtocol) => {
  const revenueScaleScore =
    normalizeLogRange(
      protocol.revenue30d,
      REVENUE_SCORE_FLOOR,
      REVENUE_SCORE_CEILING,
    ) * 100;
  const growthScore = clamp(
    50 + protocol.growth30d * (50 / GROWTH_SCORE_CAP),
    0,
    100,
  );

  return Math.round(revenueScaleScore * 0.65 + growthScore * 0.35);
};

const getTileRankOpacity = (index: number, totalCount: number) => {
  const progress = totalCount <= 1 ? 0 : index / (totalCount - 1);

  return 0.08 + (1 - progress) ** 1.45 * 0.92;
};

const mixRgb = (
  from: [number, number, number],
  to: [number, number, number],
  amount: number,
  alpha = 1,
) => {
  const [fromRed, fromGreen, fromBlue] = from;
  const [toRed, toGreen, toBlue] = to;

  return `rgba(${Math.round(
    fromRed + (toRed - fromRed) * amount,
  )}, ${Math.round(fromGreen + (toGreen - fromGreen) * amount)}, ${Math.round(
    fromBlue + (toBlue - fromBlue) * amount,
  )}, ${alpha})`;
};

const getTileLabelStyle = (areaShare: number) => {
  if (areaShare < MIN_LABEL_AREA_SHARE) {
    return {
      fontSize: 0,
      lineHeight: 0,
      show: false,
    };
  }

  const fontSize = Math.round(clamp(10 + Math.sqrt(areaShare) * 92, 12, 54));

  return {
    fontSize,
    lineHeight: Math.round(fontSize * 1.04),
    show: true,
  };
};

const getThemePalette = (isDarkMode: boolean): ThemePalette => {
  if (isDarkMode) {
    return {
      primary: 'hsl(196 100% 78%)',
      tileGap: 'hsl(0 0% 9%)',
      textMuted: 'hsl(0 0% 71% / 0.78)',
      textPrimary: 'hsl(0 0% 100%)',
      tooltipBackground: 'hsl(0 0% 9% / 0.98)',
      tooltipBorder: 'hsl(196 100% 78% / 0.36)',
      tileColor: (rankProgress) => {
        const alpha = 0.18 + rankProgress * 0.7;

        return mixRgb([143, 237, 255], [23, 23, 23], 1 - rankProgress, alpha);
      },
      tileHoverColor: (rankProgress) => {
        const fade = 1 - rankProgress * 0.38;

        return mixRgb([69, 207, 255], [12, 52, 70], fade, 0.98);
      },
    };
  }

  return {
    primary: 'hsl(24 100% 56%)',
    tileGap: 'hsl(42 78% 96%)',
    textMuted: 'hsl(24 18% 32% / 0.82)',
    textPrimary: 'hsl(24 38% 8%)',
    tooltipBackground: 'hsl(42 78% 97% / 0.99)',
    tooltipBorder: 'hsl(24 100% 56% / 0.32)',
    tileColor: (rankProgress) => {
      const alpha = 0.18 + rankProgress * 0.62;

      return mixRgb([255, 118, 31], [255, 118, 31], 0, alpha);
    },
    tileHoverColor: (rankProgress) => {
      const fade = 1 - rankProgress * 0.26;

      return mixRgb([255, 118, 31], [168, 62, 12], fade, 0.96);
    },
  };
};

type TreemapDataParams = {
  data?: {
    protocolId?: string;
  };
};

type TreemapNodeData = NonNullable<TreemapDataParams['data']>;
type TooltipPositionSize = {
  contentSize: [number, number];
  viewSize: [number, number];
};

const getTooltipPosition = (
  point: [number, number],
  _params: unknown,
  _element: unknown,
  _rect: unknown,
  size: TooltipPositionSize,
) => {
  const offset = 14;
  const edgePadding = 12;
  const [viewWidth, viewHeight] = size.viewSize;
  const measuredWidth = size.contentSize[0];
  const measuredHeight = size.contentSize[1];
  const contentWidth = measuredWidth > 0 ? measuredWidth : 224;
  const contentHeight = measuredHeight > 0 ? measuredHeight : 132;
  const shouldPlaceLeft = point[0] > viewWidth / 2;
  const x = shouldPlaceLeft
    ? point[0] - contentWidth - offset
    : point[0] + offset;
  const y = point[1] - contentHeight / 2;

  return [
    clamp(x, edgePadding, viewWidth - contentWidth - edgePadding),
    clamp(y, edgePadding, viewHeight - contentHeight - edgePadding),
  ];
};

const ProtocolHeatmapDemo = ({ isActive = false }: DemoComponentProps) => {
  const [error, setError] = useState<string>();
  const [isCompactDemo, setIsCompactDemo] = useState(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [protocols, setProtocols] = useState<HeatmapProtocol[]>([]);
  const [snapshotSavedAt, setSnapshotSavedAt] = useState<number>();
  const { theme } = useThemePreference();
  const isDarkMode = theme === THEME_VALUES.dark;
  const palette = useMemo(() => getThemePalette(isDarkMode), [isDarkMode]);
  const { hasMounted, isVisible } = useDebouncedActivation(isActive, {
    delayMs: UI_TIMINGS.demoTabVisibilityDelayMs,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const syncCompactDemo = () => setIsCompactDemo(mediaQuery.matches);

    syncCompactDemo();
    mediaQuery.addEventListener('change', syncCompactDemo);

    return () => {
      mediaQuery.removeEventListener('change', syncCompactDemo);
    };
  }, []);

  useEffect(() => {
    let ignoreRequest = false;

    fetchProtocolRevenueSnapshot()
      .then((snapshot: CachedProtocolRevenueSnapshot) => {
        if (ignoreRequest) return;
        setProtocols(snapshot.protocols);
        setSnapshotSavedAt(snapshot.savedAt);
      })
      .catch(() => {
        if (ignoreRequest) return;
        setError('DefiLlama revenue data unavailable. Try again in a moment.');
        setSnapshotSavedAt(undefined);
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

  const protocolsById = useMemo(
    () =>
      new Map(
        treemapProtocols.map((protocol) => [protocol.id, protocol] as const),
      ),
    [treemapProtocols],
  );

  const chartOption = useMemo<EChartsOption>(() => {
    const totalRevenue = Math.max(
      treemapProtocols.reduce((sum, protocol) => sum + protocol.revenue30d, 0),
      1,
    );

    return {
      animation: false,
      animationDuration: 0,
      animationDurationUpdate: 0,
      backgroundColor: palette.tileGap,
      series: [
        {
          animation: false,
          animationDuration: 0,
          animationDurationUpdate: 0,
          breadcrumb: { show: false },
          ...(isCompactDemo ? { bottom: 35, left: 0, right: 0, top: 0 } : {}),
          nodeClick: false,
          roam: false,
          data: treemapProtocols.map((protocol, index) => {
            const labelStyle = getTileLabelStyle(
              protocol.revenue30d / totalRevenue,
            );

            return {
              id: protocol.id,
              emphasis: {
                itemStyle: {
                  color: palette.tileHoverColor(
                    getTileRankOpacity(index, treemapProtocols.length),
                  ),
                },
              },
              itemStyle: {
                borderColor: 'transparent',
                borderWidth: 0,
                color: palette.tileColor(
                  getTileRankOpacity(index, treemapProtocols.length),
                ),
              },
              label: {
                color: palette.textPrimary,
                fontFamily: 'Impact, Anton, sans-serif',
                fontSize: labelStyle.fontSize,
                fontWeight: 900,
                lineHeight: labelStyle.lineHeight,
                overflow: 'truncate',
                padding: 0,
                show: labelStyle.show,
              },
              name: protocol.name,
              protocolId: protocol.id,
              value: Math.max(protocol.revenue30d, 1),
            };
          }),
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 0,
              shadowBlur: 0,
            },
            label: {
              color: palette.textPrimary,
            },
          },
          itemStyle: {
            color: 'transparent',
            borderJoin: 'round',
            borderWidth: 0,
            gapWidth: 5,
          },
          label: {
            color: palette.textPrimary,
            fontFamily: 'Impact, Anton, sans-serif',
            fontSize: 22,
            fontWeight: 900,
            formatter: (params) => {
              const data = params.data as TreemapNodeData | undefined;

              return data?.protocolId ? params.name : '';
            },
            lineHeight: 25,
            overflow: 'truncate',
            padding: 0,
            show: true,
          },
          leafDepth: 1,
          levels: [
            {
              itemStyle: {
                borderColor: 'transparent',
                borderWidth: 0,
                gapWidth: 5,
              },
            },
          ],
          sort: 'desc',
          squareRatio: 1.5,
          type: 'treemap',
          visibleMin: 1,
        },
      ],
      tooltip: {
        appendToBody: false,
        backgroundColor: palette.tooltipBackground,
        borderColor: palette.tooltipBorder,
        borderWidth: 0,
        className: 'protocol-heatmap-tooltip',
        confine: true,
        extraCssText:
          'box-shadow:none;border-radius:0;padding:12px 14px;width:14rem;',
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
          const businessScore = getProtocolBusinessScore(protocol);
          const tvlRow = hasRealisticTvl(protocol.tvl)
            ? `<div><span style="color:${palette.textMuted};">TVL</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${formatCurrency(protocol.tvl)}</span></div>`
            : '';

          return `
            <div style="min-width: 12rem; font-family: var(--font-roboto-flex), sans-serif; color: ${palette.textPrimary};">
              <div style="font-family: var(--font-anton), sans-serif; font-size: 1.05rem; line-height: 1; color: ${palette.textPrimary};">
                ${name}
              </div>
              <div style="margin-top: 0.35rem; font-size: 0.72rem; color: ${palette.textMuted}; text-transform: uppercase;">
                ${chain} · ${category}
              </div>
              <div style="margin-top: 0.75rem; display: grid; gap: 0.4rem; font-size: 0.78rem;">
                <div><span style="color:${palette.textMuted};">Business score</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${businessScore}</span></div>
                <div><span style="color:${palette.textMuted};">30D revenue</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${formatCurrency(protocol.revenue30d)}</span></div>
                ${tvlRow}
                <div><span style="color:${palette.textMuted};">30D growth</span> <span style="font-family: var(--font-anton), sans-serif; color:${palette.textPrimary};">${formatGrowth(protocol.growth30d)}</span></div>
              </div>
            </div>
          `;
        },
        textStyle: {
          color: palette.textPrimary,
          fontFamily: 'var(--font-roboto-flex)',
        },
        position: getTooltipPosition,
        trigger: 'item',
      },
    };
  }, [isCompactDemo, palette, protocolsById, treemapProtocols]);

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
      ) : error ? (
        <div className="grid h-full place-items-center px-6 text-center">
          <span className="max-w-96 text-muted-foreground">{error}</span>
        </div>
      ) : (
        <div className="h-full p-2 max-lg:absolute max-lg:inset-0 max-lg:p-0">
          <ReactEChartsCore
            echarts={echarts}
            notMerge
            option={chartOption}
            opts={{ renderer: 'canvas' }}
            style={{
              backgroundColor: 'transparent',
              height: '100%',
              minHeight: isCompactDemo ? '100%' : '26rem',
              width: '100%',
            }}
          />
        </div>
      )}

      <p className="pointer-events-none absolute bottom-1 z-3 text-muted-foreground text-sm leading-none lg:bottom-5 lg:left-4 lg:text-sm lg:leading-normal">
        Source: DefiLlama free API
        {snapshotSavedAt ? ` (${formatMinutesAgo(snapshotSavedAt)})` : ''}.
      </p>
      <div className="absolute right-0 bottom-0 z-3 lg:right-4 lg:bottom-5">
        <button
          aria-expanded={isFormulaOpen}
          aria-label="Business score formula"
          className="grid size-7 place-items-center text-muted-foreground"
          onClick={() => setIsFormulaOpen((isOpen) => !isOpen)}
          type="button"
        >
          <CircleHelp aria-hidden="true" size={15} strokeWidth={1.8} />
        </button>
        {isFormulaOpen ? (
          <div className="absolute right-3 bottom-9 w-115 border border-foreground/15 bg-background/95 p-3 text-foreground text-xs shadow-none backdrop-blur">
            <p className="font-anton text-sm uppercase">
              Business score formula
            </p>
            <div className="mt-2 space-y-2 text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap font-mono">
                  Business Score&nbsp;=
                </span>
                <span className="font-mono text-xs md:text-sm">
                  0.65 ×{' '}
                  <span className="font-semibold">
                    Revenue<sub>30D</sub>
                  </span>
                  &nbsp;+&nbsp; 0.35 ×{' '}
                  <span className="font-semibold">
                    Growth<sub>30D</sub>
                  </span>
                </span>
              </div>
              <ul className="ml-5 list-disc space-y-1 text-xs md:text-sm">
                <li>
                  <b>Revenue:</b> log-scaled from $100K to $100M
                </li>
                <li>
                  <b>Growth:</b> capped between –50% and +50%
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const protocolHeatmapDemo = {
  ...protocolHeatmapContent,
  Component: ProtocolHeatmapDemo,
  preload: preloadProtocolHeatmapDemo,
} satisfies DemoTrack;
