'use client';

import {
  DEFAULT_TAB,
  fetchGitHubLeaderboard,
  getGitHubLeaderboardCache,
  getRepositoryAvatarUrl,
  getRepositoryStarsPerDay,
  isGitHubLeaderboardFresh,
  preloadGitHubRadarDemo,
  RISING_CANDIDATE_COUNT,
  type GitHubRepository,
  type LeaderboardTabId,
} from '@/app/_components/demos/data/GitHubRadarDemo';
import type { DemoTrack } from '@/app/_components/demos/types';
import { cn } from '@/lib/utils';
import { Flame, GitFork, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
});

const leaderboardTabs: {
  description: string;
  id: LeaderboardTabId;
  label: string;
}[] = [
  {
    description: `Top 3 by stars/day from ${RISING_CANDIDATE_COUNT} recent candidates.`,
    id: 'rising',
    label: 'Rising',
  },
  {
    description: 'Public repositories sorted by total stars.',
    id: 'stars',
    label: 'Most liked',
  },
  {
    description: 'Public repositories sorted by forks.',
    id: 'forks',
    label: 'Most forked',
  },
];

const githubRadarContent = {
  detail:
    'A recruiter-friendly demo for API integration, ranking, pagination, rate-limit handling and skeleton states.',
  eyebrow: 'GitHub Radar',
  icon: GitFork,
  id: 'github-radar',
  label: 'GitHub Radar',
  metrics: ['Stars', 'Forks', 'Velocity'],
  title: 'GitHub repository leaderboards from the public Search API.',
};

const getRepositorySignal = (
  repository: GitHubRepository,
  activeTab: LeaderboardTabId,
) => {
  if (activeTab === 'forks') {
    return {
      icon: GitFork,
      label: 'forks',
      value: compactNumberFormatter.format(repository.forks_count),
    };
  }

  if (activeTab === 'rising') {
    return {
      icon: Flame,
      label: 'stars/day',
      value: compactNumberFormatter.format(
        getRepositoryStarsPerDay(repository),
      ),
    };
  }

  return {
    icon: Star,
    label: 'stars',
    value: compactNumberFormatter.format(repository.stargazers_count),
  };
};

const getSortedRepositories = (
  repositories: GitHubRepository[],
  activeTab: LeaderboardTabId,
) => {
  if (activeTab !== 'rising') return repositories;

  return [...repositories].sort(
    (firstRepository, secondRepository) =>
      getRepositoryStarsPerDay(secondRepository) -
      getRepositoryStarsPerDay(firstRepository),
  );
};

