type GitHubRepoStats = {
  forks_count: number;
  stargazers_count: number;
};

export const revalidate = 3600;

export const GET = async () => {
  const response = await fetch(
    'https://api.github.com/repos/Talibabtou/portfolio',
    {
      headers: {
        Accept: 'application/vnd.github+json',
      },
      next: {
        revalidate,
        tags: ['github:repo-stats'],
      },
    },
  );

  if (!response.ok) {
    return Response.json(
      { forks_count: 0, stargazers_count: 0 } satisfies GitHubRepoStats,
      { status: 200 },
    );
  }

  const stats = (await response.json()) as GitHubRepoStats;

  return Response.json({
    forks_count: stats.forks_count,
    stargazers_count: stats.stargazers_count,
  } satisfies GitHubRepoStats);
};
