import { MILLISECONDS_IN_DAY } from '@/lib/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const usdFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
});

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
});

const signedPercentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  signDisplay: 'always',
  style: 'percent',
});

const preciseSignedPercentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  signDisplay: 'always',
  style: 'percent',
});

const shortDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
});

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const clamp01 = (value: number) => clamp(value, 0, 1);

export const normalizeRange = (value: number, min: number, max: number) => {
  if (min === max) return 0;

  return clamp01((value - min) / (max - min));
};

export const normalizeLogRange = (value: number, min: number, max: number) => {
  if (min <= 0 || max <= 0 || min === max) return 0;

  return normalizeRange(
    Math.log10(clamp(value, min, max)),
    Math.log10(min),
    Math.log10(max),
  );
};

export const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export function toFiniteNumber(value: unknown): number;
export function toFiniteNumber<Fallback>(
  value: unknown,
  fallback: Fallback,
): number | Fallback;
export function toFiniteNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export const createNumberFormatter = (
  options: Intl.NumberFormatOptions,
  locales: Intl.LocalesArgument = 'en-US',
) => new Intl.NumberFormat(locales, options);

export const createDateTimeFormatter = (
  options: Intl.DateTimeFormatOptions,
  locales: Intl.LocalesArgument = 'en-US',
) => new Intl.DateTimeFormat(locales, options);

export const formatUsd = (value: number) => usdFormatter.format(value);

export const formatCompactUsd = (value: number) =>
  compactUsdFormatter.format(value);

export const formatCompactNumber = (value: number) =>
  compactNumberFormatter.format(value);

export const formatSignedPercent = (percent: number) =>
  signedPercentFormatter.format(percent / 100);

export const formatPreciseSignedPercent = (percent: number) =>
  preciseSignedPercentFormatter.format(percent / 100);

export const formatShortDateTime = (timestamp: number | Date) =>
  shortDateTimeFormatter.format(timestamp);

export const formatMinutesAgo = (timestamp: number, now = Date.now()) => {
  const elapsedMinutes = Math.max(0, Math.floor((now - timestamp) / 60_000));

  return `${elapsedMinutes} minute${elapsedMinutes === 1 ? '' : 's'} ago`;
};

export const getIsoDateDaysAgo = (daysAgo: number, now = Date.now()) =>
  new Date(now - daysAgo * MILLISECONDS_IN_DAY).toISOString().slice(0, 10);

export const getCssHslVariable = (token: string, alpha?: number) => {
  if (typeof document === 'undefined') return '';

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();

  return alpha === undefined ? `hsl(${value})` : `hsl(${value} / ${alpha})`;
};

export const getLegacyCssHslVariable = (token: string, alpha?: number) => {
  if (typeof document === 'undefined') return '';

  const [hue, saturation, lightness] = getComputedStyle(
    document.documentElement,
  )
    .getPropertyValue(token)
    .trim()
    .split(/\s+/);

  if (!(hue && saturation && lightness)) return '';

  return alpha === undefined
    ? `hsl(${hue}, ${saturation}, ${lightness})`
    : `hsla(${hue}, ${saturation}, ${lightness}, ${alpha})`;
};
