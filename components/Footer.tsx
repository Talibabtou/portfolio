import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { GitFork, Star } from 'lucide-react';

interface RepoStats {
  stargazers_count: number;
  forks_count: number;
}

const getRepoStats = async (): Promise<RepoStats> => {
  try {
    const repoStats = await fetch(
      'https://api.github.com/repos/Talibabtou/portfolio',
      {
        next: {
          revalidate: 60 * 60,
        },
      },
    );

    if (!repoStats.ok) {
      throw new Error('Unable to fetch repository stats');
    }

    return (await repoStats.json()) as RepoStats;
  } catch {
    return {
      stargazers_count: 0,
      forks_count: 0,
    };
  }
};

const Footer = async () => {
  const { stargazers_count, forks_count } = await getRepoStats();

  return (
    <footer className="text-center pb-5" id="contact">
      <div className="container">
        <p className="text-lg">Building a Web3 or fintech product?</p>
        <a
          href={`mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(
            GENERAL_INFO.emailSubject,
          )}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`}
          className="text-3xl sm:text-4xl font-anton inline-block mt-5 mb-8 hover:underline"
        >
          {GENERAL_INFO.email}
        </a>

        <div className="flex justify-center gap-5 text-muted-foreground">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="capitalize hover:underline hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href={GENERAL_INFO.githubRepo}
          target="_blank"
          rel="noreferrer noopener"
          className="mx-auto mt-6 inline-flex items-center justify-center gap-5 text-sm text-muted-foreground hover:text-white"
        >
          <span>Talibabtou/portfolio</span>
          <span className="flex items-center gap-2">
            <Star size={16} /> {stargazers_count}
          </span>
          <span className="flex items-center gap-2">
            <GitFork size={16} /> {forks_count}
          </span>
        </a>

        <p className="mt-6 text-sm text-muted-foreground">
          Design adapted and content revised by Guillaume Dumas.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
