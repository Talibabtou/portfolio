'use client';

import { getMediaLabel } from '@/app/projects/[slug]/_components/project-media';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const carouselControlClassName =
  'inline-flex h-11 w-11 items-center justify-center bg-background-light text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

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
                className={carouselControlClassName}
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
                className={carouselControlClassName}
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
          <a
            aria-label="Open current video"
            className={carouselControlClassName}
            href={activeVideo}
            rel="noopener"
            target="_blank"
          >
            <ExternalLink
              aria-hidden="true"
              className="pointer-events-none size-5"
            />
          </a>
        </div>
      </div>

      <div className="project-media-frame group relative w-full overflow-hidden bg-background-light">
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
      </div>

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

export default ProjectVideoCarousel;
