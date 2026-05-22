'use client';

import { cn } from '@/lib/utils';
import { Flame, GitFork, Loader2, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { DemoTrack } from '@/app/_components/demos/types';
import {
  readPortfolioStorageValue,
  writePortfolioStorageValue,
} from '@/lib/user-preferences';

type LeaderboardTabId = 'stars' | 'forks' | 'rising';

type GitHubRepository = {
  created_at: string;
  description: string | null;
  forks_count: number;
  full_name: string;
  html_url: string;
  id: number;
  language: string | null;
  open_issues_count: number;
  owner: {
    avatar_url?: string;
    login: string;
  };
  stargazers_count: number;
  topics?: string[];
  updated_at: string;
};

type GitHubSearchResponse = {
  items: GitHubRepository[];
  total_count: number;
};

type CachedGitHubLeaderboard = {
  items: GitHubRepository[];
  savedAt: number;
  totalCount: number;
};

const GITHUB_SEARCH_REPOSITORIES_URL =
  'https://api.github.com/search/repositories';
const GITHUB_LEADERBOARD_CACHE_KEY = 'demos.github-radar.leaderboards';
const GITHUB_AVATAR_CACHE_KEY = 'demos.github-radar.avatars';
const GITHUB_LEADERBOARD_CACHE_TTL = 30 * 60 * 1000;
const DEFAULT_TAB: LeaderboardTabId = 'rising';
const RISING_CANDIDATE_COUNT = 50;
const RISING_WINDOW_DAYS = 90;
const githubLeaderboardRequests = new Map<
  LeaderboardTabId,
  Promise<CachedGitHubLeaderboard>
>();
const githubAvatarRequests = new Map<string, Promise<string>>();

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

const getRisingSearchDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - RISING_WINDOW_DAYS);

  return date.toISOString().slice(0, 10);
};

const getAvatarUrl = (avatarUrl: string) => {
  const url = new URL(avatarUrl);
  url.searchParams.set('s', '64');

  return url.toString();
};

const readBlobAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('error', () => reject(reader.error));
    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.readAsDataURL(blob);
  });

const getCachedAvatarDataUrl = (avatarUrl: string) => {
  return readPortfolioStorageValue<Record<string, string>>(
    'session',
    GITHUB_AVATAR_CACHE_KEY,
  )?.[avatarUrl];
};

const setCachedAvatarDataUrl = (avatarUrl: string, dataUrl: string) => {
  try {
    const avatarCache =
      readPortfolioStorageValue<Record<string, string>>(
        'session',
        GITHUB_AVATAR_CACHE_KEY,
      ) ?? {};

    writePortfolioStorageValue('session', GITHUB_AVATAR_CACHE_KEY, {
      ...avatarCache,
      [avatarUrl]: dataUrl,
    });
  } catch {
    // Avatars are decorative; keep the remote URL fallback if storage is full.
  }
};

const fetchCachedAvatarDataUrl = (avatarUrl: string) => {
  const cachedAvatar = getCachedAvatarDataUrl(avatarUrl);
  if (cachedAvatar) return Promise.resolve(cachedAvatar);

  const pendingRequest = githubAvatarRequests.get(avatarUrl);
  if (pendingRequest) return pendingRequest;

  const request = fetch(avatarUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub avatar returned ${response.status}`);
      }

      return response.blob();
    })
    .then(readBlobAsDataUrl)
    .then((dataUrl) => {
      setCachedAvatarDataUrl(avatarUrl, dataUrl);

      return dataUrl;
    })
    .finally(() => {
      githubAvatarRequests.delete(avatarUrl);
    });

  githubAvatarRequests.set(avatarUrl, request);

  return request;
};

const getGitHubSearchParams = (tabId: LeaderboardTabId) => {
  const params = new URLSearchParams({
    order: 'desc',
    per_page: tabId === 'rising' ? String(RISING_CANDIDATE_COUNT) : '3',
  });

  if (tabId === 'stars') {
    params.set('q', 'stars:>50000 fork:false archived:false');
    params.set('sort', 'stars');
  }

  if (tabId === 'forks') {
    params.set('q', 'forks:>10000 fork:false archived:false');
    params.set('sort', 'forks');
  }

  if (tabId === 'rising') {
    params.set(
      'q',
      `created:>=${getRisingSearchDate()} stars:>100 fork:false archived:false`,
    );
    params.set('sort', 'stars');
  }

  return params;
};

const isGitHubLeaderboardFresh = (cache: CachedGitHubLeaderboard) =>
  Date.now() - cache.savedAt < GITHUB_LEADERBOARD_CACHE_TTL;

const getGitHubLeaderboardCache = (
  tabId: LeaderboardTabId,
  options: { allowStale?: boolean } = {},
) => {
  const leaderboardCache =
    readPortfolioStorageValue<
      Partial<Record<LeaderboardTabId, CachedGitHubLeaderboard>>
    >('session', GITHUB_LEADERBOARD_CACHE_KEY) ?? {};
  const cache = leaderboardCache[tabId];
  if (!cache || cache.items.length === 0) return undefined;

  return options.allowStale || isGitHubLeaderboardFresh(cache)
    ? cache
    : undefined;
};

const setGitHubLeaderboardCache = (
  tabId: LeaderboardTabId,
  cache: CachedGitHubLeaderboard,
) => {
  try {
    const leaderboardCache =
      readPortfolioStorageValue<
        Partial<Record<LeaderboardTabId, CachedGitHubLeaderboard>>
      >('session', GITHUB_LEADERBOARD_CACHE_KEY) ?? {};

    writePortfolioStorageValue('session', GITHUB_LEADERBOARD_CACHE_KEY, {
      ...leaderboardCache,
      [tabId]: cache,
    });
  } catch {
    // Session storage avoids repeated unauthenticated GitHub Search API calls.
  }
};

const fetchGitHubLeaderboard = (tabId: LeaderboardTabId) => {
  const cachedLeaderboard = getGitHubLeaderboardCache(tabId);
  if (cachedLeaderboard) {
    return Promise.resolve(cachedLeaderboard);
  }

  const pendingRequest = githubLeaderboardRequests.get(tabId);
  if (pendingRequest) return pendingRequest;

  const searchUrl = new URL(GITHUB_SEARCH_REPOSITORIES_URL);
  searchUrl.search = getGitHubSearchParams(tabId).toString();

  const request = fetch(searchUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}`);
      }

      return response.json() as Promise<GitHubSearchResponse>;
    })
    .then((data) => {
      const leaderboard = {
        items: data.items,
        savedAt: Date.now(),
        totalCount: data.total_count,
      } satisfies CachedGitHubLeaderboard;

      setGitHubLeaderboardCache(tabId, leaderboard);

      return leaderboard;
    })
    .finally(() => {
      githubLeaderboardRequests.delete(tabId);
    });

  githubLeaderboardRequests.set(tabId, request);

  return request;
};

