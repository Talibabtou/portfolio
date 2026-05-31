import type { IProject } from '@/types';

type ProjectCaseStudySection = {
  title: string;
  items: string[];
};

const getProjectCaseStudySections = (project: IProject) =>
  [
    {
      title: 'Context',
      items: project.context,
    },
    {
      title: 'Problem',
      items: project.problem,
    },
    {
      title: 'Contributions',
      items: project.contributions,
    },
    {
      title: 'Technical Decisions',
      items: project.decisions,
    },
    {
      title: 'Result',
      items: project.results,
    },
  ].filter((section): section is ProjectCaseStudySection =>
    Boolean(section.items && section.items.length > 0),
  );

type ProjectCaseStudyProps = {
  project: IProject;
};

const ProjectCaseStudy = ({ project }: ProjectCaseStudyProps) => {
  const caseStudySections = getProjectCaseStudySections(project);
  const hasCaseStudy = project.summary || caseStudySections.length > 0;

  if (!hasCaseStudy) return null;

  return (
    <div className="fade-in-later mx-auto mt-section max-w-200">
      <p className="mb-10 font-anton text-muted-foreground uppercase">
        Case Study
      </p>

      <div className="space-y-14">
        {project.summary && (
          <section>
            <h2 className="mb-4 font-anton text-4xl leading-none">Summary</h2>
            <p className="text-lg text-muted-foreground">{project.summary}</p>
          </section>
        )}

        {caseStudySections.map((section) => (
          <section
            className="grid gap-5 border-foreground/15 border-t pt-8 md:grid-cols-12"
            key={section.title}
          >
            <h2 className="font-anton text-3xl leading-none md:col-span-4">
              {section.title}
            </h2>
            <div className="space-y-3 text-lg text-muted-foreground md:col-span-8">
              {section.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ProjectCaseStudy;
