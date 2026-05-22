import { bitcoinMarketDemo } from '@/app/_components/demos/BitcoinMarketDemo';
import { dataRoomDemo } from '@/app/_components/demos/DataRoomDemo';
import { githubRadarDemo } from '@/app/_components/demos/GitHubRadarDemo';
import type { DemoTrack } from '@/app/_components/demos/types';
import { walletFlowDemo } from '@/app/_components/demos/WalletFlowDemo';
import { worldMapDemo } from '@/app/_components/demos/WorldMapDemo';

export const DEMO_TRACKS: DemoTrack[] = [
  bitcoinMarketDemo,
  dataRoomDemo,
  worldMapDemo,
  githubRadarDemo,
  walletFlowDemo,
];
