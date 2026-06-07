'use client';

/* eslint-disable @next/next/no-img-element */

import {
  fetchSolanaWalletSnapshot,
  getWalletCache,
  isSolanaAddress,
  normalizeSolanaAddress,
  SAMPLE_SOLANA_ADDRESS,
  type WalletSnapshot,
  type WalletToken,
  type WalletTransaction,
} from '@/lib/demos/wallet-flow';
import { THEME_VALUES } from '@/lib/constants';
import { useThemePreference } from '@/lib/theme-preference';
import {
  cn,
  formatCompactNumber,
  formatCompactUsd,
  formatMinutesAgo,
} from '@/lib/utils';
import { Loader2, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

const MAX_VISIBLE_TOKENS = 10;
const DONUT_CENTER = 50;
const DONUT_INNER_RADIUS = 28;
const DONUT_OUTER_RADIUS = 48;
const DONUT_HOVER_OFFSET = 2.4;
const SOLANA_TOKEN_LIST_ASSET_BASE_URL =
  'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet';
const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112';

const tokenPriceFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 6,
  minimumFractionDigits: 0,
  style: 'currency',
});

const shortenAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

const shortenSignature = (signature: string) =>
  `${signature.slice(0, 6)}...${signature.slice(-6)}`;

const getTokenInitials = (token: WalletToken) =>
  token.symbol
    .split(/\s+/)
    .map((part) => part.at(0))
    .join('')
    .slice(0, 3)
    .toUpperCase();

const getDisplayTokens = (tokens: WalletToken[]) =>
  tokens.filter((token) => token.usdValue > 0).slice(0, MAX_VISIBLE_TOKENS);

const isSolToken = (token: WalletToken) => token.symbol.toUpperCase() === 'SOL';

const getSolanaTokenListLogoUrl = (mint: string) =>
  `${SOLANA_TOKEN_LIST_ASSET_BASE_URL}/${mint}/logo.png`;

const getTokenLogoUrl = (token: WalletToken) =>
  isSolToken(token)
    ? getSolanaTokenListLogoUrl(WRAPPED_SOL_MINT)
    : token.logoUrl;

const getWheelColor = (index: number, count: number) => {
  const progress = count <= 1 ? 0 : index / (count - 1);
  const opacity = 0.92 - progress * 0.7;

  return `hsl(var(--primary) / ${Math.max(0.2, opacity).toFixed(2)})`;
};

const getResolvedWheelColor = (index: number, count: number, theme: string) => {
  const progress = count <= 1 ? 0 : index / (count - 1);
  const opacity = 0.92 - progress * 0.7;
  const primary = theme === THEME_VALUES.light ? '24 100% 56%' : '196 100% 78%';

  return `hsl(${primary} / ${Math.max(0.2, opacity).toFixed(2)})`;
};

const formatTokenUnitPrice = (priceUsd: number | undefined) =>
  priceUsd && priceUsd > 0 ? tokenPriceFormatter.format(priceUsd) : 'Unpriced';

const formatTransactionTime = (timestamp: number | undefined) => {
  if (!timestamp) return 'Recent';

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(timestamp * 1000);
};

const WalletTransactionRow = ({
  transaction,
}: {
  transaction: WalletTransaction;
}) => (
  <a
    className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-background"
    href={`https://orbmarkets.io/tx/${transaction.signature}`}
    rel="noreferrer"
    target="_blank"
  >
    <span className="min-w-0">
      <span className="block truncate font-anton text-xl leading-none">
        {transaction.type.replaceAll('_', ' ')}
      </span>
      <span className="mt-1 line-clamp-1 text-muted-foreground text-sm">
        {transaction.source} · {transaction.description}
      </span>
    </span>
    <span className="text-right">
      <span className="block font-anton text-lg leading-none">
        {shortenSignature(transaction.signature)}
      </span>
      <span className="text-muted-foreground text-xs">
        {formatTransactionTime(transaction.timestamp)}
      </span>
    </span>
  </a>
);

