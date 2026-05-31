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
    images: [
      '/projects/images/resume-roaster-1.png',
      '/projects/images/resume-roaster-2.png',
      '/projects/images/resume-roaster-3.png',
    ],
  },
  {
    title: 'ft_transcendence',
    slug: 'ft-transcendence',
    sourceCode: 'https://github.com/Talibabtou/ft_transcendence',
    liveUrl: 'https://canva.link/fns0f2xr90f6vx9',
    year: 2025,
    summary:
      'My 42 Lyon capstone: a Dockerized real-time Pong platform with a custom TypeScript SPA, Fastify services, WebSocket gameplay, tournaments, user profiles and monitoring.',
    description: [
      'For the last 42 Common Core project, my team built a full-stack Pong platform instead of a small game demo. It has single-player, multiplayer, round-robin tournaments, profiles, stats, friends and settings.',
      'The frontend was the part I spent the most time on: a native TypeScript SPA with React-like components, client-side routing and explicit state updates. No React, no Vue, no framework safety net.',
    ],
    role: [
      'I built and wired most of the frontend structure, real-time screens and gameplay flows as part of a three-person team.',
      'My work sat where the browser meets the backend: routing, UI state, notifications, WebSocket updates and Pong interactions connected to services for auth, users, friends and game data.',
    ],
    context: [
      'ft_transcendence is the final web project in the 42 Common Core. The assignment expects a real multiplayer web app, with accounts and social flows, not just a canvas with a paddle.',
      'Frontend frameworks were forbidden, which made the project much more useful for me. I had to build the pieces I usually get from React and understand why they exist.',
    ],
    problem: [
      'The hard part was keeping the game responsive while the rest of the product still behaved like a normal app: accounts, profiles, friends, settings, stats and tournament screens all had to fit around the match flow.',
      'Because we couldn’t use React or a similar framework, I had to make lifecycle, rendering, state changes and routing explicit in TypeScript. That exposed every shortcut.',
    ],
    contributions: [
      'Built a native TypeScript single-page app with component classes, lifecycle methods and reusable UI pieces.',
      'Connected game and social flows through WebSocket updates, route-level UI states and notifications that users could actually act on.',
      'Helped ship Pong across single-player, multiplayer and tournament modes, including an algorithmic AI opponent.',
    ],
    decisions: [
      'We split backend responsibilities into services for authentication, users, friends, game data and gateway concerns.',
      'We used Docker Compose with Fastify, SQLite, Prometheus, Grafana and OpenTelemetry so the whole platform could run the same way on each machine.',
      'On the frontend, I copied the useful parts of modern component architecture in plain TypeScript: predictable rendering, explicit state updates and route-owned UI.',
    ],
    results: [
      'We delivered a complete real-time game platform with account management, social features, match flows, tournament support and monitoring.',
      'I came out of it much more comfortable with WebSocket UX, Dockerized services and the frontend mechanics that frameworks normally hide.',
    ],
    techStack: [
      'TypeScript',
      'Node.js',
      'Fastify',
      'WebSockets',
      'Docker',
      'Prometheus',
      'Grafana',
    ],
    thumbnail:
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/ft_transcendence/home-screen.tiff',
    images: [
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/ft_transcendence/home-screen.mp4',
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/ft_transcendence/pong.mp4',
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/ft_transcendence/tournament.mp4',
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/ft_transcendence/profile.mp4',
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/ft_transcendence/navigation.mp4',
    ],
  },
  {
    title: '42 Common Core',
    slug: '42-common-core',
    liveUrl: 'https://42lyon.fr/',
    sourceCode: 'https://github.com/Talibabtou/42-common-core',
    year: 2024,
    summary:
      'The peer-to-peer engineering curriculum where I learned to build, debug, defend my choices and keep going without lectures or ready-made answers.',
    description: [
      '42’s Common Core is project-based and peer-reviewed. There are no traditional classes, so I had to learn by reading docs, breaking things, asking better questions and defending my code in front of other students.',
      'I worked through low-level programming, algorithms, Unix systems, networking, graphics, C++, containers and web foundations. That mix changed how I debug: I’m much less afraid of going below the UI layer when something behaves strangely.',
    ],
    role: [
      'I completed the curriculum at 42 Lyon through individual and team projects in C, C++, Unix, networking, graphics and web development.',
      'It shaped the habits I still bring to product work: owning the problem, handling errors directly, reading other people’s code and explaining tradeoffs without hiding behind buzzwords.',
    ],
    context: [
      '42 is a self-directed engineering school where students move forward by shipping projects and passing peer evaluations.',
      'The Common Core comes before specialization. For me, it was the period where I built the base I now use for frontend, Web3 and product engineering work.',
    ],
    problem: [
      'The challenge wasn’t only learning syntax. It was learning how to approach an unfamiliar technical problem when nobody gives you the recipe.',
      'Most projects started with a dense subject PDF and ended with a defense. In between, I had to turn vague requirements into working software, handle edge cases and explain why my implementation made sense.',
    ],
    contributions: [
      'Built C projects around parsing, memory management, process control, shell behavior, networking and graphics.',
      'Completed C++ modules covering object-oriented design, type safety, resource management and standard library usage.',
      'Worked on team projects with real-time communication, Dockerized services and full-stack product flows.',
    ],
    decisions: [
      'I learned to prefer explicit error handling, readable control flow and defensive code because 42 evaluations tend to punish happy-path thinking.',
      'Peer review became part of the work, not a ceremony after it. If I couldn’t explain a choice clearly, the code usually needed another pass.',
    ],
    results: [
      'I built the low-level base that now helps me write better frontend and product code, especially when debugging performance, state or API behavior.',
      'I also got used to moving between systems programming, web interfaces, containers and API-driven apps without treating them as separate worlds.',
    ],
    techStack: ['C', 'C++', 'Unix', 'Algorithms', 'Networking', 'Docker'],
    thumbnail:
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/common-core/42-cluster.png',
    images: [
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/common-core/42.jpg',
      'https://rmfq7e6jij1yz4id.public.blob.vercel-storage.com/projects/common-core/42-values.png',
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
