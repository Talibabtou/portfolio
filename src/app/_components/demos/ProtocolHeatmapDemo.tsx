'use client';

import type {
  DemoComponentProps,
  DemoTrack,
} from '@/app/_components/demos/types';
import {
  fetchProtocolRevenueSnapshot,
  preloadProtocolRevenueTerminal,
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

const TREEMAP_PROTOCOL_COUNT = 50;
const MIN_REALISTIC_TVL = 1000;

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

type ThemePalette = {
  primary: string;
  primarySoft: string;
  tileBase: string;
  textMuted: string;
  textPrimary: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tileBorder: string;
  tileColor: (rankOpacity: number) => string;
};

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatGrowth = (value: number) => percentFormatter.format(value / 100);

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const hasRealisticTvl = (value: number) => value >= MIN_REALISTIC_TVL;

const getProtocolBusinessScore = (protocol: TerminalProtocol) => {
  const revenueGrowthScore = clampScore(50 + protocol.growth30d * 2);
  const revenue30dScore = clampScore(
    Math.log10(Math.max(protocol.revenue30d, 1)) * 18,
  );
  const revenueToTvlScore = hasRealisticTvl(protocol.tvl)
    ? clampScore(protocol.revenueToTvl * 1000)
    : 50;

  return Math.round(
    revenue30dScore * 0.42 +
      revenueGrowthScore * 0.33 +
      revenueToTvlScore * 0.25,
  );
};

const getTileRankOpacity = (index: number, totalCount: number) => {
  const progress = totalCount <= 1 ? 0 : index / (totalCount - 1);

  return 0.08 + (1 - progress) ** 1.45 * 0.92;
};

const mixRgb = (
  from: [number, number, number],
  to: [number, number, number],
  amount: number,
) => {
  const [fromRed, fromGreen, fromBlue] = from;
  const [toRed, toGreen, toBlue] = to;

  return `rgb(${Math.round(fromRed + (toRed - fromRed) * amount)} ${Math.round(
    fromGreen + (toGreen - fromGreen) * amount,
  )} ${Math.round(fromBlue + (toBlue - fromBlue) * amount)})`;
};

const getTileLabelSize = (intensity: number) => {
  if (intensity > 0.72) {
    return {
      fontSize: 52,
      lineHeight: 54,
    };
  }

  if (intensity > 0.32) {
    return {
      fontSize: 40,
      lineHeight: 43,
    };
  }

  return {
    fontSize: 14,
    lineHeight: 16,
  };
};

const getThemePalette = (isDarkMode: boolean): ThemePalette => {
  if (isDarkMode) {
    return {
      primary: 'hsl(196 100% 78%)',
      primarySoft: 'hsl(196 100% 78% / 0.16)',
      tileBase: 'hsl(0 0% 9% / 0.92)',
      textMuted: 'hsl(0 0% 71% / 0.78)',
      textPrimary: 'hsl(0 0% 100%)',
      tileBorder: 'hsl(0 0% 100% / 0.2)',
      tooltipBackground: 'hsl(0 0% 9% / 0.98)',
      tooltipBorder: 'hsl(196 100% 78% / 0.36)',
      tileColor: (rankProgress) =>
        mixRgb([143, 237, 255], [23, 23, 23], 1 - rankProgress),
    };
  }

  return {
    primary: 'hsl(24 100% 56%)',
    primarySoft: 'hsl(24 100% 56% / 0.14)',
    tileBase: 'hsl(42 78% 96% / 0.98)',
    textMuted: 'hsl(24 18% 32% / 0.82)',
    textPrimary: 'hsl(24 38% 8%)',
    tileBorder: 'hsl(24 38% 8% / 0.2)',
    tooltipBackground: 'hsl(42 78% 97% / 0.99)',
    tooltipBorder: 'hsl(24 100% 56% / 0.32)',
    tileColor: (rankProgress) =>
      mixRgb([255, 118, 31], [253, 247, 237], 1 - rankProgress),
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
    protocolId?: string;
  };
};

type TreemapNodeData = NonNullable<TreemapDataParams['data']>;

const ProtocolHeatmapDemo = ({ isActive = false }: DemoComponentProps) => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [protocols, setProtocols] = useState<TerminalProtocol[]>([]);
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

  const protocolsById = useMemo(
    () =>
      new Map(
        treemapProtocols.map((protocol) => [protocol.id, protocol] as const),
      ),
    [treemapProtocols],
  );

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
          data: treemapProtocols.map((protocol, index) => {
            const intensity = Math.max(
              0.16,
              Math.min(1, protocol.revenue30d / maxRevenue),
            );
            const labelSize = getTileLabelSize(intensity);

            return {
              id: protocol.id,
              itemStyle: {
                borderColor: palette.tileBorder,
                borderWidth: 1,
                color: palette.tileColor(
                  getTileRankOpacity(index, treemapProtocols.length),
                ),
                gapWidth: 5,
              },
              label: {
                color: palette.textPrimary,
                fontFamily: 'Impact, Anton, sans-serif',
                fontSize: labelSize.fontSize,
                fontWeight: 900,
                lineHeight: labelSize.lineHeight,
                overflow: 'truncate',
                padding: 0,
              },
              name: protocol.name,
              protocolId: protocol.id,
              value: Math.max(protocol.revenue30d, 1),
            };
          }),
          emphasis: {
            itemStyle: {
              color: palette.primarySoft,
              borderColor: palette.primary,
              borderWidth: 1.5,
              shadowBlur: 0,
            },
            label: {
              color: palette.textPrimary,
            },
          },
          itemStyle: {
            color: palette.tileBase,
            borderJoin: 'round',
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
        trigger: 'item',
      },
    };
  }, [palette, protocolsById, treemapProtocols]);

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
        <div className="h-full p-2">
          <ReactEChartsCore
            echarts={echarts}
            notMerge
            option={chartOption}
            opts={{ renderer: 'canvas' }}
            style={{ height: '100%', minHeight: '26rem', width: '100%' }}
          />
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
