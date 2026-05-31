import type { IProject } from '@/types';

type StackItem = {
  name: string;
  icon?: string;
};

type StackCategory = {
  stack: StackItem[];
  competencies: StackItem[];
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

export const MY_STACK: Record<string, StackCategory> = {
  frontend: {
    stack: [
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
        name: 'Redux',
        icon: '/logo/redux.png',
      },
      {
        name: 'Tailwind CSS',
        icon: '/logo/tailwind.png',
      },
    ],
    competencies: [
      {
        name: 'Component architecture',
      },
      {
        name: 'State management',
      },
      {
        name: 'Responsive UI',
      },
    ],
  },
  'data & APIs': {
    stack: [
      {
        name: 'Node.js',
        icon: '/logo/node.png',
      },
      {
        name: 'Python',
        icon: '/logo/python.svg',
      },
      {
        name: 'MySQL',
        icon: '/logo/mysql.svg',
      },
      {
        name: 'PostgreSQL',
        icon: '/logo/postgreSQL.png',
      },
    ],
    competencies: [
      {
        name: 'API integration',
      },
      {
        name: 'Data modeling',
      },
    ],
  },
  blockchain: {
    stack: [
      {
        name: 'Solana',
        icon: '/logo/solana.svg',
      },
      {
        name: 'Web3.js',
        icon: '/logo/web3js.svg',
      },
      {
        name: 'Rust',
        icon: '/logo/rust.svg',
      },
    ],
    competencies: [
      {
        name: 'On-chain data',
      },
      {
        name: 'Smart contract interactions',
      },
      {
        name: 'Wallet interactions',
      },
    ],
  },
  engineering: {
    stack: [
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
        icon: '/logo/c.svg',
      },
      {
        name: 'C++',
        icon: '/logo/c++.svg',
      },
    ],
    competencies: [
      {
        name: 'Performance',
      },
      {
        name: 'Maintainability',
      },
    ],
  },
  AI: {
    stack: [
      {
        name: 'Cursor',
        icon: '/logo/cursor.png',
      },
      {
        name: 'Claude',
        icon: '/logo/claude.webp',
      },
      {
        name: 'Codex',
        icon: '/logo/codex.svg',
      },
    ],
    competencies: [
      {
        name: 'Agentic workflows',
      },
      {
        name: 'Product specifications',
      },
      {
        name: 'Feedback loops',
      },
      {
        name: 'Verification',
      },
    ],
  },
};

