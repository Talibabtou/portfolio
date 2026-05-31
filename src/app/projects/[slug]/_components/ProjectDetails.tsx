'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import TransitionLink from '@/components/TransitionLink';
import { gsap, useGSAP } from '@/lib/gsap';
import type { IProject } from '@/types';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';

interface Props {
  project: IProject;
}

type ProjectCaseStudySection = {
  title: string;
  items: string[];
};

const getProjectCaseStudySections = (project: IProject) =>
  [
    {
      title: 'Context',
      items: project.context,
    },
    {
      title: 'Problem',
      items: project.problem,
    },
    {
      title: 'Contributions',
      items: project.contributions,
    },
    {
      title: 'Technical Decisions',
      items: project.decisions,
    },
    {
      title: 'Result',
      items: project.results,
    },
  ].filter((section): section is ProjectCaseStudySection =>
    Boolean(section.items && section.items.length > 0),
  );

const getMediaLabel = (src: string) => {
  const filename = src.split('/').pop()?.split('.')[0] ?? 'Media';

  return filename
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isVideoMedia = (src: string) => {
  return src.endsWith('.mp4') || src.endsWith('.webm');
};

type ProjectMediaGalleryProps = {
  project: IProject;
};

const ProjectMediaGallery = ({ project }: ProjectMediaGalleryProps) => {
  const shouldUseCarousel =
    project.slug === 'ft-transcendence' && project.images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = project.images[activeIndex];
  const mediaLabels = useMemo(
    () => project.images.map((image) => getMediaLabel(image)),
    [project.images],
  );

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? project.images.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === project.images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  if (!shouldUseCarousel) {
    return (
      <div
        className="fade-in-later relative mx-auto flex max-w-200 flex-col gap-2"
        id="images"
      >
        {project.images.map((image) => (
          <div
            key={image}
            className="project-media-frame group relative w-full overflow-hidden bg-background-light"
          >
            <Image
              alt={`${project.title} screenshot`}
              className="h-auto w-full"
              height={800}
              sizes="(min-width: 1024px) 50rem, calc(100vw - 2rem)"
              src={image}
              width={1200}
            />
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
    );
  }

  return (
    <div className="fade-in-later mx-auto max-w-200" id="images">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-anton text-muted-foreground uppercase">
            {mediaLabels[activeIndex]}
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            {activeIndex + 1} / {project.images.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Previous media"
            className="inline-flex size-11 items-center justify-center bg-background-light text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={showPreviousImage}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            aria-label="Next media"
            className="inline-flex size-11 items-center justify-center bg-background-light text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={showNextImage}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          <a
            aria-label="Open current media"
            className="inline-flex size-11 items-center justify-center bg-background-light text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            href={activeImage}
            rel="noopener"
            target="_blank"
          >
            <ExternalLink aria-hidden="true" className="size-5" />
          </a>
        </div>
      </div>

      <div className="project-media-frame group relative w-full overflow-hidden bg-background-light">
        {isVideoMedia(activeImage) ? (
          <video
            autoPlay
            className="h-auto w-full"
            controls
            key={activeImage}
            loop
            muted
            playsInline
            preload="metadata"
            src={activeImage}
          >
            <track kind="captions" />
          </video>
        ) : (
          <Image
            alt={`${project.title} ${mediaLabels[activeIndex]}`}
            className="h-auto w-full"
            height={800}
            key={activeImage}
            loading="lazy"
            sizes="(min-width: 1024px) 50rem, calc(100vw - 2rem)"
            src={activeImage}
            unoptimized={activeImage.endsWith('.gif')}
            width={1200}
          />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.images.map((image, index) => (
          <button
            aria-label={`Show ${mediaLabels[index]}`}
            className={[
              'h-1.5 flex-1 basis-10 bg-background-light transition-colors',
              index === activeIndex ? 'bg-primary' : 'hover:bg-foreground/35',
            ].join(' ')}
            key={image}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

const ProjectDetails = ({ project }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const caseStudySections = getProjectCaseStudySections(project);
  const hasCaseStudy = project.summary || caseStudySections.length > 0;

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.set('.fade-in-later', {
        autoAlpha: 0,
        y: 30,
      });
      const tl = gsap.timeline();

      tl.to('.fade-in-later', {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      if (window.innerWidth < 992) return;

      gsap.to('#info', {
        filter: 'blur(0.1875rem)',
        autoAlpha: 0,
        scale: 0.9,
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

  useGSAP(
    () => {
      gsap.utils
        .toArray<HTMLDivElement>('#images .project-media-frame')
        .forEach((imageDiv, i) => {
          gsap.to(imageDiv, {
            backgroundPosition: `center 0%`,
            ease: 'none',
            scrollTrigger: {
              trigger: imageDiv,
              start: () => (i ? 'top bottom' : 'top 50%'),
              end: 'bottom top',
              scrub: true,
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

        <div className="top-0 flex min-h-[calc(100svh-6.25rem)]" id="info">
          <div className="relative w-full">
            <div className="mx-auto mb-10 flex max-w-158.75 items-start gap-6">
              <h1 className="fade-in-later overflow-hidden font-anton text-4xl leading-none opacity-0 md:text-6xl">
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

            <div className="mx-auto max-w-158.75 space-y-7 pb-20">
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

        <ProjectMediaGallery project={project} />

        {hasCaseStudy && (
          <div className="fade-in-later mx-auto mt-section max-w-200">
            <p className="mb-10 font-anton text-muted-foreground uppercase">
              Case Study
            </p>

            <div className="space-y-14">
              {project.summary && (
                <section>
                  <h2 className="mb-4 font-anton text-4xl leading-none">
                    Summary
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {project.summary}
                  </p>
                </section>
              )}

              {caseStudySections.map((section) => (
                <section
                  className="grid gap-5 border-foreground/15 border-t pt-8 md:grid-cols-12"
                  key={section.title}
                >
                  <h2 className="font-anton text-3xl leading-none md:col-span-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3 text-lg text-muted-foreground md:col-span-8">
                    {section.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
      <ScrollToTopButton trigger={{ type: 'scroll', threshold: 480 }} />
    </section>
  );
};

export default ProjectDetails;
