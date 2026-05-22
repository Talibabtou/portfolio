'use client';

import { cn } from '@/lib/utils';
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
import type { DemoTrack } from '@/app/_components/demos/types';
import {
  readPortfolioStorageValue,
  writePortfolioStorageValue,
} from '@/lib/user-preferences';

type BitcoinRange = '1' | '7' | '30';

type MarketChartResponse = {
  market_caps?: [number, number][];
  prices: [number, number][];
  total_volumes?: [number, number][];
};

type MarketPoint = {
  marketCap?: number;
  price: number;
  timestamp: number;
  volume?: number;
};

type CachedMarketPoints = {
  points: MarketPoint[];
  savedAt: number;
};

const BITCOIN_RANGES: { days: BitcoinRange; label: string }[] = [
  { days: '1', label: '1D' },
  { days: '7', label: '7D' },
  { days: '30', label: '30D' },
];

const COINGECKO_MARKET_CHART_URL =
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart';

const BITCOIN_MARKET_CACHE_KEY = 'demos.bitcoin-market-chart';
const BITCOIN_MARKET_CACHE_TTL = 5 * 60 * 1000;
const DEFAULT_BITCOIN_RANGE: BitcoinRange = '30';
const MILLISECONDS_IN_DAY = 86_400_000;
const MARKET_CHANGE_COLORS = {
  negative: 'text-[#e5484d] dark:text-[#ff6b6b]',
  positive: 'text-[#0f8f4d] dark:text-[#4ade80]',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: 'always',
  style: 'percent',
});

const readoutDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
});

const formatPercent = (value: number) => percentFormatter.format(value / 100);

const getChangePercent = (current?: number, previous?: number) => {
  if (!(current && previous)) return undefined;
  return ((current - previous) / previous) * 100;
};

const normalizeMarketChart = (data: MarketChartResponse): MarketPoint[] =>
  data.prices.map(([timestamp, price], index) => ({
    marketCap: data.market_caps?.[index]?.[1],
    price,
    timestamp,
    volume: data.total_volumes?.[index]?.[1],
  }));

const getBitcoinMarketCache = (range: BitcoinRange) => {
  const marketCache =
    readPortfolioStorageValue<
      Partial<Record<BitcoinRange, CachedMarketPoints>>
    >('session', BITCOIN_MARKET_CACHE_KEY) ?? {};
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
      readPortfolioStorageValue<
        Partial<Record<BitcoinRange, CachedMarketPoints>>
      >('session', BITCOIN_MARKET_CACHE_KEY) ?? {};

    writePortfolioStorageValue('session', BITCOIN_MARKET_CACHE_KEY, {
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

const getClosestPoint = (points: MarketPoint[], timestamp: number) =>
  points.reduce((closestPoint, point) => {
    const closestDistance = Math.abs(closestPoint.timestamp - timestamp);
    const pointDistance = Math.abs(point.timestamp - timestamp);

    return pointDistance < closestDistance ? point : closestPoint;
  }, points[0]);

const getChartTime = (timestamp: number) =>
  Math.floor(timestamp / 1000) as UTCTimestamp;

const getPointKey = (timestamp: number) => getChartTime(timestamp);

const getThemeColor = (token: string, alpha?: number) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();

  return alpha ? `hsl(${value} / ${alpha})` : `hsl(${value})`;
};

const getChartTheme = () => {
  const primary = getThemeColor('--primary');
  const background = getThemeColor('--background');
  const mutedForeground = getThemeColor('--muted-foreground');

  return {
    background,
    grid: {
      horizontal: getThemeColor('--foreground', 0.08),
      vertical: getThemeColor('--foreground', 0.05),
    },
    mutedForeground,
    primary,
    primaryFillBottom: getThemeColor('--primary', 0.02),
    primaryFillTop: getThemeColor('--primary', 0.18),
    scaleBorder: getThemeColor('--foreground', 0.1),
    trackingLine: getThemeColor('--foreground', 0.18),
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
      priceFormatter: (price: number) => currencyFormatter.format(price),
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
        color: getThemeColor('--primary'),
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
      className="min-h-86 flex-1 outline-none"
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

  useEffect(() => {
    const cachedPoints = getBitcoinMarketCache(activeRange);
    if (cachedPoints) {
      queueMicrotask(() => {
        setPoints(cachedPoints);
        setError(undefined);
        setIsLoading(false);
      });
      return;
    }

    const controller = new AbortController();

    const marketChartUrl = new URL(COINGECKO_MARKET_CHART_URL);
    marketChartUrl.searchParams.set('vs_currency', 'usd');
    marketChartUrl.searchParams.set('days', activeRange);

    fetch(marketChartUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`CoinGecko returned ${response.status}`);
        }

        return response.json() as Promise<MarketChartResponse>;
      })
      .then((data) => {
        const normalizedPoints = normalizeMarketChart(data);
        setBitcoinMarketCache(activeRange, normalizedPoints);
        setPoints(normalizedPoints);
      })
      .catch((fetchError: Error) => {
        if (fetchError.name === 'AbortError') return;

        setError('CoinGecko public API unavailable. Try again in a moment.');
        setPoints([]);
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
    const cachedPoints = getBitcoinMarketCache(range);

    if (cachedPoints) {
      setPoints(cachedPoints);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
  };

  return (
    <div className="mt-auto flex min-h-0 flex-1 flex-col pt-5">
      <div className="flex flex-wrap items-start justify-between gap-5 border-foreground/10 border-b pb-3">
        <div>
          <span className="font-anton text-muted-foreground text-sm uppercase">
            BTC / USD
          </span>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <strong className="font-anton text-5xl leading-none md:text-7xl">
              {latestPoint ? currencyFormatter.format(latestPoint.price) : '--'}
            </strong>
            {typeof changePercent === 'number' ? (
              <span
                className={cn('font-anton text-xl', {
                  [MARKET_CHANGE_COLORS.negative]: !isPositiveChange,
                  [MARKET_CHANGE_COLORS.positive]: isPositiveChange,
                })}
              >
                {formatPercent(changePercent)} 24h
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

      <div className="relative mt-3 flex min-h-86 flex-1 flex-col">
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

            <div className="mt-3 grid gap-4 border-foreground/10 border-t pt-3 sm:grid-cols-4">
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Date
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint
                    ? readoutDateFormatter.format(displayedPoint.timestamp)
                    : '--'}
                </p>
              </div>
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Price
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint
                    ? currencyFormatter.format(displayedPoint.price)
                    : '--'}
                </p>
              </div>
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Volume
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint?.volume
                    ? compactCurrencyFormatter.format(displayedPoint.volume)
                    : '--'}
                </p>
              </div>
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  Market Cap
                </span>
                <p className="mt-0.5 font-anton text-base">
                  {displayedPoint?.marketCap
                    ? compactCurrencyFormatter.format(displayedPoint.marketCap)
                    : '--'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="mt-3 text-muted-foreground text-sm">
        Source: CoinGecko public API.
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
  title: 'BTC / USD market chart with live API data.',
} satisfies DemoTrack;

export default BitcoinMarketDemo;
