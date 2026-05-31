'use client';

import ProjectCaseStudy from '@/app/projects/[slug]/_components/ProjectCaseStudy';
import ProjectIntro from '@/app/projects/[slug]/_components/ProjectIntro';
import ProjectMediaGallery from '@/app/projects/[slug]/_components/ProjectMediaGallery';
import useProjectDetailsAnimations from '@/app/projects/[slug]/_components/use-project-details-animations';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import type { IProject } from '@/types';
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
        <ProjectMediaGallery project={project} />
        <ProjectCaseStudy project={project} />
      </div>
      <ScrollToTopButton trigger={{ type: 'scroll', threshold: 480 }} />
    </section>
  );
};

export default ProjectDetails;
