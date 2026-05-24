import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

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