const TokenLogo = ({
  chartIndex,
  token,
  visibleTokenCount,
}: {
  chartIndex: number;
  token: WalletToken;
  visibleTokenCount: number;
}) => {
  const logoUrl = getTokenLogoUrl(token);

  return (
    <span className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-foreground/10 bg-background font-anton text-xs">
      <span
        className="absolute inset-0 grid place-items-center"
        style={{
          backgroundColor:
            chartIndex >= 0
              ? getWheelColor(chartIndex, visibleTokenCount)
              : 'hsl(var(--foreground) / 0.08)',
        }}
      >
        {getTokenInitials(token)}
      </span>
      {logoUrl ? (
        <>
          {/* Helius token logos use arbitrary hosts; SOL uses the stable token-list asset above. */}
          {/* biome-ignore lint/performance/noImgElement: arbitrary token logo hosts cannot be allowlisted safely. */}
          <img
            alt=""
            className="relative size-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            src={logoUrl}
          />
        </>
      ) : null}
    </span>
  );
};

const polarToCartesian = (radius: number, angle: number) => {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: DONUT_CENTER + radius * Math.cos(radians),
    y: DONUT_CENTER + radius * Math.sin(radians),
  };
};

const getDonutSlicePath = (startAngle: number, endAngle: number) => {
  const normalizedEndAngle =
    endAngle - startAngle >= 359.99 ? startAngle + 359.99 : endAngle;
  const outerStart = polarToCartesian(DONUT_OUTER_RADIUS, startAngle);
  const outerEnd = polarToCartesian(DONUT_OUTER_RADIUS, normalizedEndAngle);
  const innerStart = polarToCartesian(DONUT_INNER_RADIUS, startAngle);
  const innerEnd = polarToCartesian(DONUT_INNER_RADIUS, normalizedEndAngle);
  const largeArcFlag = normalizedEndAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${DONUT_OUTER_RADIUS} ${DONUT_OUTER_RADIUS} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${DONUT_INNER_RADIUS} ${DONUT_INNER_RADIUS} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
};

type WalletPanel = 'tokens' | 'transactions';

type DonutSlice = {
  color: string;
  hoverTransform: string;
  path: string;
  token: WalletToken;
};

const getWalletDonutSlices = (visibleTokens: WalletToken[], theme: string) => {
  return visibleTokens.reduce<{
    cursor: number;
    slices: DonutSlice[];
  }>(
    (state, token, index) => {
      const startAngle = state.cursor;
      const endAngle = startAngle + token.percentage * 3.6;
      const midAngle = startAngle + (endAngle - startAngle) / 2;
      const radians = ((midAngle - 90) * Math.PI) / 180;
      const translateX = Math.cos(radians) * DONUT_HOVER_OFFSET;
      const translateY = Math.sin(radians) * DONUT_HOVER_OFFSET;

      return {
        cursor: endAngle,
        slices: [
          ...state.slices,
          {
            color: getResolvedWheelColor(index, visibleTokens.length, theme),
            hoverTransform: `translate(${translateX} ${translateY})`,
            path: getDonutSlicePath(startAngle, endAngle),
            token,
          },
        ],
      };
    },
    { cursor: 0, slices: [] },
  ).slices;
};

