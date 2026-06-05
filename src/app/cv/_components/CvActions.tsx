'use client';

import Button from '@/components/Button';
import TransitionLink from '@/components/TransitionLink';
import { GENERAL_INFO } from '@/lib/data';
import { ArrowLeft, Download, Languages, Printer } from 'lucide-react';

type CvActionsProps = {
  language: 'en' | 'fr';
  onToggleLanguage: () => void;
};

const CvActions = ({ language, onToggleLanguage }: CvActionsProps) => {
  const nextLanguageLabel = language === 'en' ? 'FR' : 'EN';

  return (
    <div className="mx-auto mb-6 flex w-full max-w-260 flex-col items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] lg:flex lg:flex-row lg:justify-between print:hidden">
      <TransitionLink
        className="group inline-flex h-12 items-center gap-2 md:justify-self-start"
        href="/#banner"
      >
        <ArrowLeft className="size-5 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
        Back
      </TransitionLink>

      <div className="flex flex-wrap justify-center gap-3 md:col-start-2 lg:col-auto lg:justify-end">
        <Button
          as="button"
          className="px-6 text-sm"
          onClick={onToggleLanguage}
          variant="primary"
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Languages aria-hidden="true" className="size-4" />
            {nextLanguageLabel}
          </span>
        </Button>
        <Button
          as="button"
          className="px-6 text-sm"
          onClick={() => window.print()}
          variant="primary"
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Printer aria-hidden="true" className="size-4" />
            Print
          </span>
        </Button>
        <Button
          as="link"
          className="px-6 text-sm"
          download={`guillaume-dumas-cv-${language}.pdf`}
          href={GENERAL_INFO.cvPdfUrls[language]}
          variant="primary"
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Download aria-hidden="true" className="size-4" />
            PDF
          </span>
        </Button>
      </div>
    </div>
  );
};

export default CvActions;