const preloadGitHubRadarDemo = () => {
  if (typeof window === 'undefined') return;

  void fetchGitHubLeaderboard(DEFAULT_TAB).catch(() => {
    // Preloading is opportunistic; the mounted demo renders the recoverable error.
  });
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

const getRepositoryStarsPerDay = (repository: GitHubRepository) => {
  const repositoryAge = Math.max(
    1,
    (Date.now() - new Date(repository.created_at).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return repository.stargazers_count / repositoryAge;
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

const getRepositoryAvatarUrl = (repository: GitHubRepository) =>
  repository.owner.avatar_url
    ? getAvatarUrl(repository.owner.avatar_url)
    : undefined;

const getRepositoryAvatarSource = (
  avatarUrl: string,
  avatarDataUrls: Record<string, string>,
) => avatarDataUrls[avatarUrl] ?? getCachedAvatarDataUrl(avatarUrl);

const GitHubRadarDemo = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTabId>(DEFAULT_TAB);
  const [avatarDataUrls, setAvatarDataUrls] = useState<Record<string, string>>(
    {},
  );
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

  useEffect(() => {
    const avatarUrls = Array.from(
      new Set(
        visibleRepositories
          .map(getRepositoryAvatarUrl)
          .filter((avatarUrl): avatarUrl is string => Boolean(avatarUrl)),
      ),
    );

    const missingAvatarUrls = avatarUrls.filter((avatarUrl) => {
      if (avatarDataUrls[avatarUrl]) return false;

      const cachedAvatar = getCachedAvatarDataUrl(avatarUrl);
      if (cachedAvatar) {
        queueMicrotask(() => {
          setAvatarDataUrls((currentAvatarDataUrls) => ({
            ...currentAvatarDataUrls,
            [avatarUrl]: cachedAvatar,
          }));
        });

        return false;
      }

      return true;
    });

    if (missingAvatarUrls.length === 0) return;

    let ignoreRequest = false;

    for (const avatarUrl of missingAvatarUrls) {
      void fetchCachedAvatarDataUrl(avatarUrl)
        .then((dataUrl) => {
          if (ignoreRequest) return;

          setAvatarDataUrls((currentAvatarDataUrls) => ({
            ...currentAvatarDataUrls,
            [avatarUrl]: dataUrl,
          }));
        })
        .catch(() => {
          // Keep the remote GitHub avatar fallback.
        });
    }

    return () => {
      ignoreRequest = true;
    };
  }, [avatarDataUrls, visibleRepositories]);

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
                const avatarSource = avatarUrl
                  ? getRepositoryAvatarSource(avatarUrl, avatarDataUrls)
                  : undefined;

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
                          {avatarSource ? (
                            <Image
                              alt=""
                              className="size-full object-cover"
                              height={32}
                              src={avatarSource}
                              unoptimized
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
        Source: GitHub public Search API. Results cached in session storage.
      </p>
    </div>
  );
};

export const githubRadarDemo = {
  ...githubRadarContent,
  Component: GitHubRadarDemo,
  preload: preloadGitHubRadarDemo,
} satisfies DemoTrack;
