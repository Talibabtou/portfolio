'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils
        .toArray<HTMLElement>('.experience-item')
        .forEach((experienceItem) => {
          gsap.fromTo(
            experienceItem,
            {
              autoAlpha: 0,
              y: 50,
            },
            {
              autoAlpha: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: experienceItem,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.5,
              },
            },
          );
        });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 60%',
          end: 'bottom 45%',
          scrub: 1,
        },
      });

      tl.to(containerRef.current, {
        y: -80,
        opacity: 0,
      });
    },
    { scope: containerRef },
  );

  return (
    <section className="py-section" id="my-experience">
      <div className="container" ref={containerRef}>
        <SectionTitle title="My Experience" />

        <div className="grid gap-14">
          {MY_EXPERIENCE.map((item) => (
            <div key={item.title} className="experience-item">
              <p className="text-xl text-muted-foreground">{item.company}</p>
              <p className="text-5xl font-anton leading-none mt-3.5 mb-2.5">
                {item.title}
              </p>
              <p className="text-lg text-muted-foreground">{item.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
