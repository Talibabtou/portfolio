import { CV_CONTENT, GENERAL_INFO } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ExternalLink, GitBranch, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';

const softwareExperience = CV_CONTENT.experience.filter(
  (experience) => experience.company !== 'Hermes',
);

const CvSection = ({
  children,
  className,
  contentClassName,
  title,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  title: string;
}) => (
  <section
    className={cn(
      'break-inside-avoid border-foreground/15 border-t pt-3 pb-1 print:border-black/40 print:pt-2 print:pb-0.5',
      className,
    )}
  >
    <h2 className="mb-2 font-anton text-primary text-sm uppercase tracking-[0.12em] print:mb-1 print:text-[0.78rem]">
      {title}
    </h2>
    <div className={contentClassName}>{children}</div>
  </section>
);

const DotList = ({ items }: { items: string[] }) => (
  <ul className="space-y-1 text-[0.84rem] leading-snug print:space-y-0.5 print:text-[0.68rem]">
    {items.map((item) => (
      <li className="grid grid-cols-[0.45rem_1fr] gap-2" key={item}>
        <span className="mt-[0.42rem] size-1.5 bg-primary" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TagList = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1.5 print:gap-1">
    {items.map((item) => (
      <span
        className="border border-foreground/15 px-2 py-1 text-[0.76rem] leading-none print:border-black/40 print:px-1.5 print:py-0.5 print:text-[0.64rem]"
        key={item}
      >
        {item}
      </span>
    ))}
  </div>
);

const ExperienceItem = ({
  experience,
}: {
  experience: (typeof softwareExperience)[number];
}) => (
  <div className="break-inside-avoid">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="font-anton text-[1.08rem] leading-none">
        {experience.company}
      </h3>
      <p className="text-muted-foreground text-xs print:text-[0.62rem]">
        {experience.period}
      </p>
    </div>
    <p className="mt-1 font-medium text-[0.86rem] print:text-[0.68rem]">
      {experience.role}
      {experience.location ? ` - ${experience.location}` : ''}
    </p>
    <p className="mt-1 text-[0.84rem] text-muted-foreground leading-snug print:text-[0.68rem]">
      {experience.summary}
    </p>
    <div className="mt-1.5 print:mt-1">
      <DotList items={experience.bullets.slice(0, 3)} />
    </div>
  </div>
);

const CvHeader = () => (
  <header className="grid gap-7 border-foreground/15 border-b pb-5 md:grid-cols-[1fr_9rem] print:grid-cols-[1fr_5.8rem] print:gap-4 print:border-black/40 print:pb-2">
    <div>
      <p className="mb-2 font-anton text-primary text-sm uppercase tracking-[0.18em] print:mb-1.5 print:text-[0.76rem]">
        {CV_CONTENT.headline}
      </p>
      <h1 className="font-anton text-5xl leading-none md:text-6xl print:text-[2.32rem]">
        {GENERAL_INFO.name}
      </h1>
      <p className="mt-3 max-w-170 text-muted-foreground text-sm leading-snug print:mt-1 print:max-w-126 print:text-[0.72rem]">
        {CV_CONTENT.subheadline}
      </p>

      <div className="mt-4 grid gap-x-5 gap-y-2 text-[0.84rem] sm:grid-cols-2 print:mt-2 print:gap-y-0.5 print:text-[0.66rem]">
        <a
          className="inline-flex items-center gap-2"
          href={`mailto:${GENERAL_INFO.email}`}
        >
          <Mail aria-hidden="true" className="size-3.5 text-primary" />
          {GENERAL_INFO.email}
        </a>
        <a
          className="inline-flex items-center gap-2"
          href={`tel:${GENERAL_INFO.phone.replaceAll(' ', '')}`}
        >
          <Phone aria-hidden="true" className="size-3.5 text-primary" />
          {GENERAL_INFO.phone}
        </a>
        <span className="inline-flex items-center gap-2">
          <MapPin aria-hidden="true" className="size-3.5 text-primary" />
          {GENERAL_INFO.location}
        </span>
        <a
          className="inline-flex items-center gap-2"
          href={GENERAL_INFO.linkedinProfile}
        >
          <ExternalLink aria-hidden="true" className="size-3.5 text-primary" />
          linkedin.com/in/talibabtou
        </a>
        <a
          className="inline-flex items-center gap-2 sm:col-span-2"
          href="https://github.com/Talibabtou"
        >
          <GitBranch aria-hidden="true" className="size-3.5 text-primary" />
          github.com/Talibabtou
        </a>
      </div>
    </div>

    <Image
      alt={CV_CONTENT.photo.alt}
      className="aspect-3/4 w-32 justify-self-start object-cover saturate-[0.35] md:w-full print:w-full print:saturate-0"
      height={427}
      priority
      src={CV_CONTENT.photo.src}
      width={320}
    />
  </header>
);

const CvDocument = () => {
  return (
    <article className="cv-print-sheet mx-auto flex h-[297mm] w-full max-w-260 flex-col bg-background px-10 py-9 text-foreground print:max-w-none print:px-[10mm] print:py-[8mm]">
      <CvHeader />

      <div className="mt-5 grid flex-1 items-stretch gap-7 md:grid-cols-[1fr_0.42fr] print:mt-2.5 print:grid-cols-[1fr_0.42fr] print:gap-5">
        <main className="flex h-full flex-col gap-5 print:gap-3.5">
          <CvSection title="About">
            <div className="space-y-1.5 text-muted-foreground text-sm leading-snug print:space-y-1 print:text-[0.72rem]">
              {CV_CONTENT.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </CvSection>

          <CvSection
            className="flex flex-1 flex-col"
            contentClassName="flex flex-1 flex-col justify-between gap-5 print:gap-3.5"
            title="Experience"
          >
            {softwareExperience.map((experience) => (
              <ExperienceItem
                experience={experience}
                key={`${experience.company}-${experience.period}`}
              />
            ))}
          </CvSection>
        </main>

        <aside className="flex h-full flex-col justify-between">
          <CvSection title="Hard Stack">
            <TagList items={CV_CONTENT.stack} />
          </CvSection>

          <CvSection title="Soft Skills">
            <TagList items={CV_CONTENT.softSkills} />
          </CvSection>

          <CvSection title="Previous Career">
            <div className="space-y-2.5 print:space-y-1.5">
              {CV_CONTENT.previousCareer.slice(0, 2).map((experience) => (
                <div key={`${experience.company}-${experience.period}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-anton text-[0.92rem] leading-none print:text-[0.74rem]">
                      {experience.company}
                    </h3>
                    <p className="text-muted-foreground text-xs print:text-[0.6rem]">
                      {experience.period}
                    </p>
                  </div>
                  <p className="mt-1 text-[0.8rem] text-muted-foreground leading-snug print:text-[0.64rem]">
                    {experience.role}
                  </p>
                </div>
              ))}
            </div>
          </CvSection>

          <CvSection title="Education">
            <div className="space-y-2 print:space-y-1.5">
              {CV_CONTENT.education.map((education) => (
                <div key={`${education.school}-${education.period}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-anton text-[0.86rem] leading-none print:text-[0.7rem]">
                      {education.school}
                    </h3>
                    <p className="text-muted-foreground text-xs print:text-[0.58rem]">
                      {education.period}
                    </p>
                  </div>
                  <p className="mt-1 text-[0.78rem] text-muted-foreground leading-snug print:text-[0.62rem]">
                    {education.title}
                  </p>
                </div>
              ))}
            </div>
          </CvSection>

          <CvSection title="Languages">
            <p className="text-[0.84rem] print:text-[0.68rem]">
              {CV_CONTENT.languages.join(' - ')}
            </p>
          </CvSection>
        </aside>
      </div>
    </article>
  );
};

export default CvDocument;
