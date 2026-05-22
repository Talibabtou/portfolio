import { GitFork } from 'lucide-react';
import PlaceholderDemo from '@/app/_components/demos/PlaceholderDemo';
import type { DemoTrack } from '@/app/_components/demos/types';

const githubRadarContent = {
  detail:
    'A recruiter-friendly demo for API integration, ranking, pagination, rate-limit handling and skeleton states.',
  eyebrow: 'Developer signal',
  icon: GitFork,
  id: 'github-radar',
  label: 'GitHub Radar',
  metrics: ['Stars', 'Topics', 'Velocity'],
  title: 'Most-liked repositories from the public GitHub API.',
};

const GitHubRadarDemo = () => <PlaceholderDemo {...githubRadarContent} />;

export const githubRadarDemo = {
  ...githubRadarContent,
  Component: GitHubRadarDemo,
} satisfies DemoTrack;
