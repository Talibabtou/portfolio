'use client';
import { useRevealSectionGsap } from '@/hooks/use-section-gsap';
import Image from 'next/image';
import { useRef } from 'react';

const REVEAL_SELECTOR = '.slide-up-and-fade';

const AboutMe = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useRevealSectionGsap({
    scope: sectionRef,
    reveal: {
      end: 'bottom 80%',
      scrub: 0.5,
      selector: REVEAL_SELECTOR,
      stagger: 0.05,
      start: 'top 70%',
      y: 150,
    },
    exit: {
      end: 'bottom 10%',
      scrub: 0.45,
      start: 'bottom 45%',
      y: -150,
    },
  });

  return (
    <section className="py-section" id="about-me" ref={sectionRef}>
      <div className="container">
        <h2
          className="slide-up-and-fade mb-20 font-thin text-4xl md:text-6xl"
          data-section-anchor
        >
          I care about interfaces that feel clear, fast and reliable when the
          product gets complex.
        </h2>

        <p className="slide-up-and-fade border-b pb-3 text-muted-foreground">
          About me
        </p>

        <div className="mx-auto mt-9 grid max-w-235 items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="slide-up-and-fade text-5xl">I&apos;m Guillaume,</p>
            <div className="mt-8 max-w-97.5 text-lg text-muted-foreground">
              <p className="slide-up-and-fade">
                A frontend developer from France, focused on Web3 and fintech
                products: trading market screens, dashboards, wallet flows &
                API-connected interfaces.
              </p>
              <p className="slide-up-and-fade mt-3">
                Before code, I made leather goods at Hermes.
                <br />
                42 Lyon gave me the engineering base; craft gave me patience,
                precision and a high bar for finished work.
              </p>
            </div>
          </div>

          <div className="md:col-span-6 md:flex md:justify-end">
            <div className="portrait-hover slide-up-and-fade group relative w-full max-w-80">
              <span
                aria-hidden="true"
                className="portrait-border-wave absolute inset-0 border border-primary/60 opacity-0"
              />
              <span
                aria-hidden="true"
                className="portrait-border-wave portrait-border-wave-delay absolute inset-0 border border-primary/40 opacity-0"
              />
              <span
                aria-hidden="true"
                className="portrait-border-wave portrait-border-wave-delay-long absolute inset-0 border border-primary/25 opacity-0"
              />
              <Image
                src="/cv/gdumas.jpg"
                alt="Portrait of Guillaume Dumas"
                width="320"
                height="427"
                className="relative aspect-3/4 w-full object-cover saturate-[0.45] transition duration-700 group-hover:scale-[1.02] group-hover:saturate-100"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
