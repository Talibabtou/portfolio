import { IProject } from '@/types';

type StackItem = {
  name: string;
  icon?: string;
};

export const GENERAL_INFO = {
  name: 'Guillaume Dumas',
  email: 'talibabtou@gmail.com',
  phone: '+33 6 28 40 15 84',
  location: 'Grenoble, France',
  cvUrl: '/cv/guillaume-dumas-cv.pdf',
  githubRepo: 'https://github.com/Talibabtou/portfolio',
  linkedinProfile: 'https://www.linkedin.com/in/talibabtou',

  emailSubject: "Let's discuss a product engineering role",
  emailBody:
    'Hi Guillaume, I am reaching out because I would like to discuss...',
};

export const SOCIAL_LINKS = [
  { name: 'github', url: 'https://github.com/Talibabtou' },
  { name: 'linkedin', url: GENERAL_INFO.linkedinProfile },
  { name: 'cv', url: GENERAL_INFO.cvUrl },
];

export const MY_STACK: Record<string, StackItem[]> = {
  frontend: [
    {
      name: 'TypeScript',
      icon: '/logo/ts.png',
    },
    {
      name: 'JavaScript',
      icon: '/logo/js.png',
    },
    {
      name: 'React',
      icon: '/logo/react.png',
    },
    {
      name: 'Next.js',
      icon: '/logo/next.png',
    },
    {
      name: 'Component systems',
    },
    {
      name: 'Responsive UI',
    },
  ],
  'data & APIs': [
    {
      name: 'REST APIs',
    },
    {
      name: 'WebSockets',
    },
    {
      name: 'Node.js',
      icon: '/logo/node.png',
    },
    {
      name: 'Python',
    },
    {
      name: 'Dashboards',
    },
  ],
  blockchain: [
    {
      name: 'Solana',
    },
    {
      name: 'Wallet-aware UX',
    },
    {
      name: 'Prediction markets',
    },
    {
      name: 'Smart-contract integration',
    },
    {
      name: 'Rust learning',
    },
  ],
  engineering: [
    {
      name: 'Git',
      icon: '/logo/git.png',
    },
    {
      name: 'Docker',
      icon: '/logo/docker.svg',
    },
    {
      name: 'C',
    },
    {
      name: 'C++',
    },
    {
      name: 'Algorithms',
    },
    {
      name: 'Performance',
    },
  ],
};

export const PROJECTS: IProject[] = [
  {
    title: 'Jupiter Prediction Market',
    slug: 'jupiter-prediction-market',
    liveUrl: 'https://jup.ag/',
    year: 2026,
    description: `
      Consultant frontend work on Jupiter's prediction market interface in the Solana ecosystem. The work focused on product clarity, interaction consistency and production-ready frontend implementation for market and wallet-aware flows.
    `,
    role: `
      Contributed frontend features in a fast-moving product context involving market data, wallet interactions and release quality. Improved screen clarity and implementation maintainability across user-facing flows.
    `,
    techStack: ['TypeScript', 'React', 'Solana', 'Wallet UX', 'Market data'],
    thumbnail: '/projects/thumbnail/consulting-finance.jpg',
    longThumbnail: '/projects/long/consulting-finance.jpg',
    images: [
      '/projects/images/consulting-finance-1.png',
      '/projects/images/consulting-finance-2.png',
      '/projects/images/consulting-finance-3.png',
    ],
  },
  {
    title: 'Adrena',
    slug: 'adrena',
    liveUrl: 'https://adrena.xyz/',
    year: 2025,
    description: `
      Open-source internship contributions for a DeFi trading product. The work covered UI improvements, reusable components, product screens, dashboards and leaderboard experiences.
    `,
    role: `
      Delivered frontend improvements connected to backend data through API-driven features, with emphasis on data-heavy interface elements and trading product usability.
    `,
    techStack: ['TypeScript', 'React', 'APIs', 'Dashboards', 'DeFi'],
    thumbnail: '/projects/thumbnail/property-pro.jpg',
    longThumbnail: '/projects/long/property-pro.jpg',
    images: [
      '/projects/images/property-pro-1.png',
      '/projects/images/property-pro-2.png',
      '/projects/images/property-pro-3.png',
    ],
  },
  {
    title: 'Versus',
    slug: 'versus',
    sourceCode: 'https://github.com/Versusrip/versus',
    year: 2025,
    description: `
      Prediction and betting product concept with a Solana-oriented architecture. Versus combines frontend flows, product logic, smart-contract interactions and community-oriented product strategy.
    `,
    role: `
      Founder and developer. Owned product thinking across UX, roadmap and go-to-market strategy while building the technical foundation with TypeScript, React, Python and Rust/Solana.
    `,
    techStack: ['TypeScript', 'React', 'Python', 'Rust', 'Solana'],
    thumbnail: '/projects/thumbnail/resume-roaster.jpg',
    longThumbnail: '/projects/long/resume-roaster.jpg',
    images: [
      '/projects/images/resume-roaster-1.png',
      '/projects/images/resume-roaster-2.png',
      '/projects/images/resume-roaster-3.png',
    ],
  },
  {
    title: 'ft_transcendence',
    slug: 'ft-transcendence',
    year: 2025,
    description: `
      42 Lyon capstone project: a full-stack real-time web game with single-player, multiplayer and tournament flows.
    `,
    role: `
      Built a custom React-like frontend architecture, real-time UX and WebSocket-driven game flows as part of the 42 Common Core curriculum.
    `,
    techStack: [
      'TypeScript',
      'Node.js',
      'WebSockets',
      'Real-time UX',
      'Frontend architecture',
    ],
    thumbnail: '/projects/thumbnail/devLinks.jpg',
    longThumbnail: '/projects/long/devLinks.jpg',
    images: [
      '/projects/images/devLinks-1.png',
      '/projects/images/devLinks-2.png',
      '/projects/images/devLinks-3.png',
    ],
  },
  {
    title: '42 Common Core',
    slug: '42-common-core',
    year: 2025,
    description: `
      Intensive peer-to-peer software engineering curriculum focused on autonomy, rigor and low-level foundations.
    `,
    role: `
      Completed projects covering algorithms, data structures, C, C++, system programming, networking, graphics and Docker. This foundation supports precise frontend engineering and deeper full-stack growth.
    `,
    techStack: ['C', 'C++', 'Algorithms', 'Networking', 'Docker'],
    thumbnail: '/projects/thumbnail/mti-electronics.webp',
    longThumbnail: '/projects/long/mti-electronics.webp',
    images: [
      '/projects/images/mti-electronics-1.webp',
      '/projects/images/mti-electronics-2.webp',
    ],
  },
];

export const MY_EXPERIENCE = [
  {
    title: 'Consultant, Frontend Developer',
    company: 'Jupiter',
    duration: 'Dec 2025 - Mar 2026',
  },
  {
    title: 'Internship, Open-source Contributor',
    company: 'Adrena',
    duration: '2025',
  },
  {
    title: 'Founder & Developer',
    company: 'Versus',
    duration: '2024 - 2025',
  },
  {
    title: 'Founder, Board Member',
    company: 'Magicake / Doge Capital',
    duration: '2021 - 2024',
  },
  {
    title: 'Common Core Graduate',
    company: '42 Lyon',
    duration: 'Nov 2023 - Jul 2025',
  },
  {
    title: 'Leatherwork Artisan',
    company: 'Hermes',
    duration: '2017 - 2021',
  },
];
