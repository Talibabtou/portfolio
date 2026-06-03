import { PROJECTS } from '@/lib/data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetails from '@/app/projects/[slug]/_components/ProjectDetails';

export const generateStaticParams = async () => {
  return PROJECTS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const project = PROJECTS.find((project) => project.slug === slug);

  if (!project) {
    return {
      title: 'Project',
    } as Metadata;
  }

  const description = project?.summary ?? project?.description.join(' ');

  return {
    title: `Projects - ${project.title}`,
    description,
  } as Metadata;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const project = PROJECTS.find((project) => project.slug === slug);

  if (!project) {
    return notFound();
  }

  return <ProjectDetails project={project} />;
};

export default Page;
