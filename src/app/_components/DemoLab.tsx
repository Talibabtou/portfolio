'use client';

import SectionTitle from '@/components/SectionTitle';
import { DEMO_TRACKS } from '@/app/_components/demos/demo-tracks';
import type { DemoTrack } from '@/app/_components/demos/types';
import { useIntentPreload } from '@/lib/use-intent-preload';
import { useRevealSectionGsap } from '@/lib/use-section-gsap';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

type DemoTrackButtonProps = {
  children: ReactNode;
  onActivate: () => void;
  track: DemoTrack;
};

const DemoTrackButton = ({
  children,
  onActivate,
  track,
}: DemoTrackButtonProps) => {
  const preloadOnIntent = useIntentPreload(track.preload);

  const activateTrack = () => {
    preloadOnIntent();
    onActivate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    activateTrack();
  };

  return (
    <button
      className="relative flex h-full w-full min-w-0 flex-col p-5 text-left"
      onClick={activateTrack}
      onFocus={activateTrack}
      onKeyDown={handleKeyDown}
      onMouseEnter={preloadOnIntent}
      onTouchStart={preloadOnIntent}
      type="button"
    >
      {children}
    </button>
  );
};

const DemoLab = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTrackId, setActiveTrackId] = useState(DEMO_TRACKS[0].id);
  const activeTrack =
    DEMO_TRACKS.find((track) => track.id === activeTrackId) ?? DEMO_TRACKS[0];

  useRevealSectionGsap({
    scope: sectionRef,
    reveal: {
      end: 'top 35%',
      scrub: 0.6,
      selector: '.demo-reveal',
      stagger: 0.08,
      start: 'top 85%',
      y: 80,
    },
    exit: {
      end: 'bottom 10%',
      scrub: 0.55,
      start: 'bottom 45%',
      y: -120,
    },
  });

  return (
    <section
      className="relative flex min-h-svh items-center overflow-hidden pt-section pb-6"
      id="demo-lab"
      ref={sectionRef}
    >
      <div className="relative z-1 w-full px-15">
        <SectionTitle title="Demos" className="demo-reveal" />

        <div className="demo-reveal flex h-[min(--spacing(190),78svh)] min-h-150 gap-3 max-lg:h-auto max-lg:min-h-0 max-lg:flex-col">
          {DEMO_TRACKS.map((track) => {
            const isActive = track.id === activeTrack.id;
            const Icon = track.icon;
            const TrackComponent = track.Component;
            const trackHeader = isActive ? (
              <div
                className="relative z-1 flex items-center justify-between gap-4"
                key={`${track.id}-header`}
              >
                <Icon className="text-primary" size={24} />
                <span className="font-anton text-muted-foreground text-sm uppercase">
                  {track.eyebrow}
                </span>
              </div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                key={`${track.id}-icon`}
              >
                <Icon className="text-primary" size={32} />
              </div>
            );

            return (
              <div
                className={cn(
                  'group relative overflow-hidden border border-foreground/10 text-left transition-[flex,background-color,color] duration-300 ease-out',
                  'max-lg:min-h-26 max-lg:w-full',
                  {
                    'flex-6 bg-background': isActive,
                    'flex-[0.45] cursor-pointer bg-background-light hover:bg-background':
                      !isActive,
                  },
                )}
                key={track.id}
              >
                {isActive ? (
                  <div className="relative flex h-full min-w-0 flex-col p-5">
                    {trackHeader}
                    <TrackComponent />
                  </div>
                ) : (
                  <DemoTrackButton
                    onActivate={() => setActiveTrackId(track.id)}
                    track={track}
                  >
                    {trackHeader}

                    <div className="mt-auto translate-y-8 opacity-0 transition-all duration-300 max-lg:translate-y-0 max-lg:opacity-100">
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
                      <h3 className="max-w-155 font-anton text-5xl leading-none md:text-7xl">
                        {track.title}
                      </h3>
                      <p className="mt-5 max-w-135 text-lg text-muted-foreground">
                        {track.detail}
                      </p>
                    </div>
                  </DemoTrackButton>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DemoLab;
