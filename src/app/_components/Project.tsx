import TransitionLink from '@/components/TransitionLink';
import { cn } from '@/lib/utils';
import type { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useRef } from 'react';

interface Props {
  index: number;
  project: IProject;
  selectedProject: string | null;
  onMouseEnter: (_slug: string) => void;
}

/*
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link">
    <path id="arrow-line" d="M15 3h6v6"></path>
    <path id="arrow-curb" d="M10 14 21 3"></path>
    <path id="box" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
</svg>

<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39.9996 6.18259H10.2846C5.70915 6.18259 2 9.89172 2 14.4672V60.0324C2 64.6079 5.70914 68.317 10.2846 68.317H55.8498C60.4253 68.317 64.1344 64.6079 64.1344 60.0324V24.9401" stroke="#DDDDDD" stroke-width="3.10672" stroke-linecap="round"/>
<rect x="38.2451" y="30.0007" width="40.3874" height="3.10672" rx="1.55336" transform="rotate(-45 38.2451 30.0007)" fill="#DDDDDD"/>
<path d="M58.5561 3.23069L67.9426 1.59357C68.1983 1.54899 68.4231 1.76656 68.387 2.02352L67.0827 11.2992" stroke="#DDDDDD" stroke-width="2.07115" stroke-linecap="round"/>
</svg>

*/

gsap.registerPlugin(useGSAP);

const Project = ({ index, project, selectedProject, onMouseEnter }: Props) => {
  const externalLinkSVGRef = useRef<SVGSVGElement>(null);

  const { context, contextSafe } = useGSAP(() => {}, {
    scope: externalLinkSVGRef,
    revertOnUpdate: true,
  });

  const handleMouseEnter = () => {
    contextSafe?.(() => {
      onMouseEnter(project.slug);

      const arrowLine = externalLinkSVGRef.current?.querySelector(
        '#arrow-line',
      ) as SVGPathElement;
      const arrowCurb = externalLinkSVGRef.current?.querySelector(
        '#arrow-curb',
      ) as SVGPathElement;
      const box = externalLinkSVGRef.current?.querySelector(
        '#box',
      ) as SVGPathElement;

      gsap.set(box, {
        opacity: 0,
        strokeDasharray: box?.getTotalLength(),
        strokeDashoffset: box?.getTotalLength(),
      });
      gsap.set(arrowLine, {
        opacity: 0,
        strokeDasharray: arrowLine?.getTotalLength(),
        strokeDashoffset: arrowLine?.getTotalLength(),
      });
      gsap.set(arrowCurb, {
        opacity: 0,
        strokeDasharray: arrowCurb?.getTotalLength(),
        strokeDashoffset: arrowCurb?.getTotalLength(),
      });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(externalLinkSVGRef.current, {
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
          externalLinkSVGRef.current,
          {
            autoAlpha: 0,
          },
          '+=1',
        );
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
      className="project-item group first:!pt-0 md:hover:!opacity-100 py-5 leading-none transition-all last:border-none last:pb-0 md:border-b md:group-hover/projects:opacity-30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {selectedProject === null && (
        <Image
          src={project.thumbnail}
          alt="Project"
          width="300"
          height="200"
          className={cn('mb-6 aspect-[3/2] w-full object-cover object-top')}
          key={project.slug}
          loading="lazy"
        />
      )}
      <div className="flex gap-2 md:gap-5">
        <div className="font-anton text-muted-foreground">
          _{(index + 1).toString().padStart(2, '0')}.
        </div>
        <div className="">
          <h4 className="flex gap-4 bg-[length:200%] bg-gradient-to-r bg-right from-[50%] from-primary to-[50%] to-foreground bg-clip-text font-anton text-4xl text-transparent xs:text-6xl transition-all duration-700 group-hover:bg-left">
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
