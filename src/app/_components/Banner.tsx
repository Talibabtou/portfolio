'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import { GENERAL_INFO } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Banner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // move the content a little up on scroll
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 70%',
          end: 'bottom 10%',
          scrub: 1,
        },
      });

      tl.fromTo(
        '.slide-up-and-fade',
        { y: 0 },
        { y: -150, opacity: 0, stagger: 0.02 },
      );
    },
    { scope: containerRef },
  );

  return (
    <section className="relative overflow-hidden" id="banner">
      <ArrowAnimation />
      <div
        className="flex h-svh min-h-[530px] items-center justify-between px-4 max-md:flex-col max-md:pb-10"
        ref={containerRef}
      >
        <div className="max-w-[544px] flex-col items-start justify-center pl-[7%] max-md:flex max-md:grow">
          <h1 className="banner-title slide-up-and-fade font-anton text-6xl leading-[.95] sm:text-[80px]">
            <span className="text-primary">FRONTEND </span>
            <br /> <span className="ml-4">DEVELOPER</span>
          </h1>
          <p className="banner-description slide-up-and-fade mt-6 text-lg text-muted-foreground">
            Hi, I&apos;m{' '}
            <span className="font-medium text-foreground">Talibabtou</span>. I
            build Web3 and fintech product interfaces: prediction markets,
            trading, prediction markets, wallet-aware flows and API-connected
            screens.
          </p>
          <Button
            as="link"
            target="_blank"
            rel="noopener noreferrer"
            href={GENERAL_INFO.linkedinProfile}
            variant="primary"
            className="banner-button slide-up-and-fade mt-9"
          >
            View LinkedIn
          </Button>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Available for full-time opportunities
            </span>
          </div>
        </div>

        <div className="right-[7%] bottom-[10%] flex gap-4 text-center md:absolute md:flex-col md:gap-8 md:text-right">
          <div className="slide-up-and-fade">
            <h5 className="mb-1.5 font-anton text-3xl text-primary sm:text-4xl">
              42
            </h5>
            <p className="text-muted-foreground">Lyon Common Core</p>
          </div>
          <div className="slide-up-and-fade">
            <h5 className="mb-1.5 font-anton text-3xl text-primary sm:text-4xl">
              Web3
            </h5>
            <p className="text-muted-foreground">Solana & DeFi Interfaces</p>
          </div>
          <div className="slide-up-and-fade">
            <h5 className="mb-1.5 font-anton text-3xl text-primary sm:text-4xl">
              Craft
            </h5>
            <p className="text-muted-foreground">Hermes Quality Standards</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
