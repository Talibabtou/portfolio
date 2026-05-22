import { WalletCards } from 'lucide-react';
import PlaceholderDemo from '@/app/_components/demos/PlaceholderDemo';
import type { DemoTrack } from '@/app/_components/demos/types';

const walletFlowContent = {
  detail:
    'Connected, signing, pending, confirmed and failed states with copy that helps users understand what happens next.',
  eyebrow: 'Web3 UX',
  icon: WalletCards,
  id: 'wallet-flow',
  label: 'Wallet Flow',
  metrics: ['Sign', 'Pending', 'Settled'],
  title: 'Wallet states that make transaction risk readable.',
};

const WalletFlowDemo = () => <PlaceholderDemo {...walletFlowContent} />;

export const walletFlowDemo = {
  ...walletFlowContent,
  Component: WalletFlowDemo,
} satisfies DemoTrack;
