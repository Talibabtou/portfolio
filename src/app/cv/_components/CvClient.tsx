'use client';

import CvActions from '@/app/cv/_components/CvActions';
import CvDocument from '@/app/cv/_components/CvDocument';
import { CV_CONTENT, CV_CONTENT_FR } from '@/lib/data';
import { useState } from 'react';

const CV_LABELS = {
  en: {
    about: 'About',
    education: 'Education',
    experience: 'Experience',
    hardStack: 'Hard Stack',
    languages: 'Languages',
    previousCareer: 'Previous Career',
    softSkills: 'Soft Skills',
  },
  fr: {
    about: 'Profil',
    education: 'Formation',
    experience: 'Expérience',
    hardStack: 'Stack technique',
    languages: 'Langues',
    previousCareer: 'Parcours précédent',
    softSkills: 'Savoir-être',
  },
};

const CvClient = () => {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const content = language === 'en' ? CV_CONTENT : CV_CONTENT_FR;

  return (
    <>
      <CvActions
        language={language}
        onToggleLanguage={() =>
          setLanguage((currentLanguage) =>
            currentLanguage === 'en' ? 'fr' : 'en',
          )
        }
      />
      <CvDocument content={content} labels={CV_LABELS[language]} />
    </>
  );
};

export default CvClient;
