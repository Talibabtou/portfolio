'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { gsap, useSectionGsap } from '@/lib/use-section-gsap';
import { useRef } from 'react';

const EXPERIENCE_ITEM_SELECTOR = '.experience-item';

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

        <div className="grid gap-14">
          {MY_EXPERIENCE.map((item) => (
            <div key={item.title} className="experience-item">
              <p className="text-muted-foreground text-xl">{item.company}</p>
              <p className="mt-3.5 mb-2.5 font-anton text-5xl leading-none">
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
