'use client';

import {
  BITCOIN_RANGES,
  DEFAULT_BITCOIN_RANGE,
  fetchBitcoinMarketSnapshot,
  getBitcoinMarketSnapshot,
  getClosestPoint,
  preloadBitcoinMarketDemo,
  type BitcoinRange,
  type CachedMarketPoints,
  type MarketPoint,
} from '@/lib/demos/bitcoin-market';
import { MILLISECONDS_IN_DAY } from '@/lib/constants';
import {
  cn,
  formatCompactUsd,
  formatMinutesAgo,
  formatPreciseSignedPercent,
  formatShortDateTime,
  formatUsd,
  getCssHslVariable,
} from '@/lib/utils';
import type { DemoTrack } from '@/types';
import { LineChart } from 'lucide-react';
import {
  AreaSeries,
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from 'lightweight-charts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  ChartOptions,
  DeepPartial,
  IChartApi,
  IPriceLine,
  ISeriesApi,
  LineData,
  MouseEventParams,
  Time,
  UTCTimestamp,
} from 'lightweight-charts';

const MARKET_CHANGE_COLORS = {
  negative: 'text-[#e5484d] dark:text-[#ff6b6b]',
  positive: 'text-[#0f8f4d] dark:text-[#4ade80]',
};

const getChangePercent = (current?: number, previous?: number) => {
  if (!(current && previous)) return undefined;
  return ((current - previous) / previous) * 100;
};

const getChartTime = (timestamp: number) =>
  Math.floor(timestamp / 1000) as UTCTimestamp;

const getPointKey = (timestamp: number) => getChartTime(timestamp);

const getChartTheme = () => {
  const primary = getCssHslVariable('--primary');
  const background = getCssHslVariable('--background');
  const mutedForeground = getCssHslVariable('--muted-foreground');

  return {
    background,
    grid: {
      horizontal: getCssHslVariable('--foreground', 0.08),
      vertical: getCssHslVariable('--foreground', 0.05),
    },
    mutedForeground,
    primary,
    primaryFillBottom: getCssHslVariable('--primary', 0.02),
    primaryFillTop: getCssHslVariable('--primary', 0.18),
    scaleBorder: getCssHslVariable('--foreground', 0.1),
    trackingLine: getCssHslVariable('--foreground', 0.18),
  };
};

const getChartOptions = (): DeepPartial<ChartOptions> => {
  const theme = getChartTheme();

  return {
    autoSize: true,
    crosshair: {
      horzLine: {
        color: theme.trackingLine,
        labelBackgroundColor: theme.background,
        style: LineStyle.Solid,
      },
      mode: CrosshairMode.Normal,
      vertLine: {
        color: theme.trackingLine,
        labelBackgroundColor: theme.background,
        style: LineStyle.Solid,
      },
    },
    grid: {
      horzLines: {
        color: theme.grid.horizontal,
      },
      vertLines: {
        color: theme.grid.vertical,
      },
    },
    handleScale: {
      axisDoubleClickReset: false,
      axisPressedMouseMove: false,
      mouseWheel: false,
      pinch: false,
    },
    handleScroll: {
      horzTouchDrag: false,
      mouseWheel: false,
      pressedMouseMove: false,
      vertTouchDrag: false,
    },
    layout: {
      background: {
        color: 'transparent',
        type: ColorType.Solid,
      },
      fontFamily: 'var(--font-roboto-flex)',
      textColor: theme.mutedForeground,
    },
    localization: {
      priceFormatter: formatUsd,
    },
    rightPriceScale: {
      borderColor: theme.scaleBorder,
      borderVisible: false,
      scaleMargins: {
        bottom: 0.12,
        top: 0.08,
      },
    },
    timeScale: {
      borderColor: theme.scaleBorder,
      borderVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
      rightOffset: 2,
      secondsVisible: false,
      timeVisible: true,
    },
  };
};

const ChartLoadingIndicator = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 z-1 h-1 overflow-hidden bg-foreground/10"
  >
    <span className="absolute top-0 left-0 h-full w-1/3 animate-[chart-loading-slide_1.1s_ease-in-out_infinite] bg-primary" />
  </div>
);

