'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slideUpEl = containerRef.current?.querySelectorAll('.slide-up');

      if (!slideUpEl?.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: 0.5,
        },
      });

      tl.from('.slide-up', {
        opacity: 0,
        y: 40,
        ease: 'none',
        stagger: 0.4,
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 50%',
          end: 'bottom 10%',
          scrub: 1,
        },
      });

      tl.to(containerRef.current, {
        y: -150,
        opacity: 0,
      });
    },
    { scope: containerRef },
  );

  return (
    <section id="my-stack" ref={containerRef}>
      <div className="container">
        <SectionTitle title="My Stack" />

        <div className="space-y-20">
          {Object.entries(MY_STACK).map(([key, value]) => (
            <div className="grid sm:grid-cols-12" key={key}>
              <div className="sm:col-span-5">
                <p className="slide-up font-anton text-5xl text-muted-foreground uppercase leading-none">
                  {key}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-11 gap-y-9 sm:col-span-7">
                {value.map((item) => (
                  <div
                    className="slide-up flex items-center gap-3.5 leading-none"
                    key={item.name}
                  >
                    {item.icon ? (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width="40"
                        height="40"
                        className="max-h-10"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-sm bg-background-light font-anton text-primary text-sm"
                      >
                        {item.name.slice(0, 2)}
                      </span>
                    )}
                    <span className="text-2xl capitalize">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
