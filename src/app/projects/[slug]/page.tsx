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

  return {
    title: `${project?.title} - ${project?.techStack.slice(0, 3).join(', ')}`,
    description: project?.description,
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
