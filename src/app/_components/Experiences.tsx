'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import {
  gsap,
  useRevealSectionGsap,
  useSectionGsap,
} from '@/hooks/use-section-gsap';
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
    setup: ({ select }) => {
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
    },
  });

  useRevealSectionGsap({
    scope: containerRef,
    exit: {
      end: 'bottom 10%',
      scrub: 0.65,
      start: 'bottom 45%',
      y: -80,
    },
  });

  return (
    <section className="py-section" id="my-experience">
      <div className="container" ref={containerRef}>
        <SectionTitle title="My Experience" />

        <div className="relative mx-auto max-w-230">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-2 w-px -translate-x-1/2 bg-foreground/15 md:left-1/2"
          />

          <div className="grid gap-14 md:gap-0">
            {MY_EXPERIENCE.map((item, index) => {
              const isReversed = index % 2 === 1;
              const mark = getExperienceMark(item.company);

              return (
                <div
                  className="experience-item relative grid grid-cols-[1rem_1fr] items-start gap-x-5 gap-y-5 md:grid-cols-[1fr_5rem_1fr] md:items-center md:gap-0 md:py-8"
                  key={`${item.company}-${item.title}`}
                >
                  <div
                    className={cn('col-start-2 flex md:col-auto md:px-8', {
                      'justify-start md:order-3': isReversed,
                      'justify-start md:justify-end': !isReversed,
                    })}
                  >
                    {item.logo ? (
                      <div className="relative flex h-18 w-28 items-center justify-center md:size-18">
                        <Image
                          src={item.logo}
                          alt={`${item.company} logo`}
                          fill
                          sizes="(min-width: 768px) 4.5rem, 7rem"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex size-18 items-center justify-center border border-foreground/15 bg-background-light font-anton text-primary text-xl uppercase">
                        {mark}
                      </div>
                    )}
                  </div>

                  <div className="relative col-start-1 row-span-2 flex justify-center pt-7 md:order-2 md:col-auto md:row-auto md:pt-0">
                    <div className="relative z-1 size-4 rounded-full border border-primary bg-background shadow-[0_0_0_0.5rem_hsl(var(--background))]" />
                  </div>

                  <div
                    className={cn('col-start-2 md:col-auto md:px-8', {
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
