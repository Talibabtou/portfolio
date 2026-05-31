'use client';

import ProjectImageStack from '@/app/projects/[slug]/_components/ProjectImageStack';
import ProjectVideoCarousel from '@/app/projects/[slug]/_components/ProjectVideoCarousel';
import { isVideoMedia } from '@/app/projects/[slug]/_components/project-media';
import type { IProject } from '@/types';
import { useMemo } from 'react';

type ProjectMediaGalleryProps = {
  project: IProject;
};

const ProjectMediaGallery = ({ project }: ProjectMediaGalleryProps) => {
  const videoMedia = useMemo(
    () => project.images.filter(isVideoMedia),
    [project.images],
  );
  const imageMedia = useMemo(
    () => project.images.filter((image) => !isVideoMedia(image)),
    [project.images],
  );

  return (
    <div
      className="fade-in-later mx-auto flex max-w-200 flex-col gap-2"
      id="images"
    >
      {videoMedia.length > 0 ? (
        <ProjectVideoCarousel videos={videoMedia} />
      ) : null}
      <ProjectImageStack images={imageMedia} projectTitle={project.title} />
    </div>
  );
};

export default ProjectMediaGallery;
