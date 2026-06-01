import ArrowAnimation from '@/components/ArrowAnimation';
import TransitionLink from '@/components/TransitionLink';
import type { IProject } from '@/types';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';

type ProjectIntroProps = {
  project: IProject;
};

const ProjectIntro = ({ project }: ProjectIntroProps) => {
  return (
    <>
      <TransitionLink
        href="/#selected-projects"
        className="group mb-16 inline-flex h-12 items-center gap-2"
      >
        <ArrowLeft className="transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
        Back
      </TransitionLink>

      <div className="top-0 flex min-h-[calc(100svh-6.25rem)]" id="info">
        <div className="relative w-full">
          <div className="mx-auto mb-10 flex max-w-158.75 items-start gap-6">
            <h1 className="fade-in-later overflow-hidden font-anton text-4xl leading-none opacity-0 md:text-6xl">
              <span className="inline-block">{project.title}</span>
            </h1>

            <div className="fade-in-later flex gap-2 opacity-0">
              {project.sourceCode && (
                <a
                  href={project.sourceCode}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-primary"
                >
                  <GitBranch size={30} />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-primary"
                >
                  <ExternalLink size={30} />
                </a>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-158.75 space-y-7 pb-20">
            <div className="fade-in-later">
              <p className="mb-3 font-anton text-muted-foreground">Year</p>

              <div className="text-lg">{project.year}</div>
            </div>
            <div className="fade-in-later">
              <p className="mb-3 font-anton text-muted-foreground">
                Tech & Technique
              </p>

              <div className="text-lg">{project.techStack.join(', ')}</div>
            </div>
            <div className="fade-in-later">
              <p className="mb-3 font-anton text-muted-foreground">
                Description
              </p>

              <div className="prose-xl markdown-text text-lg">
                {project.description.map((paragraph) => (
                  <p className="mb-3 last:mb-0" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            {project.role.length > 0 && (
              <div className="fade-in-later">
                <p className="mb-3 font-anton text-muted-foreground">My Role</p>

                <div className="text-lg">
                  {project.role.map((paragraph) => (
                    <p className="mb-3 last:mb-0" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ArrowAnimation />
        </div>
      </div>
    </>
  );
};

export default ProjectIntro;
