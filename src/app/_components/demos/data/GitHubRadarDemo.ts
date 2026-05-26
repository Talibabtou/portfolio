import { readStorageValue, writeStorageValue } from '@/lib/storage';

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

export type CachedGitHubLeaderboard = {
  items: GitHubRepository[];
  savedAt: number;
  totalCount: number;
};

const GITHUB_SEARCH_REPOSITORIES_URL =
  'https://api.github.com/search/repositories';
const GITHUB_LEADERBOARD_CACHE_KEY = 'demos.github-radar.leaderboards';
const GITHUB_LEADERBOARD_CACHE_TTL = 60 * 60 * 1000;

export const DEFAULT_TAB: LeaderboardTabId = 'rising';
export const RISING_CANDIDATE_COUNT = 50;

const RISING_WINDOW_DAYS = 90;
const githubLeaderboardRequests = new Map<
  LeaderboardTabId,
  Promise<CachedGitHubLeaderboard>
>();

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
  } catch {
    // Session storage avoids repeated unauthenticated GitHub Search API calls.
  }
};

export const fetchGitHubLeaderboard = (tabId: LeaderboardTabId) => {
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

export const preloadGitHubRadarDemo = async () => {
  if (typeof window === 'undefined') return;

  try {
    await fetchGitHubLeaderboard(DEFAULT_TAB);
  } catch {
    // Preloading is opportunistic; the mounted demo renders the recoverable error.
  }
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