export const PROJECTS: IProject[] = [
  {
    title: 'Jupiter Prediction Market',
    slug: 'jupiter-prediction-market',
    liveUrl: 'https://jup.ag/',
    year: 2026,
    description: [
      "Consultant frontend work on Jupiter's prediction market interface in the Solana ecosystem. The work focused on product clarity, interaction consistency and production-ready frontend implementation for market and wallet-aware flows.",
    ],
    role: [
      'Contributed frontend features in a fast-moving product context involving market data, wallet interactions and release quality. Improved screen clarity and implementation maintainability across user-facing flows.',
    ],
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
    description: [
      'Open-source internship contributions for a DeFi trading product. The work covered UI improvements, reusable components, product screens, dashboards and leaderboard experiences.',
    ],
    role: [
      'Delivered frontend improvements connected to backend data through API-driven features, with emphasis on data-heavy interface elements and trading product usability.',
    ],
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
    description: [
      'Prediction and betting product concept with a Solana-oriented architecture. Versus combines frontend flows, product logic, smart-contract interactions and community-oriented product strategy.',
    ],
    role: [
      'Founder and developer. Owned product thinking across UX, roadmap and go-to-market strategy while building the technical foundation with TypeScript, React, Python and Rust/Solana.',
    ],
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
    description: [
      '42 Lyon capstone project: a full-stack real-time web game with single-player, multiplayer and tournament flows.',
    ],
    role: [
      'Built a custom React-like frontend architecture, real-time UX and WebSocket-driven game flows as part of the 42 Common Core curriculum.',
    ],
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
    liveUrl: 'https://42lyon.fr/',
    sourceCode: 'https://github.com/Talibabtou/42-common-core',
    year: 2023,
    summary:
      'A selective peer-to-peer engineering curriculum where progress depends on shipping real projects, defending technical choices and learning autonomously without traditional classes.',
    description: [
      'The 42 Common Core is an intensive software engineering curriculum built around project-based learning, peer review and autonomy. Instead of lectures, students progress by solving increasingly complex problems, defending their implementation choices and reviewing other students’ work.',
      'The program covers low-level programming, algorithms, Unix systems, networking, graphics, C++, containers and full-stack foundations. It trained me to debug rigorously, read documentation directly and build reliable software under constraints.',
    ],
    role: [
      'Completed the curriculum as a student at 42 Lyon, working through individual and team projects in C, C++, Unix, networking, graphics and web development.',
      'The experience shaped my engineering habits: explicit ownership, careful memory and error handling, peer review, clean abstractions and persistence when facing unfamiliar systems.',
    ],
    context: [
      '42 is a self-directed engineering school where students learn by building projects and passing peer evaluations.',
      'The Common Core is designed to create strong fundamentals before specialization, with a heavy focus on autonomy, problem solving and technical rigor.',
    ],
    problem: [
      'The challenge was not only learning syntax or frameworks, but becoming able to approach unknown technical problems without relying on a teacher or predefined solution.',
      'Most projects required translating vague specifications into working software while handling edge cases, testing, code quality and oral defense.',
    ],
    contributions: [
      'Built low-level C projects involving parsing, memory management, process control, shell behavior, networking and graphics.',
      'Completed C++ modules focused on object-oriented design, type safety, resource management and standard library usage.',
      'Worked on team projects involving real-time communication, Dockerized services and full-stack product flows.',
    ],
    decisions: [
      'Prioritized explicit error handling, readable control flow and defensive programming because many 42 projects are evaluated through edge-case-heavy test suites.',
      'Used peer feedback as a quality loop: code was not considered finished until it could be explained clearly and reviewed by other students.',
    ],
    results: [
      'Built a strong low-level foundation that now supports frontend and product engineering work with better debugging, performance awareness and architectural discipline.',
      'Gained comfort moving between systems programming, web interfaces, containers and API-driven applications.',
    ],
    techStack: ['C', 'C++', 'Unix', 'Algorithms', 'Networking', 'Docker'],
    thumbnail: '/projects/common-core/42-cluster.png',
    longThumbnail: '/projects/common-core/42-cluster.png',
    images: [
      '/projects/common-core/42.jpg',
      '/projects/common-core/42-values.png',
    ],
  },
];

export const MY_EXPERIENCE = [
  {
    title: 'Consultant',
    company: 'Jupiter',
    duration: 'Early 2026',
    logo: '/experience/jupiter.svg',
  },
  {
    title: 'Internship',
    company: 'Adrena',
    duration: 'Late 2025',
    logo: '/experience/adrena.svg',
  },
  {
    title: 'Founder & Developer',
    company: 'Versus',
    duration: '2024 - 2025',
    logo: '/experience/versus.png',
  },
  {
    title: 'Common Core Graduate',
    company: '42 Lyon',
    duration: 'Late 2023 - Mid 2025',
    logo: '/experience/42.png',
  },
  {
    title: 'Founder',
    company: 'Magicake',
    duration: '2023 - 2025',
    logo: '/experience/magicake.png',
  },
  {
    title: 'Board Member',
    company: 'Doge Capital',
    duration: '2021 - 2024',
    logo: '/experience/doge-capital.png',
  },
  {
    title: 'Leatherwork Artisan',
    company: 'Hermes',
    duration: '2017 - 2021',
    logo: '/experience/hermes.svg',
  },
];
