import { bitcoinMarketDemo } from '@/app/_components/demos/BitcoinMarketDemo';
import { githubRadarDemo } from '@/app/_components/demos/GitHubRadarDemo';
import { protocolHeatmapDemo } from '@/app/_components/demos/ProtocolHeatmapDemo';
import type { DemoTrack } from '@/app/_components/demos/types';
import { walletFlowDemo } from '@/app/_components/demos/WalletFlowDemo';
import { worldMapDemo } from '@/app/_components/demos/WorldMapDemo';

export const DEMO_TRACKS: DemoTrack[] = [
  bitcoinMarketDemo,
  protocolHeatmapDemo,
  worldMapDemo,
  githubRadarDemo,
  walletFlowDemo,
];
