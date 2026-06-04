'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { useRevealSectionGsap } from '@/hooks/use-section-gsap';
import Image from 'next/image';
import { useRef } from 'react';

const SLIDE_UP_SELECTOR = '.slide-up';

type StackItem = {
  name: string;
  icon?: string;
};

type StackItemListProps = {
  items: StackItem[];
};

const StackItemList = ({ items }: StackItemListProps) => (
  <div className="flex flex-wrap gap-x-7 gap-y-5 sm:gap-x-11 sm:gap-y-7">
    {items.map((item) => (
      <div
        className="slide-up flex items-center gap-2.5 leading-none sm:gap-3.5"
        key={item.name}
      >
        {item.icon ? (
          <span className="inline-flex size-8 shrink-0 items-center justify-center sm:size-10">
            <Image
              src={item.icon}
              alt={item.name}
              width="40"
              height="40"
              className="size-6.5 object-contain sm:size-8"
            />
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm bg-background-light font-anton text-primary text-xs sm:size-10 sm:text-sm"
          >
            {item.name.slice(0, 2)}
          </span>
        )}
        <span className="text-xl capitalize sm:text-2xl">{item.name}</span>
      </div>
    ))}
  </div>
);

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useRevealSectionGsap({
    scope: containerRef,
    reveal: {
      ease: 'none',
      end: 'bottom 80%',
      scrub: 0.5,
      selector: SLIDE_UP_SELECTOR,
      stagger: 0.4,
      start: 'top 80%',
      y: 40,
    },
    exit: {
      end: 'bottom 10%',
      scrub: 0.65,
      start: 'bottom 45%',
      y: -150,
    },
  });

  return (
    <section className="py-section" id="my-stack" ref={containerRef}>
      <div className="container">
        <SectionTitle title="My Stack" />

        <div className="space-y-22 sm:space-y-30">
          {Object.entries(MY_STACK).map(([key, value]) => (
            <div className="grid gap-y-2 sm:grid-cols-12 sm:gap-x-6" key={key}>
              <div className="sm:order-2 sm:col-span-5 sm:flex sm:items-center">
                <p className="slide-up font-anton text-4xl text-muted-foreground uppercase leading-none md:text-5xl">
                  {key}
                </p>
              </div>

              <div className="sm:order-1 sm:col-span-7 sm:col-start-6">
                <StackItemList items={value.stack} />
              </div>
              <div className="slide-up flex items-center sm:order-2 sm:col-span-7">
                <div className="h-px w-full bg-foreground/15" />
              </div>
              <div className="sm:order-3 sm:col-span-7 sm:col-start-6">
                <StackItemList items={value.competencies} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
