import PrintCvButton from '@/app/cv/_components/PrintCvButton';
import TransitionLink from '@/components/TransitionLink';
import { CV_CONTENT, GENERAL_INFO } from '@/lib/data';
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'CV - Guillaume Dumas',
  description:
    'Printable CV for Guillaume Dumas, frontend developer focused on product interfaces, dashboards and API-connected applications.',
};

const softwareExperience = CV_CONTENT.experience.filter(
  (experience) => experience.company !== 'Hermes',
);

const technicalStack = CV_CONTENT.stack.slice(0, 12);

const CvSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="break-inside-avoid border-foreground/15 border-t pt-4">
    <h2 className="mb-3 font-anton text-primary text-sm uppercase tracking-[0.12em] print:text-[0.92rem]">
      {title}
    </h2>
    {children}
  </section>
);

const DotList = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5 text-[0.9rem] leading-snug print:text-[0.78rem]">
    {items.map((item) => (
      <li className="grid grid-cols-[0.45rem_1fr] gap-2" key={item}>
        <span className="mt-[0.42rem] size-1.5 bg-primary" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const TagList = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((item) => (
      <span
        className="border border-foreground/15 px-2 py-1 text-[0.78rem] leading-none print:text-[0.68rem]"
        key={item}
      >
        {item}
      </span>
    ))}
  </div>
);

const CvPage = () => {
  return (
    <section className="cv-page px-4 pt-5 pb-16">
      <div className="mx-auto mb-6 flex w-full max-w-260 items-center justify-between gap-4 print:hidden">
        <TransitionLink
          className="group inline-flex h-12 items-center gap-2"
          href="/#banner"
        >
          <ArrowLeft className="size-5 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-primary" />
          Back
        </TransitionLink>
        <PrintCvButton />
      </div>

      <article className="cv-print-sheet mx-auto min-h-[297mm] w-full max-w-260 bg-background px-10 py-10 text-foreground shadow-2xl shadow-black/20 print:max-w-none print:px-[13mm] print:py-[12mm] print:shadow-none">
        <header className="grid gap-8 border-foreground/15 border-b pb-6 md:grid-cols-[1fr_10rem] print:grid-cols-[1fr_7.6rem] print:gap-7 print:pb-5">
          <div>
            <p className="mb-2 font-anton text-primary text-sm uppercase tracking-[0.18em]">
              Frontend Developer
            </p>
            <h1 className="font-anton text-5xl leading-none md:text-6xl print:text-5xl">
              {GENERAL_INFO.name}
            </h1>
            <p className="mt-3 max-w-170 text-muted-foreground text-sm leading-snug print:max-w-126 print:text-[0.84rem]">
              {CV_CONTENT.subheadline}
            </p>

            <div className="mt-4 grid gap-x-5 gap-y-2 text-[0.88rem] sm:grid-cols-2 print:text-[0.76rem]">
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
                <ExternalLink
                  aria-hidden="true"
                  className="size-3.5 text-primary"
                />
                linkedin.com/in/talibabtou
              </a>
              <a
                className="inline-flex items-center gap-2 sm:col-span-2"
                href="https://github.com/Talibabtou"
              >
                <GitBranch
                  aria-hidden="true"
                  className="size-3.5 text-primary"
                />
                github.com/Talibabtou
              </a>
            </div>
          </div>

          <Image
            alt={CV_CONTENT.photo.alt}
            className="aspect-3/4 w-32 justify-self-start object-cover saturate-[0.35] md:w-full print:w-full"
            height={427}
            priority
            src={CV_CONTENT.photo.src}
            width={320}
          />
        </header>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_0.52fr] print:mt-5 print:grid-cols-[1fr_0.56fr] print:gap-6">
          <main className="space-y-5">
            <CvSection title="Profile">
              <div className="space-y-2 text-muted-foreground text-sm leading-snug print:text-[0.82rem]">
                {CV_CONTENT.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-3">
                <TagList items={CV_CONTENT.targetRoles} />
              </div>
            </CvSection>

            <CvSection title="Software & Product Experience">
              <div className="space-y-4">
                {softwareExperience.map((experience) => (
                  <div
                    className="break-inside-avoid"
                    key={`${experience.company}-${experience.period}`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="font-anton text-[1.08rem] leading-none">
                        {experience.company}
                      </h3>
                      <p className="text-muted-foreground text-xs print:text-[0.72rem]">
                        {experience.period}
                      </p>
                    </div>
                    <p className="mt-1 font-medium text-[0.9rem] print:text-[0.78rem]">
                      {experience.role}
                      {experience.location ? ` - ${experience.location}` : ''}
                    </p>
                    <p className="mt-1.5 text-[0.9rem] text-muted-foreground leading-snug print:text-[0.78rem]">
                      {experience.summary}
                    </p>
                    <div className="mt-2">
                      <DotList items={experience.bullets.slice(0, 3)} />
                    </div>
                    {experience.stack ? (
                      <p className="mt-2 text-muted-foreground text-xs print:text-[0.68rem]">
                        {experience.stack.join(', ')}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </CvSection>
          </main>

          <aside className="space-y-5">
            <CvSection title="Focus & Strengths">
              <dl className="space-y-3">
                {CV_CONTENT.focus.map((item) => (
                  <div key={item.label}>
                    <dt className="font-anton text-[0.86rem] uppercase print:text-[0.76rem]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-[0.88rem] text-muted-foreground leading-snug print:text-[0.76rem]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CvSection>

            <CvSection title="Hard Stack">
              <TagList items={technicalStack} />
            </CvSection>

            <CvSection title="Soft Skills">
              <TagList items={CV_CONTENT.softSkills} />
            </CvSection>

            <CvSection title="Previous Career">
              <div className="space-y-3">
                {CV_CONTENT.previousCareer.slice(0, 2).map((experience) => (
                  <div key={`${experience.company}-${experience.period}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-anton text-[0.98rem] leading-none print:text-[0.88rem]">
                        {experience.company}
                      </h3>
                      <p className="text-muted-foreground text-xs print:text-[0.66rem]">
                        {experience.period}
                      </p>
                    </div>
                    <p className="mt-1 text-[0.84rem] text-muted-foreground leading-snug print:text-[0.72rem]">
                      {experience.role}
                    </p>
                  </div>
                ))}
              </div>
            </CvSection>

            <CvSection title="Education">
              <div className="space-y-2.5">
                {CV_CONTENT.education.map((education) => (
                  <div key={`${education.school}-${education.period}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-anton text-[0.92rem] leading-none print:text-[0.82rem]">
                        {education.school}
                      </h3>
                      <p className="text-muted-foreground text-xs print:text-[0.64rem]">
                        {education.period}
                      </p>
                    </div>
                    <p className="mt-1 text-[0.82rem] text-muted-foreground leading-snug print:text-[0.7rem]">
                      {education.title}
                    </p>
                  </div>
                ))}
              </div>
            </CvSection>

            <CvSection title="Languages">
              <p className="text-[0.9rem] print:text-[0.78rem]">
                {CV_CONTENT.languages.join(' - ')}
              </p>
            </CvSection>
          </aside>
        </div>
      </article>
    </section>
  );
};

export default CvPage;
