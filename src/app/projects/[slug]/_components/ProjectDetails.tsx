'use client';

import ProjectCaseStudy from '@/app/projects/[slug]/_components/ProjectCaseStudy';
import ProjectIntro from '@/app/projects/[slug]/_components/ProjectIntro';
import ProjectMedia from '@/app/projects/[slug]/_components/ProjectMedia';
import useProjectDetailsAnimations from '@/app/projects/[slug]/_components/use-project-details-animations';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import TransitionLink from '@/components/TransitionLink';
import type { IProject } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { useRef } from 'react';

interface Props {
  project: IProject;
}

const ProjectDetails = ({ project }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useProjectDetailsAnimations(containerRef);

  return (
    <section className="pt-5 pb-14">
      <div className="container" ref={containerRef}>
        <ProjectIntro project={project} />
        <ProjectMedia project={project} />
        <ProjectCaseStudy project={project} />
        <TransitionLink
          className="fade-in-later group mt-16 inline-flex h-12 items-center gap-2"
          href="/#selected-projects"
        >
          <ArrowLeft className="transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
          Back
        </TransitionLink>
      </div>
      <ScrollToTopButton trigger={{ type: 'scroll', threshold: 480 }} />
    </section>
  );
};

export default ProjectDetails;
