import type { IProject } from '@/types';

type StackItem = {
  name: string;
  icon?: string;
};

type StackCategory = {
  stack: StackItem[];
  competencies: StackItem[];
};

type CvExperience = {
  company: string;
  location?: string;
  period: string;
  role: string;
  summary: string;
  bullets: string[];
  stack?: string[];
};

export const GENERAL_INFO = {
  name: 'Guillaume Dumas',
  email: 'talibabtou@gmail.com',
  phone: '+33 6 28 40 15 84',
  location: 'Grenoble, France',
  cvUrl: '/cv',
  cvPdfUrl: '/cv/guillaume-dumas-cv.pdf',
  websiteUrl: 'https://talibabtou.dev',
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

export const CV_CONTENT = {
  headline: 'Frontend / Product Developer',
  subheadline:
    'React/Next.js, TypeScript, APIs and real-time web apps, with enough backend awareness to understand the whole flow.',
  photo: {
    src: '/cv/gdumas.jpg',
    alt: 'Guillaume Dumas in 42 school',
  },
  intro: [
    'Frontend developer from Grenoble, trained at 42 School Lyon after a first career in high-end leather craft.',
    'I like turning complex product flows into clear, readable interfaces that feel easy to pick up.',
    'I care about details and the small defects users feel before they can describe them.',
  ],
  experience: [
    {
      company: 'Jupiter',
      location: 'Remote',
      period: 'Early 2026',
      role: 'Frontend Consultant',
      summary:
        'Frontend work on Jupiter Predict, a live market product inside a large React and TypeScript codebase.',
      bullets: [
        'Reworked activity, For You, live option and leaderboard screens.',
        'Improved chart behavior, payment UI and desktop/mobile states.',
      ],
      stack: ['TypeScript', 'React', 'Tailwind CSS', 'Solana', 'Charts'],
    },
    {
      company: 'Adrena',
      location: 'Remote',
      period: 'Late 2025',
      role: 'Frontend Intern',
      summary:
        'Joined a trading product team and shipped roughly 30 merged PRs across UI, swaps and optimized API work.',
      bullets: [
        'Reworked trading UI, token selector, staking leaderboard and ALP screens.',
        'Integrated Jupiter swaps, campaign UI and mobile layout fixes.',
      ],
      stack: ['TypeScript', 'React', 'Tailwind CSS', 'Web3.js', 'APIs'],
    },
    {
      company: 'Versus',
      location: 'Remote',
      period: '2024 - 2025',
      role: 'Founder & Developer',
      summary:
        'Built a real-time betting product around live AI fighting matches. Public testing: 100+ testers, around 100 SOL in total volume.',
      bullets: [
        'Owned the Twitch scraper, oracle and monorepo work.',
        'Handled timing bugs, invalid matches, refunds and payout logic.',
      ],
      stack: [
        'TypeScript',
        'Next.js',
        'Fastify',
        'PostgreSQL',
        'Solana',
        'SSE',
      ],
    },
    {
      company: '42 Lyon',
      location: 'Lyon, France',
      period: 'Late 2023 - Mid 2025',
      role: 'Common Core Graduate',
      summary:
        'Completed the peer-reviewed 42 Common Core through low-level, systems and web projects.',
      bullets: [
        'Built projects in C, C++, Unix, networking, graphics and Docker.',
        'Finished ft_transcendence: a Pong platform with multiplayer tournaments in a TypeScript SPA.',
      ],
      stack: ['C', 'C++', 'Unix', 'Docker', 'TypeScript'],
    },
    {
      company: 'Magicake & Doge Capital',
      period: '2021 - 2024',
      role: 'Founder, Board Member',
      summary:
        'Built product, community and strategy experience around digital projects and online communities.',
      bullets: [
        'Handled communication, operations, business development and strategic decisions.',
      ],
    },
  ] satisfies CvExperience[],
  previousCareer: [
    {
      company: 'Tali',
      location: 'Barcelona, Spain',
      period: '2022 - 2023',
      role: 'Independent Leatherwork Consultant',
      summary: 'Joined a creative studio and worked on luxury goods.',
      bullets: [],
    },
    {
      company: 'Hermes',
      location: 'France',
      period: '2017 - 2021',
      role: 'Leather Artisan',
      summary:
        'Worked in high-end manufacturing with strong expectations around precision and craftsmanship.',
      bullets: ['Assembled over one hundred Kelly bags.'],
    },
    {
      company: 'EDA',
      location: 'France',
      period: '2014 - 2016',
      role: 'Alternating Student, Technical Office',
      summary:
        'Worked on estimates, manufacturing drawings, safety reports and customer communication.',
      bullets: [
        'Built an early habit of turning technical constraints into documents other people could use.',
      ],
    },
  ] satisfies CvExperience[],
  education: [
    {
      school: '42 Lyon',
      period: 'Late 2023 - Mid 2025',
      title: 'Common Core',
      details:
        'Peer-to-peer software engineering curriculum focused on projects, code review and technical defense.',
    },
    {
      school: 'GRETA Lyon',
      period: '2018',
      title: 'CAP Leatherworker',
      details: 'Professional leatherwork training.',
    },
    {
      school: 'ISCO Grenoble',
      period: '2016',
      title: 'Bachelor-level Technical Building Management',
      details: 'Technical building management and office work training.',
    },
    {
      school: 'Lycee Champollion',
      period: '2012',
      title: 'Scientific Baccalaureate',
      details: 'Scientific high school diploma.',
    },
  ],
  stack: [
    'TypeScript',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'Fastify',
    'REST APIs',
    'WebSockets',
    'PostgreSQL',
    'Docker',
    'Git',
    'Solana',
    'Web3.js',
    'C',
    'C++',
  ],
  softSkills: [
    'Product understanding',
    'Ownership',
    'Communication',
    'Code review',
    'Design sense',
    'Attention to detail',
    'Business insight',
    'Community building',
  ],
  languages: ['French native', 'English fluent'],
};

export type CvContent = typeof CV_CONTENT;

export const CV_CONTENT_FR = {
  headline: 'Développeur Frontend / Produit',
  subheadline:
    'React/Next.js, TypeScript, APIs et applications temps réel, avec assez de recul backend pour comprendre le flux complet.',
  photo: {
    src: '/cv/gdumas.jpg',
    alt: 'Guillaume Dumas à 42 School',
  },
  intro: [
    'Développeur frontend basé à Grenoble, formé à 42 School Lyon après une première carrière dans la maroquinerie haut de gamme.',
    "J'aime transformer des parcours produit complexes en interfaces claires, lisibles et simples à prendre en main.",
    'Je fais attention aux détails et aux petits défauts que les utilisateurs ressentent avant même de pouvoir les décrire.',
  ],
  experience: [
    {
      company: 'Jupiter',
      location: 'Télétravail',
      period: 'Début 2026',
      role: 'Consultant Frontend',
      summary:
        'Travail frontend sur Jupiter Predict, un produit de marché live dans une large codebase React et TypeScript.',
      bullets: [
        "Refonte de la page d'activité, For You, live option et leaderboard.",
        "Amélioration du comportement des charts, de l'UI de paiement et des états desktop/mobile.",
      ],
      stack: ['TypeScript', 'React', 'Tailwind CSS', 'Solana', 'Charts'],
    },
    {
      company: 'Adrena',
      location: 'Télétravail',
      period: 'Fin 2025',
      role: 'Stagiaire Frontend',
      summary:
        "Intégration dans une équipe produit trading et livraison d'environ 30 PR mergées sur l'UI, les swaps et des optimisations API.",
      bullets: [
        "Refonte de l'UI trading, du sélecteur de token, du leaderboard de staking et de la page ALP.",
        "Intégration des swaps Jupiter, d'interfaces de campagne et de corrections mobile.",
      ],
      stack: ['TypeScript', 'React', 'Tailwind CSS', 'Web3.js', 'APIs'],
    },
    {
      company: 'Versus',
      location: 'Télétravail',
      period: '2024 - 2025',
      role: 'Fondateur & Développeur',
      summary:
        "Création d'un produit de pari temps réel autour de combats IA diffusés en live. Test public : 100+ testeurs, environ 100 SOL de volume total.",
      bullets: [
        "Responsable du scraper Twitch, de l'oracle et du travail monorepo.",
        'Gestion des bugs de timing, matchs invalides, remboursements et logique de paiement.',
      ],
      stack: [
        'TypeScript',
        'Next.js',
        'Fastify',
        'PostgreSQL',
        'Solana',
        'SSE',
      ],
    },
    {
      company: '42 Lyon',
      location: 'Lyon, France',
      period: 'Fin 2023 - Mi 2025',
      role: 'Diplômé du Common Core',
      summary:
        'Validation du Common Core 42, fondé sur les projets, la revue par les pairs et la soutenance technique.',
      bullets: [
        'Projets en C, C++, Unix, réseau, graphisme et Docker.',
        'Finalisation de ft_transcendence : plateforme Pong avec tournois multijoueurs dans une SPA TypeScript.',
      ],
      stack: ['C', 'C++', 'Unix', 'Docker', 'TypeScript'],
    },
    {
      company: 'Magicake & Doge Capital',
      period: '2021 - 2024',
      role: 'Fondateur, Board Member',
      summary:
        'Expérience produit, communauté et stratégie autour de projets digitaux et de communautés en ligne.',
      bullets: [
        'Gestion de la communication, des opérations, du développement business et des décisions stratégiques.',
      ],
    },
  ] satisfies CvExperience[],
  previousCareer: [
    {
      company: 'Tali',
      location: 'Barcelone, Espagne',
      period: '2022 - 2023',
      role: 'Consultant indépendant en maroquinerie',
      summary: 'Collaboration avec un studio créatif sur des produits de luxe.',
      bullets: [],
    },
    {
      company: 'Hermes',
      location: 'France',
      period: '2017 - 2021',
      role: 'Artisan maroquinier',
      summary:
        'Travail en fabrication haut de gamme, avec de fortes exigences de précision et de qualité.',
      bullets: ['Assemblage de plus de cent sacs Kelly.'],
    },
    {
      company: 'EDA',
      location: 'France',
      period: '2014 - 2016',
      role: 'Alternant, bureau technique',
      summary:
        'Travail sur devis, plans de fabrication, rapports de sécurité et communication client.',
      bullets: [
        "Première habitude prise : transformer des contraintes techniques en documents utilisables par d'autres.",
      ],
    },
  ] satisfies CvExperience[],
  education: [
    {
      school: '42 Lyon',
      period: 'Fin 2023 - Mi 2025',
      title: 'Common Core',
      details:
        'Cursus de développement logiciel en peer-to-peer, centré sur les projets, la revue de code et la défense technique.',
    },
    {
      school: 'GRETA Lyon',
      period: '2018',
      title: 'CAP Maroquinier',
      details: 'Formation professionnelle en maroquinerie.',
    },
    {
      school: 'ISCO Grenoble',
      period: '2016',
      title: "Bachelor chargé d'affaires bâtiment",
      details: "Formation en gestion technique du bâtiment et bureau d'études.",
    },
    {
      school: 'Lycée Champollion',
      period: '2012',
      title: 'Baccalauréat scientifique',
      details: 'Diplôme du secondaire, filière scientifique.',
    },
  ],
  stack: CV_CONTENT.stack,
  softSkills: [
    'Compréhension produit',
    'Engagement',
    'Communication',
    'Revue de code',
    'Sens design',
    'Attention du détail',
    'Vision business',
    'Animation de communauté',
  ],
  languages: ['Français natif', 'Anglais courant'],
} satisfies CvContent;

export const MY_EXPERIENCE = [
  {
    title: 'Frontend Consultant',
    company: 'Jupiter',
    duration: 'Early 2026',
    logo: '/experience/jupiter.svg',
  },
  {
    title: 'Frontend Intern',
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
    title: 'Leather Artisan',
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
    title: 'Jupiter Predict',
    slug: 'jupiter-prediction-market',
    liveUrl: 'https://jup.ag/prediction',
    year: 2026,
    summary:
      'Frontend consulting work on Jupiter Predict, the prediction-market product inside Jupiter. For someone just out of school, working inside one of Solana’s top product teams was a real step up: bigger codebase, sharper reviews and users who notice every unclear state.',
    description: [
      'Jupiter Predict brings prediction markets from Polymarket and other venues into a Solana-native trading flow.',
      'My work sat on the frontend side of the Predict team. I was changing pieces of a live trading product, inside a codebase that already had its own internal patterns, components and expectations.',
    ],
    role: [
      'I worked with the Predict team as a frontend-focused consultant in a group of four.',
      'Most of my shipped work came through small product fixes and larger UI passes: activity tab rework, For You tab, live option, leaderboard creation, charting changes, Pay with any crypto integration and a series of desktop/mobile cleanup tasks across the product.',
      'I also prepared profile changes near the end of the work period, but those didn’t get accepted before my mission ended, so I’m not counting them as shipped work.',
    ],
    context: [
      'Jupiter is one of the products that defines Solana UX for a lot of users. Joining that environment right after school mattered because the bar was no longer academic or personal-project level.',
      'Predict also has a harder UX problem than a normal content page: the user needs to understand a market, read a chart, act with a wallet and trust what happens after the click.',
    ],
    problem: [
      'The hardest part wasn’t code. I often had to coordinate with other team members because I wasn’t allowed to change the API myself, which meant waiting for data changes or adjusting the frontend around shapes I didn’t fully control.',
      'The second hard part was invisible: making the same product feel clean on desktop and mobile while the screens were dense, animated, market-driven and already built on a large internal frontend system.',
    ],
    contributions: [
      'Reworked the activity tab and worked on the For You experience.',
      'Built the leaderboard used by Predict.',
      'Added the live option and worked through smaller product UI/UX fixes across the site.',
      'Changed the charting approach so charts felt more alive while staying readable for trading decisions.',
      'Worked on Pay with any crypto integration and touched most Predict pages through desktop and mobile fixes.',
    ],
    decisions: [
      'I leaned into Jupiter’s existing internal framework instead of trying to bring my own habits into the codebase. A lot was already built, so the work was about fitting into their system and making changes that survived review.',
      'On charts, I cared about more than rendering data. The goal was to make the chart feel active and pleasant without losing clarity, because prediction markets get confusing fast when the visual hierarchy is weak.',
    ],
    results: [
      'Most of my work shipped after review rounds with the team.',
      'This project gave me the proof I wanted: I can work inside a top Solana product team, not only around one from the outside.',
      'It also taught me how different international teams can feel compared with French work culture, especially around hierarchy, feedback and how much ownership you’re expected to take without being asked twice.',
    ],
    techStack: [
      'TypeScript',
      'React',
      'Tailwind CSS',
      'Solana',
      'Wallet UX',
      'Market data',
      'Charts',
    ],
    thumbnail: `${PROJECT_MEDIA_BASE}/jupiter/chart.png`,
    thumbnailHeight: 400,
    thumbnailWidth: 600,
    images: [
      `${PROJECT_MEDIA_BASE}/jupiter/home-page.png`,
      `${PROJECT_MEDIA_BASE}/jupiter/for-you-tab.png`,
      `${PROJECT_MEDIA_BASE}/jupiter/market-page.png`,
      `${PROJECT_MEDIA_BASE}/jupiter/leaderboard.png`,
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
      'Adrena is a Solana trading app for spot and perpetual markets. I joined through an internship format, but the work felt like real product work quickly: I had daily reports to share with other developers, code reviews to pass and screens that actual traders would use.',
      'Most of my time went into the user-facing product: trading UI, chart work, token selector, staking leaderboard, ALP page, Jupiter swap integration and the first anniversary campaign.',
    ],
    role: [
      'I worked mainly on frontend UX and shipped roughly 30 merged PRs, ranging from chores to full page reworks.',
      'I also touched the API layer when a screen needed cleaner data or a better shape, and I kept those changes small because the product was already live.',
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
      'I kept reporting clearly to the team because the internship had a structured rhythm, but I was still trusted by the rest of the team with product screens that mattered.',
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
      'Solana',
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
      'Versus started as a product bet and a technical bet at the same time: could we turn SaltyBet AI fighter matches into a live Solana betting experience that felt fast enough for real users?',
      'We built it as a multi-service TypeScript system with a Next.js frontend, Fastify backend, PostgreSQL with Drizzle, Twitch scraper, Solana oracle and jackpot worker running in parallel.',
    ],
    role: [
      'I worked on the product with Frensurfer over roughly 4 months, half time, while owning the oracle, the Twitch scraper and a lot of the repo coordination work across services.',
      'My part sat close to the parts users never see but immediately feel when they break: phase detection, timing between services, payout logic, refunds, Solana transaction handling and keeping the repo runnable while the product kept moving.',
    ],
    context: [
      'The product follows SaltyBet AI fighting matches: red fighter versus blue fighter, betting opens, bets lock, the match runs, then the result drives payouts.',
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
      'Worked through mainnet edge cases during public testing, including late state changes, invalid matches, refunds and payout paths where the product couldn’t afford vague behavior.',
    ],
    decisions: [
      'We used Server-Sent Events instead of a heavier socket layer because the frontend mostly needs one-way live state: phase changes, match data, volume updates and global stats.',
      'We split the system into frontend, backend, scraper, oracle and jackpot packages so each service could fail, restart and deploy with a narrower responsibility.',
      'The oracle treated invalid matches as a normal branch, not an exception. If only one side had bets, or if a match couldn’t settle cleanly, the system needed a refund path instead of pretending every fight was usable.',
      'We stopped the public test even though the product worked, because maintaining five live services plus a mainnet money flow deserved more time than we could give it.',
    ],
    results: [
      'Versus handled 100+ public testers and roughly 100 SOL of total betting volume before we took it down.',
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
      'My work sat where the browser meets the backend and the game itself: routing, UI state, notifications, WebSocket updates, canvas rendering and Pong interactions connected to services for auth, users, friends and game data.',
    ],
    context: [
      'ft_transcendence is the final web project in the 42 Common Core. The assignment expects a real multiplayer web app, with accounts and social flows, not just a canvas with a paddle.',
      'Frontend frameworks were forbidden, which made the project much more useful for me. I had to build the pieces I usually get from React and understand why they exist.',
    ],
    problem: [
      'The hard part was keeping the game responsive while the rest of the product still behaved like a normal app: accounts, profiles, friends, settings, stats and tournament screens all had to fit around the match flow.',
      'We also had to build the actual Pong game in the browser: canvas dimensions, ball movement, paddle hitboxes, collision behavior and the small details that decide whether a match feels fair or broken.',
      'Because we couldn’t use React or a similar framework, I had to make lifecycle, rendering, state changes and routing explicit in TypeScript. That exposed every shortcut.',
    ],
    contributions: [
      'Built a native TypeScript single-page app with component classes, lifecycle methods and reusable UI pieces.',
      'Worked on the web canvas game layer, including match dimensions, ball behavior, paddle hitboxes, collisions, AI player and gameplay states.',
      'Connected game and social flows through WebSocket updates, route-level UI states and toast notifications that users could actually act on.',
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
      'Gaming',
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
