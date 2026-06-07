'use client';
import Project from '@/app/_components/Project';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';

const isDesktopViewport = () => window.innerWidth >= 768;

const isPointerInsideRect = (event: MouseEvent, rect: DOMRect) => {
  return (
    event.clientY >= rect.y &&
    event.clientY <= rect.bottom &&
    event.clientX >= rect.x &&
    event.clientX <= rect.right
  );
};

const useProjectPreview = ({
  containerRef,
  imageContainerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  imageContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(
    PROJECTS[0].slug,
  );
  useGSAP(
    (_context, contextSafe) => {
      if (window.innerWidth < 768) {
        setSelectedProject(null);
        return;
      }

      const handleMouseMove = contextSafe?.((e: MouseEvent) => {
        const container = containerRef.current;
        const preview = imageContainerRef.current;
        if (!container || !preview) return;

        if (!isDesktopViewport()) {
          setSelectedProject(null);
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const imageRect = preview.getBoundingClientRect();
        const offsetTop = e.clientY - containerRect.y;

        if (!isPointerInsideRect(e, containerRect)) {
          return gsap.to(preview, {
            duration: 0.3,
            opacity: 0,
          });
        }

        gsap.to(preview, {
          y: offsetTop - imageRect.height / 2,
          duration: 1,
          opacity: 1,
        });
      });

      if (!handleMouseMove) return;

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    },
    { scope: containerRef },
  );

  const handleMouseEnter = (slug: string) => {
    if (!isDesktopViewport()) {
      setSelectedProject(null);
      return;
    }

    setSelectedProject(slug);
  };

  return {
    handleMouseEnter,
    selectedProject,
    selectedProjectData: PROJECTS.find(
      (project) => project.slug === selectedProject,
    ),
  };
};

const ProjectPreviewImage = ({
  imageContainerRef,
  selectedProjectData,
}: {
  imageContainerRef: RefObject<HTMLDivElement | null>;
  selectedProjectData: (typeof PROJECTS)[number] | undefined;
}) => {
  if (!selectedProjectData) return null;

  return (
    <div
      className="pointer-events-none absolute top-0 right-0 z-1 w-64 overflow-hidden opacity-0 max-md:hidden xl:w-100"
      ref={imageContainerRef}
    >
      <Image
        src={selectedProjectData.thumbnail}
        alt={`${selectedProjectData.title} preview`}
        width={selectedProjectData.thumbnailWidth ?? 600}
        height={selectedProjectData.thumbnailHeight ?? 400}
        className="transition-opacity duration-500"
        key={selectedProjectData.slug}
        loading="eager"
        style={{ height: 'auto', width: '100%' }}
      />
    </div>
  );
};

const ProjectItems = ({
  onMouseEnter,
  selectedProject,
}: {
  onMouseEnter: (slug: string) => void;
  selectedProject: string | null;
}) => (
  <div className="flex flex-col max-md:gap-10">
    {PROJECTS.map((project, index) => (
      <Project
        index={index}
        project={project}
        selectedProject={selectedProject}
        onMouseEnter={onMouseEnter}
        key={project.slug}
      />
    ))}
  </div>
);

const ProjectList = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { handleMouseEnter, selectedProject, selectedProjectData } =
    useProjectPreview({
      containerRef,
      imageContainerRef,
    });

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top 80%',
          toggleActions: 'restart none none reverse',
          scrub: 1,
        },
      });

      tl.fromTo(
        sectionRef.current,
        {
          autoAlpha: 0,
          y: 150,
        },
        {
          autoAlpha: 1,
          y: 0,
        },
      );

      gsap
        .timeline({
          scrollTrigger: {
            end: 'bottom 10%',
            scrub: 0.55,
            start: 'bottom 45%',
            trigger: sectionRef.current,
          },
        })
        .fromTo(
          sectionRef.current,
          {
            autoAlpha: 1,
            y: 0,
          },
          {
            autoAlpha: 0,
            immediateRender: false,
            y: -120,
          },
        );
    },
    { scope: sectionRef },
  );

  return (
    <section className="py-section" id="selected-projects" ref={sectionRef}>
      <div className="container">
        <SectionTitle title="SELECTED PROJECTS" />

        <div className="group/projects relative" ref={containerRef}>
          <ProjectPreviewImage
            imageContainerRef={imageContainerRef}
            selectedProjectData={selectedProjectData}
          />
          <ProjectItems
            onMouseEnter={handleMouseEnter}
            selectedProject={selectedProject}
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
