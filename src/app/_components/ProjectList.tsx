'use client';
import Project from '@/app/_components/Project';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRef, useState } from 'react';

const ProjectList = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainer = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(
    PROJECTS[0].slug,
  );

  // Keep the project preview image aligned with the cursor in the list area.
  useGSAP(
    (_context, contextSafe) => {
      // show image on hover
      if (window.innerWidth < 768) {
        setSelectedProject(null);
        return;
      }

      const handleMouseMove = contextSafe?.((e: MouseEvent) => {
        if (!containerRef.current) return;
        if (!imageContainer.current) return;

        if (window.innerWidth < 768) {
          setSelectedProject(null);
          return;
        }

        const containerRect = containerRef.current?.getBoundingClientRect();
        const imageRect = imageContainer.current.getBoundingClientRect();
        const offsetTop = e.clientY - containerRect.y;

        // if cursor is outside the container, hide the image
        if (
          containerRect.y > e.clientY ||
          containerRect.bottom < e.clientY ||
          containerRect.x > e.clientX ||
          containerRect.right < e.clientX
        ) {
          return gsap.to(imageContainer.current, {
            duration: 0.3,
            opacity: 0,
          });
        }

        gsap.to(imageContainer.current, {
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

  const handleMouseEnter = (slug: string) => {
    if (window.innerWidth < 768) {
      setSelectedProject(null);
      return;
    }

    setSelectedProject(slug);
  };

  return (
    <section className="py-section" id="selected-projects" ref={sectionRef}>
      <div className="container">
        <SectionTitle title="SELECTED PROJECTS" />

        <div className="group/projects relative" ref={containerRef}>
          {selectedProject !== null && (
            <div
              className="pointer-events-none absolute top-0 right-0 z-1 aspect-3/4 w-50 overflow-hidden opacity-0 max-md:hidden xl:w-87.5"
              ref={imageContainer}
            >
              {PROJECTS.map((project) => (
                <Image
                  src={project.thumbnail}
                  alt="Project"
                  width="400"
                  height="500"
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-all duration-500',
                    {
                      'opacity-0': project.slug !== selectedProject,
                    },
                  )}
                  key={project.slug}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col max-md:gap-10">
            {PROJECTS.map((project, index) => (
              <Project
                index={index}
                project={project}
                selectedProject={selectedProject}
                onMouseEnter={handleMouseEnter}
                key={project.slug}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
