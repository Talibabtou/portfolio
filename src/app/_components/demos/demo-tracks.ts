import type { DemoComponentProps, DemoTrack } from '@/types';
import {
  BarChart3,
  GitFork,
  Globe2,
  LineChart,
  WalletCards,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const renderDemoLoading = () => null;

const BitcoinMarketDemo = dynamic<DemoComponentProps>(
  () => import('@/app/_components/demos/BitcoinMarketDemo'),
  {
    loading: renderDemoLoading,
    ssr: false,
  },
);

const ProtocolHeatmapDemo = dynamic<DemoComponentProps>(
  () => import('@/app/_components/demos/ProtocolHeatmapDemo'),
  {
    loading: renderDemoLoading,
    ssr: false,
  },
);

const WalletFlowDemo = dynamic<DemoComponentProps>(
  () => import('@/app/_components/demos/WalletFlowDemo'),
  {
    loading: renderDemoLoading,
    ssr: false,
  },
);

const GitHubRadarDemo = dynamic<DemoComponentProps>(
  () => import('@/app/_components/demos/GitHubRadarDemo'),
  {
    loading: renderDemoLoading,
    ssr: false,
  },
);

const WorldMapDemo = dynamic<DemoComponentProps>(
  () => import('@/app/_components/demos/WorldMapDemo'),
  {
    loading: renderDemoLoading,
    ssr: false,
  },
);

export const DEMO_TRACKS: DemoTrack[] = [
  {
    Component: BitcoinMarketDemo,
    detail:
      'A custom chart surface using public market data, responsive SVG rendering, range state and pointer readouts.',
    eyebrow: 'Market interface',
    icon: LineChart,
    id: 'trading-view',
    label: 'BTC Chart',
    metrics: ['BTC / USD', '1D / 7D / 30D', 'CoinGecko'],
    preload: () => {
      void import('@/lib/demos/bitcoin-market').then((module) =>
        module.preloadBitcoinMarketDemo(),
      );
    },
    title: 'BTC / USD market chart with live API data.',
  },
  {
    Component: ProtocolHeatmapDemo,
    detail: 'Protocol revenue and growth from DefiLlama’s free API.',
    eyebrow: 'Crypto Protocol Heatmap',
    icon: BarChart3,
    id: 'protocol-heatmap',
    label: 'Crypto Protocol Heatmap',
    metrics: ['Revenue', 'Growth', 'TVL'],
    preload: () => {
      void import('@/lib/demos/protocol-heatmap').then((module) =>
        module.preloadProtocolHeatmapDemo(),
      );
    },
    title: 'A dense treemap for crypto protocol fundamentals.',
  },
  {
    Component: WalletFlowDemo,
    detail:
      'Read a Solana wallet, normalize SPL balances, price holdings and visualize allocation risk in one view.',
    eyebrow: 'Solana wallet',
    icon: WalletCards,
    id: 'wallet-flow',
    label: 'Wallet Viewer',
    metrics: ['SPL tokens', 'USD value', 'Allocation'],
    preload: () => {
      void import('@/lib/demos/wallet-flow').then((module) =>
        module.preloadWalletFlowDemo(),
      );
    },
    title: 'A Solana wallet viewer with token proportions.',
  },
  {
    Component: GitHubRadarDemo,
    detail:
      'A recruiter-friendly demo for API integration, ranking, pagination, rate-limit handling and skeleton states.',
    eyebrow: 'GitHub Radar',
    icon: GitFork,
    id: 'github-radar',
    label: 'GitHub Radar',
    metrics: ['Stars', 'Forks', 'Velocity'],
    preload: () => {
      void import('@/lib/demos/github-radar').then((module) =>
        module.preloadGitHubRadarDemo(),
      );
    },
    title: 'GitHub repository leaderboards from the public Search API.',
  },
  {
    Component: WorldMapDemo,
    detail:
      'Real earthquake coordinates from the past year, scaled by magnitude.',
    eyebrow: 'Seismic Activity',
    icon: Globe2,
    id: 'world-map',
    keepMountedWhenInactive: false,
    label: 'World Map',
    metrics: ['USGS', 'Real geo', '365 days'],
    preload: () => {
      void import('@/lib/demos/world-map').then((module) =>
        module.preloadWorldMapDemo(),
      );
    },
    title: 'A rotating map of global earthquakes from public geodata.',
  },
];