const WalletFlowHeader = ({
  address,
  canSubmit,
  isLoading,
  onAddressChange,
  onSubmit,
  snapshot,
}: {
  address: string;
  canSubmit: boolean;
  isLoading: boolean;
  onAddressChange: (address: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  snapshot?: WalletSnapshot;
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4 border-foreground/10 border-b pb-2 lg:gap-5 lg:pb-3">
    <div>
      <span className="font-anton text-muted-foreground text-sm uppercase">
        Wallet allocation
      </span>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <strong className="font-anton text-5xl leading-none md:text-6xl">
          {snapshot ? formatCompactUsd(snapshot.totalUsd) : '$0'}
        </strong>
        <span className="font-anton text-muted-foreground text-xl">
          {snapshot
            ? `${snapshot.pricedTokenCount} priced tokens`
            : 'Paste any Solana address'}
        </span>
      </div>
    </div>

    <form
      className="flex max-w-full border border-foreground/10"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="solana-wallet-address">
        Solana wallet address
      </label>
      <input
        autoComplete="off"
        className="h-10 w-78 max-w-[calc(100vw-7rem)] bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        id="solana-wallet-address"
        onChange={(event) => onAddressChange(event.target.value)}
        placeholder="Solana wallet address"
        spellCheck={false}
        value={address}
      />
      <button
        className={cn(
          'grid h-10 w-11 place-items-center border-foreground/10 border-l transition-colors',
          {
            'text-muted-foreground': !canSubmit,
            'hover:bg-foreground hover:text-background': canSubmit,
          },
        )}
        disabled={!canSubmit}
        type="submit"
      >
        {isLoading ? (
          <Loader2
            aria-label="Analyzing wallet"
            className="animate-spin"
            size={16}
          />
        ) : (
          <Search aria-hidden="true" size={16} />
        )}
      </button>
    </form>
  </div>
);

const WalletDonutPanel = ({
  donutSlices,
  highlightedToken,
  hoveredTokenMint,
  onHoverToken,
  snapshot,
}: {
  donutSlices: DonutSlice[];
  highlightedToken?: WalletToken;
  hoveredTokenMint?: string;
  onHoverToken: (mint?: string) => void;
  snapshot?: WalletSnapshot;
}) => (
  <div className="relative grid min-h-72 place-items-center border-foreground/10 border-r p-5 lg:min-h-80 lg:p-6">
    <div
      className="relative grid size-76 place-items-center lg:size-84"
      onPointerLeave={() => onHoverToken(undefined)}
    >
      <svg
        aria-label="Wallet allocation donut chart"
        className="size-full overflow-visible"
        role="img"
        viewBox="0 0 100 100"
      >
        {donutSlices.map((slice) => {
          const isHovered = slice.token.mint === hoveredTokenMint;

          return (
            <path
              className="transition-transform duration-150 ease-out"
              d={slice.path}
              fill={slice.color}
              key={slice.token.mint}
              onPointerEnter={() => onHoverToken(slice.token.mint)}
              transform={
                isHovered
                  ? `${slice.hoverTransform} translate(50 50) scale(1.05) translate(-50 -50)`
                  : undefined
              }
            />
          );
        })}
      </svg>
      <div className="pointer-events-none absolute grid size-34 place-items-center rounded-full border border-foreground/10 bg-background text-center lg:size-38">
        <div>
          <span className="font-anton text-muted-foreground text-xs uppercase">
            {highlightedToken ? highlightedToken.symbol : 'Total wallet'}
          </span>
          <p className="mt-1 font-anton text-3xl leading-none lg:text-4xl">
            {highlightedToken
              ? `${highlightedToken.percentage.toFixed(1)}%`
              : snapshot
                ? formatCompactUsd(snapshot.totalUsd)
                : '--'}
          </p>
        </div>
      </div>
    </div>

    {snapshot ? (
      <div className="absolute bottom-4 left-4 text-muted-foreground text-sm">
        {shortenAddress(snapshot.address)}
      </div>
    ) : null}
  </div>
);

const WalletPanelTabs = ({
  activePanel,
  onPanelChange,
}: {
  activePanel: WalletPanel;
  onPanelChange: (panel: WalletPanel) => void;
}) => (
  <div className="grid grid-cols-2 border-foreground/10 border-b">
    {(['tokens', 'transactions'] as const).map((panel) => (
      <button
        aria-pressed={activePanel === panel}
        className={cn(
          'border-foreground/10 border-l px-4 py-3 font-anton text-sm uppercase transition-colors first:border-l-0',
          {
            'bg-foreground text-background': activePanel === panel,
            'text-muted-foreground hover:bg-background': activePanel !== panel,
          },
        )}
        key={panel}
        onClick={() => onPanelChange(panel)}
        type="button"
      >
        {panel === 'tokens' ? 'Tokens' : 'Transactions'}
      </button>
    ))}
  </div>
);

const WalletTokenRow = ({
  chartIndex,
  isHighlighted,
  onHoverToken,
  token,
  visibleTokenCount,
}: {
  chartIndex: number;
  isHighlighted: boolean;
  onHoverToken: (mint?: string) => void;
  token: WalletToken;
  visibleTokenCount: number;
}) => (
  <button
    className={cn(
      'grid w-full grid-cols-[2.6rem_1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors',
      {
        'bg-background': isHighlighted,
      },
    )}
    key={token.mint}
    onBlur={() => onHoverToken(undefined)}
    onFocus={() => onHoverToken(token.mint)}
    onMouseEnter={() => onHoverToken(token.mint)}
    onMouseLeave={() => onHoverToken(undefined)}
    type="button"
  >
    <TokenLogo
      chartIndex={chartIndex}
      token={token}
      visibleTokenCount={visibleTokenCount}
    />
    <span className="min-w-0">
      <span className="block truncate font-anton text-xl leading-none">
        {formatCompactNumber(token.amount)} {token.symbol}
      </span>
      <span className="mt-1 block truncate text-muted-foreground text-sm">
        {token.name}
      </span>
    </span>
    <span className="text-right">
      <span className="block font-anton text-xl leading-none">
        {token.usdValue > 0 ? formatCompactUsd(token.usdValue) : '--'}
      </span>
      <span className="text-muted-foreground text-xs">
        {formatTokenUnitPrice(token.priceUsd)}
      </span>
    </span>
  </button>
);

const WalletTokenList = ({
  displayTokens,
  hoveredTokenMint,
  onHoverToken,
  visibleTokens,
}: {
  displayTokens: WalletToken[];
  hoveredTokenMint?: string;
  onHoverToken: (mint?: string) => void;
  visibleTokens: WalletToken[];
}) => (
  <>
    {displayTokens.map((token) => {
      const chartIndex = visibleTokens.findIndex(
        (visibleToken) => visibleToken.mint === token.mint,
      );

      return (
        <WalletTokenRow
          chartIndex={chartIndex}
          isHighlighted={token.mint === hoveredTokenMint}
          key={token.mint}
          onHoverToken={onHoverToken}
          token={token}
          visibleTokenCount={visibleTokens.length}
        />
      );
    })}
  </>
);

const WalletTransactionList = ({
  transactions,
}: {
  transactions: WalletTransaction[];
}) => {
  if (transactions.length === 0) {
    return (
      <div className="grid min-h-60 place-items-center px-6 text-center text-muted-foreground">
        No recent parsed transactions returned by Helius.
      </div>
    );
  }

  return transactions.map((transaction) => (
    <WalletTransactionRow
      key={transaction.signature}
      transaction={transaction}
    />
  ));
};

const WalletEmptyState = ({ onSampleClick }: { onSampleClick: () => void }) => (
  <div className="grid flex-1 place-items-center px-6 text-center">
    <div className="max-w-92">
      <p className="font-anton text-4xl leading-none">
        Inspect any Solana wallet.
      </p>
      <p className="mt-4 text-muted-foreground">
        Enter a public Solana address to display priced token balances and
        allocation weight, and a list of recent transactions.
      </p>
      <button
        className="mt-6 border border-foreground/10 px-4 py-2 font-anton text-sm uppercase transition-colors hover:bg-foreground hover:text-background"
        onClick={onSampleClick}
        type="button"
      >
        Analyze example wallet
      </button>
    </div>
  </div>
);

const WalletDetailsPanel = ({
  activePanel,
  displayTokens,
  error,
  hoveredTokenMint,
  onHoverToken,
  onPanelChange,
  onSampleClick,
  snapshot,
  visibleTokens,
  walletTransactions,
}: {
  activePanel: WalletPanel;
  displayTokens: WalletToken[];
  error?: string;
  hoveredTokenMint?: string;
  onHoverToken: (mint?: string) => void;
  onPanelChange: (panel: WalletPanel) => void;
  onSampleClick: () => void;
  snapshot?: WalletSnapshot;
  visibleTokens: WalletToken[];
  walletTransactions: WalletTransaction[];
}) => {
  if (error) {
    return (
      <div className="grid flex-1 place-items-center px-6 text-center">
        <span className="max-w-90 text-muted-foreground">{error}</span>
      </div>
    );
  }

  if (!snapshot) return <WalletEmptyState onSampleClick={onSampleClick} />;

  return (
    <>
      <WalletPanelTabs
        activePanel={activePanel}
        onPanelChange={onPanelChange}
      />
      <div className="min-h-0 flex-1 divide-y divide-foreground/10 overflow-y-auto">
        {activePanel === 'transactions' ? (
          <WalletTransactionList transactions={walletTransactions} />
        ) : (
          <WalletTokenList
            displayTokens={displayTokens}
            hoveredTokenMint={hoveredTokenMint}
            onHoverToken={onHoverToken}
            visibleTokens={visibleTokens}
          />
        )}
      </div>
    </>
  );
};

const WalletFlowDemo = () => {
  const [address, setAddress] = useState('');
  const [activePanel, setActivePanel] = useState<WalletPanel>('tokens');
  const [error, setError] = useState<string>();
  const [hoveredTokenMint, setHoveredTokenMint] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<WalletSnapshot>();
  const { theme } = useThemePreference();

  const visibleTokens = useMemo(
    () => getDisplayTokens(snapshot?.tokens ?? []),
    [snapshot],
  );
  const displayTokens = snapshot?.tokens ?? [];
  const walletTransactions = snapshot?.transactions ?? [];
  const canSubmit = address.trim().length > 0 && !isLoading;
  const highlightedToken = displayTokens.find(
    (token) => token.mint === hoveredTokenMint,
  );
  const donutSlices = useMemo(
    () => getWalletDonutSlices(visibleTokens, theme),
    [theme, visibleTokens],
  );

  const analyzeWallet = async (nextAddress: string) => {
    const normalizedAddress = normalizeSolanaAddress(nextAddress);

    if (!isSolanaAddress(normalizedAddress)) {
      setError('Enter a valid Solana wallet address.');
      return;
    }

    const cachedSnapshot = getWalletCache(normalizedAddress);
    if (cachedSnapshot) {
      setSnapshot(cachedSnapshot);
      setError(undefined);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(undefined);

    try {
      setSnapshot(
        await fetchSolanaWalletSnapshot(normalizedAddress, {
          signal: controller.signal,
        }),
      );
    } catch {
      setError('Wallet data unavailable, try again later.');
      setSnapshot(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void analyzeWallet(address);
  };

  const handleSampleClick = () => {
    setAddress(SAMPLE_SOLANA_ADDRESS);
    void analyzeWallet(SAMPLE_SOLANA_ADDRESS);
  };

  return (
    <div className="mt-auto flex min-h-0 flex-1 flex-col pt-3 lg:pt-5">
      <WalletFlowHeader
        address={address}
        canSubmit={canSubmit}
        isLoading={isLoading}
        onAddressChange={(nextAddress) => {
          setAddress(nextAddress);
          setError(undefined);
        }}
        onSubmit={handleSubmit}
        snapshot={snapshot}
      />

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] overflow-hidden border border-foreground/10 bg-background-light lg:mt-3">
        <WalletDonutPanel
          donutSlices={donutSlices}
          highlightedToken={highlightedToken}
          hoveredTokenMint={hoveredTokenMint}
          onHoverToken={setHoveredTokenMint}
          snapshot={snapshot}
        />

        <div className="flex min-h-0 flex-col">
          <WalletDetailsPanel
            activePanel={activePanel}
            displayTokens={displayTokens}
            error={error}
            hoveredTokenMint={hoveredTokenMint}
            onHoverToken={setHoveredTokenMint}
            onPanelChange={setActivePanel}
            onSampleClick={handleSampleClick}
            snapshot={snapshot}
            visibleTokens={visibleTokens}
            walletTransactions={walletTransactions}
          />
        </div>
      </div>

      <p className="mt-3 text-muted-foreground text-sm">
        Source: Helius Wallet + Enhanced Transactions API
        {snapshot ? ` (${formatMinutesAgo(snapshot.savedAt)})` : ''}.
      </p>
    </div>
  );
};

export default WalletFlowDemo;
