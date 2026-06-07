import TransitionLink from '@/components/TransitionLink';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import type { IProject } from '@/types';
import Image from 'next/image';
import { useRef } from 'react';

interface Props {
  index: number;
  project: IProject;
  selectedProject: string | null;
  onMouseEnter: (_slug: string) => void;
}

const PROJECT_LINK_ICON_SELECTORS = {
  arrowCurb: '#arrow-curb',
  arrowLine: '#arrow-line',
  box: '#box',
} as const;

const getProjectLinkIconPaths = (icon: SVGSVGElement | null) => ({
  arrowCurb: icon?.querySelector<SVGPathElement>(
    PROJECT_LINK_ICON_SELECTORS.arrowCurb,
  ),
  arrowLine: icon?.querySelector<SVGPathElement>(
    PROJECT_LINK_ICON_SELECTORS.arrowLine,
  ),
  box: icon?.querySelector<SVGPathElement>(PROJECT_LINK_ICON_SELECTORS.box),
});

const primeAnimatedPath = (path?: SVGPathElement | null) => {
  if (!path) return;

  const pathLength = path.getTotalLength();

  gsap.set(path, {
    opacity: 0,
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });
};

const playExternalLinkIconAnimation = (icon: SVGSVGElement | null) => {
  const { arrowCurb, arrowLine, box } = getProjectLinkIconPaths(icon);
  if (!icon || !arrowCurb || !arrowLine || !box) return;

  [box, arrowLine, arrowCurb].forEach(primeAnimatedPath);

  return gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .to(icon, {
      autoAlpha: 1,
    })
    .to(box, {
      opacity: 1,
      strokeDashoffset: 0,
    })
    .to(
      arrowLine,
      {
        opacity: 1,
        strokeDashoffset: 0,
      },
      '<0.2',
    )
    .to(arrowCurb, {
      opacity: 1,
      strokeDashoffset: 0,
    })
    .to(
      icon,
      {
        autoAlpha: 0,
      },
      '+=1',
    );
};

const Project = ({ index, project, selectedProject, onMouseEnter }: Props) => {
  const externalLinkSVGRef = useRef<SVGSVGElement>(null);

  const { context, contextSafe } = useGSAP(() => {}, {
    scope: externalLinkSVGRef,
    revertOnUpdate: true,
  });

  const handleMouseEnter = () => {
    contextSafe?.(() => {
      onMouseEnter(project.slug);
      playExternalLinkIconAnimation(externalLinkSVGRef.current);
    })();
  };

  const handleMouseLeave = () => {
    contextSafe?.(() => {
      context.kill();
    })();
  };

  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      className="group py-5 leading-none transition-all first:pt-0! last:border-none last:pb-0 md:border-b md:group-hover/projects:opacity-30 md:hover:opacity-100!"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {selectedProject === null && (
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          width={project.thumbnailWidth ?? 600}
          height={project.thumbnailHeight ?? 400}
          className={cn('mb-6')}
          key={project.slug}
          loading={index === 0 ? 'eager' : 'lazy'}
          style={{ height: 'auto', width: '100%' }}
        />
      )}
      <div className="flex gap-2 md:gap-5">
        <div className="font-anton text-muted-foreground">
          _{(index + 1).toString().padStart(2, '0')}.
        </div>
        <div className="">
          <h4 className="flex gap-4 bg-linear-to-r bg-right bg-size-[200%] from-50% from-primary to-50% to-foreground bg-clip-text font-anton text-4xl text-transparent transition-all duration-700 group-hover:bg-left md:text-5xl">
            {project.title}
            <span className="text-foreground opacity-0 transition-all group-hover:opacity-100">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                ref={externalLinkSVGRef}
              >
                <path
                  id="box"
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                ></path>
                <path id="arrow-line" d="M10 14 21 3"></path>
                <path id="arrow-curb" d="M15 3h6v6"></path>
              </svg>
            </span>
          </h4>
          <div className="mt-2 flex flex-wrap gap-3 text-muted-foreground text-xs">
            {project.techStack.slice(0, 3).map((tech, idx, stackArr) => (
              <div className="flex items-center gap-3" key={tech}>
                <span className="">{tech}</span>
                {idx !== stackArr.length - 1 && (
                  <span className="inline-block size-2 rounded-full bg-background-light"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TransitionLink>
  );
};

export default Project;
