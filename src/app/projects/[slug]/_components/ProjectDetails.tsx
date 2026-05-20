'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import TransitionLink from '@/components/TransitionLink';
import { gsap, useGSAP } from '@/lib/gsap';
import type { IProject } from '@/types';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  project: IProject;
}

const ProjectDetails = ({ project }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.set('.fade-in-later', {
        autoAlpha: 0,
        y: 30,
      });
      const tl = gsap.timeline({
        delay: 0.5,
      });

      tl.to('.fade-in-later', {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
      });
    },
    { scope: containerRef },
  );

  // blur info div and make it smaller on scroll
  useGSAP(
    () => {
      if (window.innerWidth < 992) return;

      gsap.to('#info', {
        filter: 'blur(3px)',
        autoAlpha: 0,
        scale: 0.9,
        // position: 'sticky',
        scrollTrigger: {
          trigger: '#info',
          start: 'bottom bottom',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          scrub: 0.5,
        },
      });
    },
    { scope: containerRef },
  );

  // parallax effect on images
  useGSAP(
    () => {
      gsap.utils
        .toArray<HTMLDivElement>('#images > div')
        .forEach((imageDiv, i) => {
          gsap.to(imageDiv, {
            backgroundPosition: `center 0%`,
            ease: 'none',
            scrollTrigger: {
              trigger: imageDiv,
              start: () => (i ? 'top bottom' : 'top 50%'),
              end: 'bottom top',
              scrub: true,
              // invalidateOnRefresh: true, // to make it responsive
            },
          });
        });
    },
    { scope: containerRef },
  );

  return (
    <section className="pt-5 pb-14">
      <div className="container" ref={containerRef}>
        <TransitionLink
          back
          href="/"
          className="group mb-16 inline-flex h-12 items-center gap-2"
        >
          <ArrowLeft className="transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
          Back
        </TransitionLink>

        <div className="top-0 flex min-h-[calc(100svh-100px)]" id="info">
          <div className="relative w-full">
            <div className="mx-auto mb-10 flex max-w-[635px] items-start gap-6">
              <h1 className="fade-in-later overflow-hidden font-anton text-4xl leading-none opacity-0 md:text-[60px]">
                <span className="inline-block">{project.title}</span>
              </h1>

              <div className="fade-in-later flex gap-2 opacity-0">
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-primary"
                  >
                    <GitBranch size={30} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-primary"
                  >
                    <ExternalLink size={30} />
                  </a>
                )}
              </div>
            </div>

            <div className="mx-auto max-w-[635px] space-y-7 pb-20">
              <div className="fade-in-later">
                <p className="mb-3 font-anton text-muted-foreground">Year</p>

                <div className="text-lg">{project.year}</div>
              </div>
              <div className="fade-in-later">
                <p className="mb-3 font-anton text-muted-foreground">
                  Tech & Technique
                </p>

                <div className="text-lg">{project.techStack.join(', ')}</div>
              </div>
              <div className="fade-in-later">
                <p className="mb-3 font-anton text-muted-foreground">
                  Description
                </p>

                <div className="prose-xl markdown-text text-lg">
                  {project.description.map((paragraph) => (
                    <p className="mb-3 last:mb-0" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              {project.role.length > 0 && (
                <div className="fade-in-later">
                  <p className="mb-3 font-anton text-muted-foreground">
                    My Role
                  </p>

                  <div className="text-lg">
                    {project.role.map((paragraph) => (
                      <p className="mb-3 last:mb-0" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <ArrowAnimation />
          </div>
        </div>

        <div
          className="fade-in-later relative mx-auto flex max-w-[800px] flex-col gap-2"
          id="images"
        >
          {project.images.map((image) => (
            <div
              key={image}
              className="group relative aspect-[750/400] w-full bg-background-light"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 50%',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <a
                href={image}
                target="_blank"
                className="absolute top-4 right-4 inline-flex size-12 items-center justify-center bg-background/70 text-foreground opacity-0 transition-all hover:bg-primary hover:text-primary-foreground group-hover:opacity-100"
                rel="noopener"
              >
                <ExternalLink />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
