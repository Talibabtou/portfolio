'use client';
import SectionTitle from '@/components/SectionTitle';
import { gsap, useSectionGsap } from '@/lib/use-section-gsap';
import { cn } from '@/lib/utils';
import {
    BarChart3,
    GitFork,
    Globe2,
    LineChart,
    WalletCards,
} from 'lucide-react';
import { useRef, useState } from 'react';

const DEMO_TRACKS = [
  {
    id: 'trading-view',
    label: 'Trading View',
    eyebrow: 'Market interface',
    title: 'Full-screen market chart with position context.',
    detail:
      'A future demo can embed a TradingView-style chart, order state, mark price, funding, liquidation and risk microcopy.',
    icon: LineChart,
    metrics: ['BTC-PERP', '+2.48%', '$104,220'],
  },
  {
    id: 'data-room',
    label: 'Data Room',
    eyebrow: 'Public API dashboard',
    title: 'A dense data workspace fed by public endpoints.',
    detail:
      'This can show filters, freshness, loading states, empty states and decision-ready visual hierarchy.',
    icon: BarChart3,
    metrics: ['12 feeds', '430ms', 'Live'],
  },
  {
    id: 'world-map',
    label: 'World Map',
    eyebrow: 'Geographic signal',
    title: 'A global activity map with animated event dots.',
    detail:
      'Could visualize validator locations, product usage, network latency, GitHub activity or transaction flow.',
    icon: Globe2,
    metrics: ['42 nodes', '18 regions', 'Pulse'],
  },
  {
    id: 'github-radar',
    label: 'GitHub Radar',
    eyebrow: 'Developer signal',
    title: 'Most-liked repositories from the public GitHub API.',
    detail:
      'A recruiter-friendly demo for API integration, ranking, pagination, rate-limit handling and skeleton states.',
    icon: GitFork,
    metrics: ['Stars', 'Topics', 'Velocity'],
  },
  {
    id: 'wallet-flow',
    label: 'Wallet Flow',
    eyebrow: 'Web3 UX',
    title: 'Wallet states that make transaction risk readable.',
    detail:
      'Connected, signing, pending, confirmed and failed states with copy that helps users understand what happens next.',
    icon: WalletCards,
    metrics: ['Sign', 'Pending', 'Settled'],
  },
];

const DemoLab = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTrackId, setActiveTrackId] = useState(DEMO_TRACKS[0].id);
  const activeTrack =
    DEMO_TRACKS.find((track) => track.id === activeTrackId) ?? DEMO_TRACKS[0];
  const ActiveIcon = activeTrack.icon;

  useSectionGsap({
    scope: sectionRef,
    setup: ({ root, select }) => {
      const revealElements = select('.demo-reveal');

      gsap
        .timeline({
          scrollTrigger: {
            end: 'top 35%',
            scrub: 0.6,
            start: 'top 85%',
            trigger: root,
          },
        })
        .from(revealElements, {
          autoAlpha: 0,
          stagger: 0.08,
          y: 80,
        });

      gsap
        .timeline({
          scrollTrigger: {
            end: 'bottom 10%',
            scrub: 0.55,
            start: 'bottom 45%',
            trigger: root,
          },
        })
        .to(root, {
          autoAlpha: 0,
          y: -120,
        });
    },
  });

  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden pt-section pb-6"
      id="demo-lab"
      ref={sectionRef}
    >
      <div className="relative z-1 w-full px-4">
        <SectionTitle
          title="Demos"
          className="demo-reveal pl-[7%]"
          classNames={{ title: 'font-anton text-2xl' }}
        />

        <div className="demo-reveal flex h-[min(760px,78svh)] min-h-[600px] gap-3 max-lg:h-auto max-lg:min-h-0 max-lg:flex-col">
          {DEMO_TRACKS.map((track) => {
            const isActive = track.id === activeTrack.id;
            const Icon = track.icon;

            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  'group relative overflow-hidden border border-foreground/10 bg-background-light text-left transition-[flex,background-color,color] duration-500 ease-out',
                  'max-lg:min-h-[104px] max-lg:w-full',
                  {
                    'flex-[6] bg-background': isActive,
                    'flex-[0.8] hover:bg-background': !isActive,
                  },
                )}
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                onFocus={() => setActiveTrackId(track.id)}
                type="button"
              >
                <div className="relative flex h-full min-w-0 flex-col p-5">
                  {isActive ? (
                    <div className="flex items-center justify-between gap-4">
                      <Icon className="text-primary" size={24} />
                      <span className="font-anton text-muted-foreground text-sm uppercase">
                        {track.eyebrow}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="text-primary" size={32} />
                    </div>
                  )}

                  <div
                    className={cn('mt-auto transition-all duration-500', {
                      'translate-y-0 opacity-100': isActive,
                      'translate-y-8 opacity-0 max-lg:translate-y-0 max-lg:opacity-100':
                        !isActive,
                    })}
                  >
                    <div className="mb-8 flex flex-wrap gap-3">
                      {track.metrics.map((metric) => (
                        <span
                          className="border border-foreground/15 px-3 py-1 font-anton text-sm"
                          key={metric}
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                    <h3 className="max-w-[620px] font-anton text-5xl leading-none md:text-7xl">
                      {track.title}
                    </h3>
                    <p className="mt-5 max-w-[540px] text-lg text-muted-foreground">
                      {track.detail}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute right-[7%] bottom-12 hidden text-primary/20 lg:block">
          <ActiveIcon size={180} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
};

export default DemoLab;
