export type Next_Page_Url = string;

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
  images: string[];
  slug: string;
  liveUrl?: string;
  sourceCode?: string;
}
