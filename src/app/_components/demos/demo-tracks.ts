import { bitcoinMarketDemo } from '@/app/_components/demos/BitcoinMarketDemo';
import { githubRadarDemo } from '@/app/_components/demos/GitHubRadarDemo';
import { protocolHeatmapDemo } from '@/app/_components/demos/ProtocolHeatmapDemo';
import { walletFlowDemo } from '@/app/_components/demos/WalletFlowDemo';
import { worldMapDemo } from '@/app/_components/demos/WorldMapDemo';
import type { DemoTrack } from '@/types';

export const DEMO_TRACKS: DemoTrack[] = [
  bitcoinMarketDemo,
  protocolHeatmapDemo,
  walletFlowDemo,
  githubRadarDemo,
  worldMapDemo,
];
