'use client';

import { GENERAL_INFO } from '@/lib/data';
import { GitFork, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import SocialLinks from '@/components/SocialLinks';

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
        const statsResponse = await fetch('/api/github/repo-stats', {
          signal: abortController.signal,
        });

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
    <footer className="pt-3 pb-3 text-center" id="contact">
      <div className="container">
        <SocialLinks className="justify-center text-muted-foreground" />

        <a
          href={GENERAL_INFO.githubRepo}
          target="_blank"
          rel="noreferrer noopener"
          className="mx-auto mt-3 inline-flex items-center justify-center gap-4 text-muted-foreground text-sm hover:text-white"
        >
          <span>Talibabtou/portfolio</span>
          <span className="flex items-center gap-2">
            <Star size={16} /> {stargazers_count}
          </span>
          <span className="flex items-center gap-2">
            <GitFork size={16} /> {forks_count}
          </span>
        </a>

        <p className="mt-3 text-muted-foreground text-sm">
          Built and written by Guillaume Dumas.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
