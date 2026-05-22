import { Globe2 } from 'lucide-react';
import PlaceholderDemo from '@/app/_components/demos/PlaceholderDemo';
import type { DemoTrack } from '@/app/_components/demos/types';

const worldMapContent = {
  detail:
    'Could visualize validator locations, product usage, network latency, GitHub activity or transaction flow.',
  eyebrow: 'Geographic signal',
  icon: Globe2,
  id: 'world-map',
  label: 'World Map',
  metrics: ['42 nodes', '18 regions', 'Pulse'],
  title: 'A global activity map with animated event dots.',
};

const WorldMapDemo = () => <PlaceholderDemo {...worldMapContent} />;

export const worldMapDemo = {
  ...worldMapContent,
  Component: WorldMapDemo,
} satisfies DemoTrack;
