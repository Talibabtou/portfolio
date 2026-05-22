import { BarChart3 } from 'lucide-react';
import PlaceholderDemo from '@/app/_components/demos/PlaceholderDemo';
import type { DemoTrack } from '@/app/_components/demos/types';

const dataRoomContent = {
  detail:
    'This can show filters, freshness, loading states, empty states and decision-ready visual hierarchy.',
  eyebrow: 'Public API dashboard',
  icon: BarChart3,
  id: 'data-room',
  label: 'Data Room',
  metrics: ['12 feeds', '430ms', 'Live'],
  title: 'A dense data workspace fed by public endpoints.',
};

const DataRoomDemo = () => <PlaceholderDemo {...dataRoomContent} />;

export const dataRoomDemo = {
  ...dataRoomContent,
  Component: DataRoomDemo,
} satisfies DemoTrack;
