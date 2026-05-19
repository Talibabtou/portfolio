'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
  const container = useRef<HTMLDivElement>(null);

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
        <h2 className="slide-up-and-fade mb-20 font-thin text-4xl md:text-6xl">
          I turn complex product flows into clear, maintainable interfaces for
          Web3, fintech and data-heavy teams.
        </h2>

        <p className="slide-up-and-fade border-b pb-3 text-muted-foreground">
          Profile
        </p>

        <div className="mt-9 grid md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="slide-up-and-fade text-5xl">
              Hi, I&apos;m Guillaume.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="max-w-[450px] text-lg text-muted-foreground">
              <p className="slide-up-and-fade">
                I&apos;m a frontend developer focused on product interfaces
                where clarity matters: trading workflows, prediction markets,
                dashboards, wallet-aware UX and API-connected screens.
              </p>
              <p className="slide-up-and-fade mt-3">
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
