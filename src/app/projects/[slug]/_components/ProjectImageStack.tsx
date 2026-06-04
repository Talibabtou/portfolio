import { getMediaLabel } from '@/app/projects/[slug]/_components/project-media';
import {
  ProjectMediaFrame,
  ProjectMediaOpenButton,
} from '@/app/projects/[slug]/_components/ProjectMediaFrame';
import Image from 'next/image';

type ProjectImageStackProps = {
  images: string[];
  projectTitle: string;
};

const ProjectImageStack = ({
  images,
  projectTitle,
}: ProjectImageStackProps) => {
  return (
    <>
      {images.map((image) => (
        <ProjectMediaFrame key={image}>
          <Image
            alt={`${projectTitle} ${getMediaLabel(image)}`}
            className="h-auto w-full"
            height={800}
            loading="lazy"
            sizes="(min-width: 1024px) 50rem, calc(100vw - 2rem)"
            src={image}
            unoptimized={image.endsWith('.gif')}
            width={1200}
          />
          <ProjectMediaOpenButton
            href={image}
            label={`Open ${projectTitle} ${getMediaLabel(image)}`}
            variant="overlay"
          />
        </ProjectMediaFrame>
      ))}
    </>
  );
};

export default ProjectImageStack;
