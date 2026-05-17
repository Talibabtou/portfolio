'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
  const container = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'about-me-in',
          trigger: container.current,
          start: 'top 70%',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      tl.from('.slide-up-and-fade', {
        y: 150,
        opacity: 0,
        stagger: 0.05,
      });
    },
    { scope: container },
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'about-me-out',
          trigger: container.current,
          start: 'bottom 50%',
          end: 'bottom 10%',
          scrub: 0.5,
        },
      });

      tl.to('.slide-up-and-fade', {
        y: -150,
        opacity: 0,
        stagger: 0.02,
      });
    },
    { scope: container },
  );

  return (
    <section className="pb-section" id="about-me">
      <div className="container" ref={container}>
        <h2 className="text-4xl md:text-6xl font-thin mb-20 slide-up-and-fade">
          I turn complex product flows into clear, maintainable interfaces for
          Web3, fintech and data-heavy teams.
        </h2>

        <p className="pb-3 border-b text-muted-foreground slide-up-and-fade">
          Profile
        </p>

        <div className="grid md:grid-cols-12 mt-9">
          <div className="md:col-span-5">
            <p className="text-5xl slide-up-and-fade">
              Hi, I&apos;m Guillaume.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="text-lg text-muted-foreground max-w-[450px]">
              <p className="slide-up-and-fade">
                I&apos;m a frontend developer focused on product interfaces
                where clarity matters: trading workflows, prediction markets,
                dashboards, wallet-aware UX and API-connected screens.
              </p>
              <p className="mt-3 slide-up-and-fade">
                My background combines the rigor of the 42 Lyon Common Core with
                high-end craftsmanship experience at Hermes. That mix shapes how
                I work: precise implementation, strong quality standards,
                product judgment and a bias toward interfaces that stay
                maintainable as the product grows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
