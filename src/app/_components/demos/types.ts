import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export type DemoTrack = {
  Component: ComponentType;
  detail: string;
  eyebrow: string;
  icon: LucideIcon;
  id: string;
  label: string;
  metrics: string[];
  preload?: () => void;
  title: string;
};
