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
  { name: 'twitter', url: 'https://x.com/Talibabtou' },
  { name: 'cv', url: GENERAL_INFO.cvUrl },
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

const PROJECT_MEDIA_BASE = '/media/projects';

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
    thumbnail: `${PROJECT_MEDIA_BASE}/thumbnail/consulting-finance.jpg`,
    thumbnailHeight: 400,
    thumbnailWidth: 600,
    images: [
      `${PROJECT_MEDIA_BASE}/images/consulting-finance-1.png`,
      `${PROJECT_MEDIA_BASE}/images/consulting-finance-2.png`,
      `${PROJECT_MEDIA_BASE}/images/consulting-finance-3.png`,
    ],
  },
  {
    title: 'Adrena',
    slug: 'adrena',
    liveUrl: 'https://adrena.xyz/',
    sourceCode: 'https://github.com/AdrenaFoundation',
    year: 2025,
    summary:
      'My DeFi internship inside Adrena, a Solana trading product where I shipped around 30 merged PRs across trading screens, staking pages, campaign UI, swaps and smaller API work.',
    description: [
      'Adrena is a Solana trading app for spot and perpetual markets. I joined through an internship format, but the work felt like real product work quickly: I had reports to share with other developers, code reviews to pass and screens that actual traders would use.',
      'Most of my time went into the user-facing product: trading UI, chart work, token selector, staking leaderboard, ALP page, Jupiter swap integration and the first anniversary campaign.',
    ],
    role: [
      'I worked mainly on frontend UX and shipped roughly 30 merged PRs, ranging from chores to full page reworks.',
      'I also touched a bit of the API layer when the frontend needed cleaner data or a better shape for a screen.',
    ],
    context: [
      'This was my first experience inside a DeFi product team where the interface has to make money-related actions feel clear without hiding the risk behind a pretty screen.',
      'The product mixes trading, staking, swaps, leaderboard mechanics and campaign pages, so the frontend had to stay coherent across very different flows.',
    ],
    problem: [
      'The hardest part for me was the visible part: Tailwind details, mobile views, responsive states and tiny flickers that make a trading interface feel unfinished.',
      'I care a lot about this kind of polish. A chart that jumps, a token selector that feels cramped on mobile or a staking card that shifts during load can make the whole product feel less serious than the engineering behind it.',
    ],
    contributions: [
      'Worked on the trading interface, including chart-related UI and the token selector.',
      'Reworked product pages around staking, the leaderboard and ALP.',
      'Integrated Jupiter swap flows into the product experience.',
      'Built UI for Adrena’s first anniversary campaign and handled smaller chores around the repo.',
      'Adjusted API-facing pieces when a screen needed cleaner data to behave properly.',
    ],
    decisions: [
      'I treated mobile as a real target, not a smaller desktop. The work often came down to spacing, ordering, loading states and removing the little jumps that users notice before they can explain them.',
      'I kept reporting clearly to the team because the internship had a structured rhythm, but I was still trusted with product screens that mattered.',
    ],
    results: [
      'Around 30 of my PRs were merged during the internship.',
      'I learned that this is the kind of team setup where I do my best work: enough trust to own details, enough review to raise the level, and a product where frontend choices directly affect user confidence.',
    ],
    techStack: [
      'TypeScript',
      'React',
      'Tailwind CSS',
      'Web3.js',
      'APIs',
      'Dashboards',
      'DeFi',
    ],
    thumbnail: `${PROJECT_MEDIA_BASE}/adrena/adrena.png`,
    thumbnailHeight: 400,
    thumbnailWidth: 600,
    images: [
      `${PROJECT_MEDIA_BASE}/adrena/trading-screen.png`,
      `${PROJECT_MEDIA_BASE}/adrena/mutagen.png`,
      `${PROJECT_MEDIA_BASE}/adrena/monitor.png`,
      `${PROJECT_MEDIA_BASE}/adrena/staking-monitor.png`,
    ],
  },
  {
    title: 'Versus',
    slug: 'versus',
    sourceCode: 'https://github.com/Versusrip/versus',
    year: 2025,
    summary:
      'A Solana betting product I built with Frensurfer around live AI fighting matches. It reached public testing, handled 100+ testers and around 150 SOL in total volume before we paused it because we couldn’t maintain it properly.',
    description: [
      'Versus started as a product bet and a technical bet at the same time: could we turn SaltyBet-style AI fighter matches into a live Solana betting experience that felt fast enough for real users?',
      'We built it as a multi-service TypeScript system with a Next.js frontend, Fastify backend, PostgreSQL with Drizzle, Twitch scraper, Solana oracle and jackpot worker running in parallel.',
    ],
    role: [
      'I worked on the product with Frensurfer over roughly 4 months, half time, while owning the oracle, the Twitch scraper and a lot of the repo coordination work across services.',
      'My part sat close to the parts users never see but immediately feel when they break: phase detection, timing between services, payout logic, refunds, Solana transaction handling and keeping the repo runnable while the product kept moving.',
    ],
    context: [
      'The product follows SaltyBet-style AI fighting matches: red fighter versus blue fighter, betting opens, bets lock, the match runs, then the result drives payouts.',
      'We ran it on Solana mainnet during public testing. There was no custom smart contract layer in this version; the oracle managed a private wallet and coordinated the money flow from detected match state.',
    ],
    problem: [
      'The hardest problem was avoiding duplicated state and conflicting timings between the website and the oracle. If the frontend thinks betting is open while the oracle has already moved on, users lose trust immediately.',
      'Twitch chat announces phases, the backend stores match and bet state, the frontend needs live updates, and the oracle has to read Solana transactions before computing winners, refunds, referrals and house fees. Getting those pieces to agree was the real work.',
    ],
    contributions: [
      'Built the Twitch scraper that listens for match phases and sends structured updates to the backend instead of relying on manual admin actions.',
      'Owned the Solana oracle flow around phase changes, private wallet operations, transaction fetching, payout computation, refunds, referral deductions and transfer execution.',
      'Handled a lot of the monorepo work: keeping the frontend, backend, scraper, oracle and jackpot services aligned enough to test and deploy together.',
      'Worked through mainnet edge cases during public testing, including late state changes, invalid matches and payout paths where the product couldn’t afford vague behavior.',
    ],
    decisions: [
      'I used Server-Sent Events instead of a heavier socket layer because the frontend mostly needs one-way live state: phase changes, match data, volume updates and global stats.',
      'I split the system into frontend, backend, scraper, oracle and jackpot packages so each service could fail, restart and deploy with a narrower responsibility.',
      'The oracle treated invalid matches as a normal branch, not an exception. If only one side had bets, or if a match couldn’t settle cleanly, the system needed a refund path instead of pretending every fight was usable.',
      'We stopped the public test even though the product worked, because maintaining five live services plus a mainnet money flow deserved more time than we could give it.',
    ],
    results: [
      'Versus handled 100+ public testers and roughly 150 SOL of total betting volume before we took it down.',
      'It’s the project that best shows how I think under product pressure: I can care about the betting screen, but I’m also watching the service boundary, the timing bug, the failed payout and the user who just wants to know where their SOL went.',
    ],
    techStack: [
      'TypeScript',
      'Next.js',
      'React',
      'Fastify',
      'PostgreSQL',
      'Drizzle',
      'Solana',
      'SSE',
      'Twitch IRC',
    ],
    thumbnail: `${PROJECT_MEDIA_BASE}/versus/versus.jpeg`,
    thumbnailHeight: 400,
    thumbnailWidth: 600,
    images: [
      `${PROJECT_MEDIA_BASE}/versus/saltybet-battle-1.mp4`,
      `${PROJECT_MEDIA_BASE}/versus/saltybet-battle-2.mp4`,
      `${PROJECT_MEDIA_BASE}/versus/betting-phase.jpeg`,
      `${PROJECT_MEDIA_BASE}/versus/result-phase.jpeg`,
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
    thumbnail: `${PROJECT_MEDIA_BASE}/ft_transcendence/home-screen.png`,
    thumbnailHeight: 884,
    thumbnailWidth: 844,
    images: [
      `${PROJECT_MEDIA_BASE}/ft_transcendence/home-screen.mp4`,
      `${PROJECT_MEDIA_BASE}/ft_transcendence/pong.mp4`,
      `${PROJECT_MEDIA_BASE}/ft_transcendence/tournament.mp4`,
      `${PROJECT_MEDIA_BASE}/ft_transcendence/profile.mp4`,
      `${PROJECT_MEDIA_BASE}/ft_transcendence/navigation.mp4`,
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
    thumbnail: `${PROJECT_MEDIA_BASE}/common-core/42-cluster.png`,
    thumbnailHeight: 681,
    thumbnailWidth: 1024,
    images: [
      `${PROJECT_MEDIA_BASE}/common-core/42.jpg`,
      `${PROJECT_MEDIA_BASE}/common-core/42-values.png`,
    ],
  },
];
