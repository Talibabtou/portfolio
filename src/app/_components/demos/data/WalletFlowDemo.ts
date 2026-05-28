import { createStorageNamespace } from '@/lib/storage';
import { toFiniteNumber } from '@/lib/utils';

const SOLANA_WALLET_API_PATH = '/api/demos/solana-wallet';
const SOLANA_WALLET_CACHE_TTL = 5 * 60 * 1000;
const SOLANA_ADDRESS_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const SOLANA_WALLET_NAMESPACE = createStorageNamespace(
  'session',
  'demos.solana-wallet.v2',
);

export type WalletToken = {
  amount: number;
  logoUrl?: string;
  mint: string;
  name: string;
  percentage: number;
  priceUsd?: number;
  symbol: string;
  usdValue: number;
};

export type WalletTransaction = {
  description: string;
  signature: string;
  source: string;
  timestamp?: number;
  type: string;
};

export type WalletSnapshot = {
  address: string;
  pricedTokenCount: number;
  savedAt: number;
  solBalance: number;
  tokens: WalletToken[];
  totalUsd: number;
  transactions: WalletTransaction[];
  unpricedTokenCount: number;
};

type HeliusWalletBalance = {
  balance?: number;
  logoUri?: string;
  mint?: string;
  name?: string;
  pricePerToken?: number | null;
  symbol?: string;
  usdValue?: number | null;
};

type HeliusWalletResponse = {
  balances?: HeliusWalletBalance[];
  totalUsdValue?: number;
};

type HeliusTransaction = {
  description?: string;
  signature?: string;
  source?: string;
  timestamp?: number;
  type?: string;
};

export const isSolanaAddress = (address: string) =>
  SOLANA_ADDRESS_PATTERN.test(address.trim());

export const normalizeSolanaAddress = (address: string) => address.trim();

export const getWalletCache = (address: string) => {
  const normalizedAddress = normalizeSolanaAddress(address);
  const cache = SOLANA_WALLET_NAMESPACE.get<WalletSnapshot>(normalizedAddress);

  if (!cache || cache.address !== normalizedAddress) return undefined;

  return Date.now() - cache.savedAt < SOLANA_WALLET_CACHE_TTL
    ? cache
    : undefined;
};

const setWalletCache = (snapshot: WalletSnapshot) => {
  SOLANA_WALLET_NAMESPACE.set(snapshot.address, snapshot);

  return snapshot;
};

const normalizeWalletToken = (
  balance: HeliusWalletBalance,
  totalUsd: number,
): WalletToken => {
  const usdValue = toFiniteNumber(balance.usdValue);

  return {
    amount: toFiniteNumber(balance.balance),
    logoUrl: balance.logoUri,
    mint: balance.mint ?? 'unknown',
    name: balance.name ?? balance.symbol ?? 'Unknown token',
    percentage: totalUsd > 0 ? (usdValue / totalUsd) * 100 : 0,
    priceUsd: toFiniteNumber(balance.pricePerToken, undefined),
    symbol: balance.symbol ?? 'UNKNOWN',
    usdValue,
  };
};

export const normalizeHeliusTransactions = (
  response: HeliusTransaction[],
): WalletTransaction[] =>
  response
    .filter((transaction) => typeof transaction.signature === 'string')
    .slice(0, 100)
    .map((transaction) => ({
      description: transaction.description || 'Parsed Solana transaction',
      signature: transaction.signature ?? '',
      source: transaction.source ?? 'UNKNOWN',
      timestamp: toFiniteNumber(transaction.timestamp, undefined),
      type: transaction.type ?? 'UNKNOWN',
    }));

export const normalizeHeliusWalletResponse = (
  address: string,
  response: HeliusWalletResponse,
  transactions: WalletTransaction[] = [],
): WalletSnapshot => {
  const balances = response.balances ?? [];
  const fallbackTotalUsd = balances.reduce(
    (sum, nextBalance) => sum + toFiniteNumber(nextBalance.usdValue),
    0,
  );
  const totalUsd = toFiniteNumber(response.totalUsdValue) || fallbackTotalUsd;
  const tokensWithValue = balances
    .map((balance) => normalizeWalletToken(balance, totalUsd))
    .filter((token) => token.amount > 0)
    .sort(
      (firstToken, secondToken) => secondToken.usdValue - firstToken.usdValue,
    );
  const tokens = tokensWithValue.map((token) => ({
    ...token,
    percentage: totalUsd > 0 ? (token.usdValue / totalUsd) * 100 : 0,
  }));
  const solBalance =
    tokens.find((token) => token.symbol.toUpperCase() === 'SOL')?.amount ?? 0;

  return {
    address,
    pricedTokenCount: tokens.filter((token) => token.usdValue > 0).length,
    savedAt: Date.now(),
    solBalance,
    tokens,
    totalUsd,
    transactions,
    unpricedTokenCount: tokens.filter((token) => token.usdValue <= 0).length,
  };
};

export const fetchSolanaWalletSnapshot = async (
  address: string,
  options: { signal?: AbortSignal } = {},
) => {
  const normalizedAddress = normalizeSolanaAddress(address);
  const cachedSnapshot = getWalletCache(normalizedAddress);
  if (cachedSnapshot) return cachedSnapshot;

  const url = new URL(SOLANA_WALLET_API_PATH, window.location.origin);
  url.searchParams.set('address', normalizedAddress);

  const response = await fetch(url, { signal: options.signal });

  if (!response.ok) {
    throw new Error(`Solana wallet API returned ${response.status}`);
  }

  return setWalletCache((await response.json()) as WalletSnapshot);
};