const GitHubRadarDemo = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTabId>(DEFAULT_TAB);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);

  const activeTabMeta =
    leaderboardTabs.find((tab) => tab.id === activeTab) ?? leaderboardTabs[0];
  const hasRepositories = repositories.length > 0;
  const shouldShowErrorState = Boolean(error) && !hasRepositories;
  const shouldShowLoadingState = isLoading && !hasRepositories;
  const visibleRepositories = useMemo(
    () => getSortedRepositories(repositories, activeTab).slice(0, 3),
    [activeTab, repositories],
  );

  useEffect(() => {
    const cachedLeaderboard = getGitHubLeaderboardCache(activeTab, {
      allowStale: true,
    });
    if (cachedLeaderboard) {
      queueMicrotask(() => {
        setRepositories(cachedLeaderboard.items);
        setError(undefined);
        setIsLoading(!isGitHubLeaderboardFresh(cachedLeaderboard));
      });
    }

    let ignoreRequest = false;

    fetchGitHubLeaderboard(activeTab)
      .then((leaderboard) => {
        if (ignoreRequest) return;

        setRepositories(leaderboard.items);
        setError(undefined);
      })
      .catch(() => {
        if (ignoreRequest) return;

        setError('GitHub Search API unavailable. Try again in a moment.');
        if (!cachedLeaderboard) {
          setRepositories([]);
        }
      })
      .finally(() => {
        if (!ignoreRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      ignoreRequest = true;
    };
  }, [activeTab]);

  const handleTabChange = (tabId: LeaderboardTabId) => {
    setActiveTab(tabId);
    setError(undefined);

    const cachedLeaderboard = getGitHubLeaderboardCache(tabId, {
      allowStale: true,
    });
    if (cachedLeaderboard) {
      setRepositories(cachedLeaderboard.items);
      setIsLoading(!isGitHubLeaderboardFresh(cachedLeaderboard));
      return;
    }

    setIsLoading(true);
  };

  return (
    <div className="mt-auto flex min-h-0 flex-1 flex-col pt-5">
      <div className="flex flex-wrap items-start justify-between gap-5 border-foreground/10 border-b pb-3">
        <div>
          <span className="font-anton text-muted-foreground text-sm uppercase">
            Public Search API
          </span>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <strong className="font-anton text-5xl leading-none md:text-6xl">
              Repository leaderboard
            </strong>
            <span className="font-anton text-muted-foreground text-xl">
              Top 3 public repos
            </span>
          </div>
        </div>

        <fieldset className="flex border border-foreground/10">
          <legend className="sr-only">GitHub leaderboard mode</legend>
          {leaderboardTabs.map((tab) => (
            <button
              aria-pressed={tab.id === activeTab}
              className={cn(
                'h-10 border-foreground/10 border-l px-4 font-anton text-sm transition-colors first:border-l-0 hover:bg-foreground hover:text-background',
                {
                  'bg-foreground text-background': tab.id === activeTab,
                  'text-muted-foreground': tab.id !== activeTab,
                },
              )}
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="relative mt-3 flex min-h-86 flex-1 flex-col">
        {shouldShowLoadingState ? (
          <div className="grid flex-1 place-items-center overflow-hidden border border-foreground/10 bg-background-light">
            <Loader2 className="animate-spin text-primary" size={30} />
          </div>
        ) : shouldShowErrorState ? (
          <div className="grid flex-1 place-items-center border border-foreground/10 bg-background-light px-6 text-center">
            <span className="max-w-80 text-muted-foreground">{error}</span>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col border border-foreground/10 bg-background-light">
            <div className="flex items-center justify-between gap-4 border-foreground/10 border-b px-4 py-3">
              <div>
                <span className="font-anton text-muted-foreground text-xs uppercase">
                  {activeTabMeta.label}
                </span>
                <p className="mt-0.5 text-muted-foreground text-sm">
                  {activeTabMeta.description}
                </p>
              </div>
              {isLoading ? (
                <Loader2
                  aria-label="Refreshing GitHub repositories"
                  className="shrink-0 animate-spin text-primary"
                  size={18}
                />
              ) : null}
            </div>

            <div className="grid min-h-0 flex-1 grid-rows-3 divide-y divide-foreground/10 overflow-hidden">
              {visibleRepositories.map((repository, index) => {
                const signal = getRepositorySignal(repository, activeTab);
                const SignalIcon = signal.icon;
                const avatarUrl = getRepositoryAvatarUrl(repository);

                return (
                  <a
                    className="grid min-h-0 grid-cols-[3rem_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-background"
                    href={repository.html_url}
                    key={repository.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="font-anton text-4xl text-primary leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center overflow-hidden border border-foreground/10 bg-background">
                          {avatarUrl ? (
                            <Image
                              alt=""
                              className="size-full object-cover"
                              height={32}
                              sizes="32px"
                              src={avatarUrl}
                              width={32}
                            />
                          ) : (
                            <GitFork className="text-primary" size={16} />
                          )}
                        </span>
                        <span className="min-w-0 truncate font-anton text-2xl leading-none">
                          {repository.full_name}
                        </span>
                      </span>
                      <span className="mt-2 line-clamp-2 text-muted-foreground text-sm leading-snug">
                        {repository.description ?? 'No description provided'}
                      </span>
                    </span>
                    <span className="flex min-w-20 flex-col items-end gap-1 font-anton">
                      <span className="flex items-center gap-2 text-2xl text-primary leading-none">
                        <SignalIcon size={19} />
                        {signal.value}
                      </span>
                      <span className="text-muted-foreground text-xs uppercase">
                        {signal.label}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-muted-foreground text-sm">
        Source: GitHub public Search API.
      </p>
    </div>
  );
};

export const githubRadarDemo = {
  ...githubRadarContent,
  Component: GitHubRadarDemo,
  preload: preloadGitHubRadarDemo,
} satisfies DemoTrack;
