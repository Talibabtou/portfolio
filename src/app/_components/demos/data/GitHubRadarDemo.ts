import { readStorageValue, writeStorageValue } from '@/lib/storage';
import { getIsoDateDaysAgo } from '@/lib/utils';

export type LeaderboardTabId = 'stars' | 'forks' | 'rising';

export type GitHubRepository = {
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

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

export type CachedGitHubLeaderboard = {
  items: GitHubRepository[];
  savedAt: number;
  totalCount: number;
};

const GITHUB_SEARCH_REPOSITORIES_URL =
  'https://api.github.com/search/repositories';
const GITHUB_RADAR_API_PATH = '/api/demos/github-radar';
const GITHUB_LEADERBOARD_CACHE_KEY = 'demos.github-radar.leaderboards';
const GITHUB_LEADERBOARD_CACHE_TTL = 60 * 60 * 1000;
const GITHUB_LEADERBOARD_SERVER_REVALIDATE = 60 * 60;

export const DEFAULT_TAB: LeaderboardTabId = 'rising';
export const RISING_CANDIDATE_COUNT = 50;

const RISING_WINDOW_DAYS = 90;
const githubLeaderboardRequests = new Map<
  LeaderboardTabId,
  Promise<CachedGitHubLeaderboard>
>();

const getRisingSearchDate = () => getIsoDateDaysAgo(RISING_WINDOW_DAYS);

const getAvatarUrl = (avatarUrl: string) => {
  const url = new URL(avatarUrl);
  url.searchParams.set('s', '64');

  return url.toString();
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

export const isGitHubLeaderboardFresh = (cache: CachedGitHubLeaderboard) =>
  Date.now() - cache.savedAt < GITHUB_LEADERBOARD_CACHE_TTL;

export const getGitHubLeaderboardCache = (
  tabId: LeaderboardTabId,
  options: { allowStale?: boolean } = {},
) => {
  const leaderboardCache =
    readStorageValue<
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
      readStorageValue<
        Partial<Record<LeaderboardTabId, CachedGitHubLeaderboard>>
      >('session', GITHUB_LEADERBOARD_CACHE_KEY) ?? {};

    writeStorageValue('session', GITHUB_LEADERBOARD_CACHE_KEY, {
      ...leaderboardCache,
      [tabId]: cache,
    });
  } catch {}
};

export const fetchGitHubLeaderboard = (tabId: LeaderboardTabId) => {
  const cachedLeaderboard = getGitHubLeaderboardCache(tabId);
  if (cachedLeaderboard) {
    return Promise.resolve(cachedLeaderboard);
  }

  const pendingRequest = githubLeaderboardRequests.get(tabId);
  if (pendingRequest) return pendingRequest;

  const isBrowser = typeof window !== 'undefined';
  const searchUrl = new URL(
    isBrowser ? GITHUB_RADAR_API_PATH : GITHUB_SEARCH_REPOSITORIES_URL,
    isBrowser ? window.location.origin : undefined,
  );

  if (isBrowser) {
    searchUrl.searchParams.set('tab', tabId);
  } else {
    searchUrl.search = getGitHubSearchParams(tabId).toString();
  }

  const fetchOptions: NextFetchInit = {
    headers: {
      Accept: 'application/vnd.github+json',
    },
    next: isBrowser
      ? undefined
      : {
          revalidate: GITHUB_LEADERBOARD_SERVER_REVALIDATE,
          tags: [`demo:github-radar:${tabId}`],
        },
  };

  const request = fetch(searchUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}`);
      }

      return response.json() as Promise<
        GitHubSearchResponse | CachedGitHubLeaderboard
      >;
    })
    .then((data) => {
      if ('savedAt' in data) {
        setGitHubLeaderboardCache(tabId, data);
        return data;
      }

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

export const preloadGitHubRadarDemo = async () => {
  if (typeof window === 'undefined') return;

  try {
    await fetchGitHubLeaderboard(DEFAULT_TAB);
  } catch {}
};

export const getRepositoryStarsPerDay = (repository: GitHubRepository) => {
  const repositoryAge = Math.max(
    1,
    (Date.now() - new Date(repository.created_at).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return repository.stargazers_count / repositoryAge;
};

export const getRepositoryAvatarUrl = (repository: GitHubRepository) =>
  repository.owner.avatar_url
    ? getAvatarUrl(repository.owner.avatar_url)
    : undefined;
