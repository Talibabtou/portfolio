import { getMediaLabel } from '@/app/projects/[slug]/_components/project-media';
import { ExternalLink } from 'lucide-react';
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
        <div
          key={image}
          className="project-media-frame group relative w-full overflow-hidden bg-background-light"
        >
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
    </>
  );
};

export default ProjectImageStack;
