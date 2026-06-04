'use client';

import { cn } from '@/lib/utils';
import type { IProject } from '@/types';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const mediaControlClassName =
  'inline-flex h-11 w-11 items-center justify-center bg-background-light text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

const getMediaLabel = (src: string) => {
  const filename = src.split('/').pop()?.split('.')[0] ?? 'Media';

  return filename
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isVideoMedia = (src: string) =>
  src.endsWith('.mp4') || src.endsWith('.webm');

const ProjectMediaFrame = ({ children }: { children: ReactNode }) => (
  <div className="project-media-frame group relative w-full overflow-hidden bg-background-light">
    {children}
  </div>
);

type ProjectMediaOpenButtonProps = {
  href: string;
  label: string;
  variant?: 'overlay' | 'control';
};

const ProjectMediaOpenButton = ({
  href,
  label,
  variant = 'control',
}: ProjectMediaOpenButtonProps) => (
  <a
    aria-label={label}
    className={cn(
      variant === 'overlay'
        ? 'absolute top-4 right-4 inline-flex size-12 items-center justify-center bg-background/70 text-foreground opacity-0 transition-all hover:bg-primary hover:text-primary-foreground group-hover:opacity-100'
        : mediaControlClassName,
    )}
    href={href}
    rel="noopener"
    target="_blank"
  >
    <ExternalLink aria-hidden="true" className="pointer-events-none size-5" />
  </a>
);

type ProjectVideoCarouselProps = {
  videos: string[];
};

const ProjectVideoCarousel = ({ videos }: ProjectVideoCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = videos[activeIndex] ?? videos[0];
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const videoLabels = useMemo(
    () => videos.map((video) => getMediaLabel(video)),
    [videos],
  );

  useEffect(() => {
    const video = activeVideoRef.current;

    if (!(activeVideo && video)) return;

    video.currentTime = 0;
    void video.play().catch(() => {
      // Browsers can still block autoplay in some user settings.
    });

    return () => {
      video.pause();
    };
  }, [activeVideo]);

  const showPreviousVideo = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? videos.length - 1 : currentIndex - 1,
    );
  };

  const showNextVideo = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === videos.length - 1 ? 0 : currentIndex + 1,
    );
  };

  if (!activeVideo) return null;

  return (
    <div className="mb-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-anton text-muted-foreground uppercase">
            {videoLabels[activeIndex]}
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            {activeIndex + 1} / {videos.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {videos.length > 1 ? (
            <>
              <button
                aria-label="Previous video"
                className={mediaControlClassName}
                onClick={showPreviousVideo}
                type="button"
              >
                <ChevronLeft
                  aria-hidden="true"
                  className="pointer-events-none size-5"
                />
              </button>
              <button
                aria-label="Next video"
                className={mediaControlClassName}
                onClick={showNextVideo}
                type="button"
              >
                <ChevronRight
                  aria-hidden="true"
                  className="pointer-events-none size-5"
                />
              </button>
            </>
          ) : null}
          <ProjectMediaOpenButton
            href={activeVideo}
            label="Open current video"
          />
        </div>
      </div>

      <ProjectMediaFrame>
        <video
          autoPlay
          className="h-auto w-full"
          controls
          key={activeVideo}
          loop
          muted
          playsInline
          preload="metadata"
          ref={activeVideoRef}
          src={activeVideo}
        >
          <track kind="captions" />
        </video>
      </ProjectMediaFrame>

      {videos.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {videos.map((video, index) => (
            <button
              aria-label={`Show ${videoLabels[index]}`}
              className={[
                'h-1.5 flex-1 basis-10 bg-background-light transition-colors',
                index === activeIndex ? 'bg-primary' : 'hover:bg-foreground/35',
              ].join(' ')}
              key={video}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

type ProjectImageStackProps = {
  images: string[];
  projectTitle: string;
};

const ProjectImageStack = ({
  images,
  projectTitle,
}: ProjectImageStackProps) => (
  <>
    {images.map((image) => {
      const mediaLabel = getMediaLabel(image);

      return (
        <ProjectMediaFrame key={image}>
          <Image
            alt={`${projectTitle} ${mediaLabel}`}
            height={800}
            loading="lazy"
            sizes="(min-width: 1024px) 50rem, calc(100vw - 2rem)"
            src={image}
            style={{ height: 'auto', width: '100%' }}
            unoptimized={image.endsWith('.gif')}
            width={1200}
          />
          <ProjectMediaOpenButton
            href={image}
            label={`Open ${projectTitle} ${mediaLabel}`}
            variant="overlay"
          />
        </ProjectMediaFrame>
      );
    })}
  </>
);

type ProjectMediaProps = {
  project: IProject;
};

const ProjectMedia = ({ project }: ProjectMediaProps) => {
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

export default ProjectMedia;
