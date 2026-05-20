'use client';

import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { GitFork, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RepoStats {
  stargazers_count: number;
  forks_count: number;
}

const EMPTY_REPO_STATS: RepoStats = {
  stargazers_count: 0,
  forks_count: 0,
};

const Footer = () => {
  const [repoStats, setRepoStats] = useState<RepoStats>(EMPTY_REPO_STATS);

  useEffect(() => {
    const abortController = new AbortController();

    const loadRepoStats = async () => {
      try {
        const statsResponse = await fetch(
          'https://api.github.com/repos/Talibabtou/portfolio',
          {
            signal: abortController.signal,
          },
        );

        if (!statsResponse.ok) {
          return;
        }

        setRepoStats((await statsResponse.json()) as RepoStats);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    };

    void loadRepoStats();

    return () => abortController.abort();
  }, []);

  const { stargazers_count, forks_count } = repoStats;

  return (
    <footer className="pt-section pb-5 text-center" id="contact">
      <div className="container">
        <p className="text-lg">Building a Web3 or fintech product?</p>
        <a
          href={`mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(
            GENERAL_INFO.emailSubject,
          )}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`}
          className="mt-5 mb-8 inline-block font-anton text-3xl hover:underline sm:text-4xl"
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
              className="capitalize hover:text-white hover:underline"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href={GENERAL_INFO.githubRepo}
          target="_blank"
          rel="noreferrer noopener"
          className="mx-auto mt-6 inline-flex items-center justify-center gap-5 text-muted-foreground text-sm hover:text-white"
        >
          <span>Talibabtou/portfolio</span>
          <span className="flex items-center gap-2">
            <Star size={16} /> {stargazers_count}
          </span>
          <span className="flex items-center gap-2">
            <GitFork size={16} /> {forks_count}
          </span>
        </a>

        <p className="mt-6 text-muted-foreground text-sm">
          Design adapted and content revised by Guillaume Dumas.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
