'use client';
import { gsap, useSectionGsap } from '@/lib/use-section-gsap';
import { useRef } from 'react';

const REVEAL_SELECTOR = '.slide-up-and-fade';

const AboutMe = () => {
  const container = useRef<HTMLDivElement>(null);

  useSectionGsap({
    scope: container,
    setup: ({ root, select }) => {
      const revealElements = select(REVEAL_SELECTOR);

      gsap
        .timeline({
          scrollTrigger: {
            id: 'about-me-in',
            end: 'bottom bottom',
            scrub: 0.5,
            start: 'top 70%',
            trigger: root,
          },
        })
        .from(revealElements, {
          opacity: 0,
          stagger: 0.05,
          y: 150,
        });

      gsap
        .timeline({
          scrollTrigger: {
            id: 'about-me-out',
            end: 'bottom 10%',
            scrub: 0.45,
            start: 'bottom 45%',
            trigger: root,
          },
        })
        .to(revealElements, {
          opacity: 0,
          stagger: 0.02,
          y: -150,
        });
    },
  });

  return (
    <section className="py-section" id="about-me">
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
