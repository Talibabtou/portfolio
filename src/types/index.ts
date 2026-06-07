import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | 'no-color';

export type ThemePreference = 'dark' | 'light';

export type UserPreferences = {
  theme: ThemePreference;
};

export type DemoComponentProps = {
  isActive?: boolean;
};

export type DemoTrack = {
  Component: ComponentType<DemoComponentProps>;
  detail: string;
  eyebrow: string;
  icon: LucideIcon;
  id: string;
  keepMountedWhenInactive?: boolean;
  label: string;
  metrics: string[];
  preload?: () => void;
  title: string;
};

export interface IProject {
  title: string;
  year: number;
  summary?: string;
  description: string[];
  role: string[];
  context?: string[];
  problem?: string[];
  contributions?: string[];
  decisions?: string[];
  results?: string[];
  techStack: string[];
  thumbnail: string;
  thumbnailHeight?: number;
  thumbnailWidth?: number;
  images: string[];
  slug: string;
  liveUrl?: string;
  sourceCode?: string;
}
