import CvClient from '@/app/cv/_components/CvClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV - Guillaume Dumas',
  description:
    'Printable CV for Guillaume Dumas, frontend and product developer working with React, TypeScript, APIs and real-time web apps.',
};

const CvPage = () => {
  return (
    <section className="cv-page px-4 pt-5 pb-16 print:p-0">
      <CvClient />
    </section>
  );
};

export default CvPage;