const TradingViewBitcoinChart = ({
  latestPoint,
  onPointChange,
  points,
}: {
  latestPoint?: MarketPoint;
  onPointChange: (point?: MarketPoint) => void;
  points: MarketPoint[];
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>(null);
  const latestPriceLineRef = useRef<IPriceLine>(null);
  const seriesRef = useRef<ISeriesApi<'Area'>>(null);

  const applyChartTheme = useCallback(() => {
    if (!chartRef.current || !seriesRef.current) return;

    const theme = getChartTheme();

    chartRef.current.applyOptions(getChartOptions());
    seriesRef.current.applyOptions({
      bottomColor: theme.primaryFillBottom,
      crosshairMarkerBackgroundColor: theme.background,
      crosshairMarkerBorderColor: theme.primary,
      lineColor: theme.primary,
      topColor: theme.primaryFillTop,
    });

    if (latestPriceLineRef.current && latestPoint) {
      latestPriceLineRef.current.applyOptions({
        color: theme.primary,
        price: latestPoint.price,
      });
    }
  }, [latestPoint]);

  const chartData = useMemo<LineData[]>(
    () =>
      points.map((point) => ({
        time: getChartTime(point.timestamp),
        value: point.price,
      })),
    [points],
  );

  const pointsByTime = useMemo(
    () =>
      new Map<UTCTimestamp, MarketPoint>(
        points.map((point) => [getPointKey(point.timestamp), point]),
      ),
    [points],
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const theme = getChartTheme();
    const chart = createChart(chartContainerRef.current, getChartOptions());

    const series = chart.addSeries(AreaSeries, {
      bottomColor: theme.primaryFillBottom,
      crosshairMarkerBackgroundColor: theme.background,
      crosshairMarkerBorderColor: theme.primary,
      crosshairMarkerRadius: 4,
      lastValueVisible: false,
      lineColor: theme.primary,
      lineWidth: 2,
      priceLineVisible: false,
      topColor: theme.primaryFillTop,
    });

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      if (!param.time) {
        onPointChange(undefined);
        return;
      }

      const seriesData = param.seriesData.get(series);
      if (!seriesData) {
        onPointChange(undefined);
        return;
      }

      onPointChange(pointsByTime.get(param.time as UTCTimestamp));
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);
    chartRef.current = chart;
    seriesRef.current = series;

    const themeObserver = new MutationObserver(applyChartTheme);
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class'],
      attributes: true,
    });

    return () => {
      themeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
      latestPriceLineRef.current = null;
      seriesRef.current = null;
    };
  }, [applyChartTheme, onPointChange, pointsByTime]);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

    seriesRef.current.setData(chartData);

    if (latestPriceLineRef.current) {
      seriesRef.current.removePriceLine(latestPriceLineRef.current);
    }

    if (latestPoint) {
      latestPriceLineRef.current = seriesRef.current.createPriceLine({
        axisLabelVisible: true,
        color: getCssHslVariable('--primary'),
        lineStyle: LineStyle.Dotted,
        lineVisible: true,
        lineWidth: 1,
        price: latestPoint.price,
        title: 'Latest',
      });
    }

    chartRef.current.timeScale().fitContent();
  }, [chartData, latestPoint]);

  return (
    <div
      aria-label="Interactive BTC USD price chart"
      className="min-h-80 flex-1 outline-none lg:min-h-86"
      ref={chartContainerRef}
      role="img"
    />
  );
};

