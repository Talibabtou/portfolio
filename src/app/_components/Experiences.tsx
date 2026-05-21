'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { gsap, useSectionGsap } from '@/lib/use-section-gsap';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRef } from 'react';

const EXPERIENCE_ITEM_SELECTOR = '.experience-item';

const getExperienceMark = (company: string) =>
  company
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

const Experiences = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useSectionGsap({
    scope: containerRef,
    setup: ({ root, select }) => {
      const experienceItems = select(EXPERIENCE_ITEM_SELECTOR);

      experienceItems.forEach((experienceItem) => {
        gsap.fromTo(
          experienceItem,
          {
            autoAlpha: 0,
            y: 50,
          },
          {
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              end: 'top 60%',
              scrub: 0.5,
              start: 'top 85%',
              trigger: experienceItem,
            },
            y: 0,
          },
        );
      });

      gsap
        .timeline({
          scrollTrigger: {
            end: 'bottom 10%',
            scrub: 0.65,
            start: 'bottom 45%',
            trigger: root,
          },
        })
        .to(root, {
          opacity: 0,
          y: -80,
        });
    },
  });

  return (
    <section className="py-section" id="my-experience">
      <div className="container" ref={containerRef}>
        <SectionTitle title="My Experience" />

        <div className="relative mx-auto max-w-[920px]">
          <div
            aria-hidden="true"
            className="experience-timeline-line absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-foreground/15 md:block"
          />

          <div className="grid gap-14 md:gap-0">
            {MY_EXPERIENCE.map((item, index) => {
              const isReversed = index % 2 === 1;
              const mark = getExperienceMark(item.company);

              return (
                <div
                  className="experience-item relative grid items-center gap-5 md:grid-cols-[1fr_5rem_1fr] md:gap-0 md:py-8"
                  key={`${item.company}-${item.title}`}
                >
                  <div
                    className={cn('flex md:px-8', {
                      'justify-start md:order-3': isReversed,
                      'justify-start md:justify-end': !isReversed,
                    })}
                  >
                    {item.logo ? (
                      <div className="flex size-18 items-center justify-center">
                        <Image
                          src={item.logo}
                          alt={`${item.company} logo`}
                          width="72"
                          height="72"
                          className="h-full max-w-none object-contain"
                          style={{ width: 'auto' }}
                        />
                      </div>
                    ) : (
                      <div className="flex size-18 items-center justify-center border border-foreground/15 bg-background-light font-anton text-primary text-xl uppercase">
                        {mark}
                      </div>
                    )}
                  </div>

                  <div className="relative hidden justify-center md:order-2 md:flex">
                    <div className="relative z-1 size-4 rounded-full border border-primary bg-background shadow-[0_0_0_0.5rem_hsl(var(--background))]" />
                  </div>

                  <div
                    className={cn('md:px-8', {
                      'md:order-1 md:text-right': isReversed,
                      'md:order-3': !isReversed,
                    })}
                  >
                    <p className="text-lg text-muted-foreground">
                      {item.duration}
                    </p>
                    <p className="mt-2 font-anton text-4xl leading-none md:text-5xl">
                      {item.title}
                    </p>
                    <p className="mt-3 text-muted-foreground text-xl">
                      {item.company}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
