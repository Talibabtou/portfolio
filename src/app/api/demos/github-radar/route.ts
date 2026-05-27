import {
  DEFAULT_TAB,
  fetchGitHubLeaderboard,
  type LeaderboardTabId,
} from '@/app/_components/demos/data/GitHubRadarDemo';

export const revalidate = 3600;

const isLeaderboardTab = (value: string | null): value is LeaderboardTabId =>
  value === 'stars' || value === 'forks' || value === 'rising';

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const tab = url.searchParams.get('tab');
  const leaderboard = await fetchGitHubLeaderboard(
    isLeaderboardTab(tab) ? tab : DEFAULT_TAB,
  );

  return Response.json(leaderboard);
};