const BitcoinMarketDemo = () => {
  const [activeRange, setActiveRange] = useState<BitcoinRange>(
    DEFAULT_BITCOIN_RANGE,
  );
  const [activePoint, setActivePoint] = useState<MarketPoint>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState<MarketPoint[]>([]);
  const [snapshotSavedAt, setSnapshotSavedAt] = useState<number>();

  useEffect(() => {
    const cachedSnapshot = getBitcoinMarketSnapshot(activeRange);
    if (cachedSnapshot) {
      queueMicrotask(() => {
        setPoints(cachedSnapshot.points);
        setSnapshotSavedAt(cachedSnapshot.savedAt);
        setError(undefined);
        setIsLoading(false);
      });
      return;
    }

    const controller = new AbortController();

    fetchBitcoinMarketSnapshot(activeRange, { signal: controller.signal })
      .then((snapshot: CachedMarketPoints) => {
        setPoints(snapshot.points);
        setSnapshotSavedAt(snapshot.savedAt);
      })
      .catch((fetchError: Error) => {
        if (fetchError.name === 'AbortError') return;

        setError('CoinGecko public API unavailable. Try again in a moment.');
        setPoints([]);
        setSnapshotSavedAt(undefined);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [activeRange]);

  const latestPoint = points.at(-1);
  const displayedPoint = activePoint ?? latestPoint;
  const dayAgoPoint =
    latestPoint &&
    getClosestPoint(points, latestPoint.timestamp - MILLISECONDS_IN_DAY);
  const fallbackPoint = points.at(0);
  const changePercent = getChangePercent(
    latestPoint?.price,
    dayAgoPoint?.price ?? fallbackPoint?.price,
  );
  const isPositiveChange =
    typeof changePercent === 'number' && changePercent >= 0;
  const canRenderChart = points.length > 0;

  const handlePointChange = useCallback((point?: MarketPoint) => {
    setActivePoint(point);
  }, []);

  const handleRangeChange = (range: BitcoinRange) => {
    setActivePoint(undefined);
    setActiveRange(range);
    setError(undefined);
    const cachedSnapshot = getBitcoinMarketSnapshot(range);

    if (cachedSnapshot) {
      setPoints(cachedSnapshot.points);
      setSnapshotSavedAt(cachedSnapshot.savedAt);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
  };

  return (
    <div className="mt-auto flex min-h-0 flex-1 flex-col pt-3 lg:pt-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-foreground/10 border-b pb-2 lg:gap-5 lg:pb-3">
        <div>
          <span className="font-anton text-muted-foreground text-sm uppercase">
            BTC / USD
          </span>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <strong className="font-anton text-5xl leading-none md:text-7xl">
              {latestPoint ? formatUsd(latestPoint.price) : '--'}
            </strong>
            {typeof changePercent === 'number' ? (
              <span
                className={cn('font-anton text-xl', {
                  [MARKET_CHANGE_COLORS.negative]: !isPositiveChange,
                  [MARKET_CHANGE_COLORS.positive]: isPositiveChange,
                })}
              >
                {formatPreciseSignedPercent(changePercent)} 24h
              </span>
            ) : null}
          </div>
        </div>

        <fieldset className="flex border border-foreground/10">
          <legend className="sr-only">Bitcoin chart range</legend>
          {BITCOIN_RANGES.map((range) => (
            <button
              aria-pressed={range.days === activeRange}
              className={cn(
                'h-10 min-w-12 border-foreground/10 border-l px-4 font-anton text-sm transition-colors first:border-l-0 hover:bg-foreground hover:text-background',
                {
                  'bg-foreground text-background': range.days === activeRange,
                  'text-muted-foreground': range.days !== activeRange,
                },
              )}
              key={range.days}
              onClick={() => handleRangeChange(range.days)}
              type="button"
            >
              {range.label}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="relative mt-2 flex min-h-72 flex-1 flex-col lg:mt-3 lg:min-h-86">
        {canRenderChart && isLoading ? <ChartLoadingIndicator /> : null}
        {isLoading && !canRenderChart ? (
          <div className="relative grid flex-1 place-items-center overflow-hidden border border-foreground/10 bg-background-light">
            <ChartLoadingIndicator />
            <span className="font-anton text-muted-foreground text-sm uppercase">
              Loading BTC market data
            </span>
          </div>
        ) : error ? (
          <div className="grid flex-1 place-items-center border border-foreground/10 bg-background-light px-6 text-center">
            <span className="max-w-80 text-muted-foreground">{error}</span>
          </div>
        ) : (
          <>
            <TradingViewBitcoinChart
              latestPoint={latestPoint}
              onPointChange={handlePointChange}
              points={points}
            />

            <div className="mt-3 grid grid-cols-4 gap-4 border-foreground/10 border-t pt-3">
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Date
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint
                    ? formatShortDateTime(displayedPoint.timestamp)
                    : '--'}
                </p>
              </div>
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Price
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint ? formatUsd(displayedPoint.price) : '--'}
                </p>
              </div>
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Volume
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint?.volume
                    ? formatCompactUsd(displayedPoint.volume)
                    : '--'}
                </p>
              </div>
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Market Cap
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint?.marketCap
                    ? formatCompactUsd(displayedPoint.marketCap)
                    : '--'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-2 text-muted-foreground text-sm lg:mt-3">
        Source: CoinGecko public API
        {snapshotSavedAt ? ` (${formatMinutesAgo(snapshotSavedAt)})` : ''}.
      </p>
    </div>
  );
};

export const bitcoinMarketDemo = {
  Component: BitcoinMarketDemo,
  detail:
    'A custom chart surface using public market data, responsive SVG rendering, range state and pointer readouts.',
  eyebrow: 'Market interface',
  icon: LineChart,
  id: 'trading-view',
  label: 'BTC Chart',
  metrics: ['BTC / USD', '1D / 7D / 30D', 'CoinGecko'],
  preload: preloadBitcoinMarketDemo,
  title: 'BTC / USD market chart with live API data.',
} satisfies DemoTrack;

export default BitcoinMarketDemo;
