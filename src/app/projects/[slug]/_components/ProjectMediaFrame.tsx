import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

type ProjectMediaFrameProps = {
  children: ReactNode;
  className?: string;
};

export const projectMediaControlClassName =
  'inline-flex h-11 w-11 items-center justify-center bg-background-light text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export const ProjectMediaFrame = ({
  children,
  className,
}: ProjectMediaFrameProps) => (
  <div
    className={cn(
      'project-media-frame group relative w-full overflow-hidden bg-background-light',
      className,
    )}
  >
    {children}
  </div>
);

type ProjectMediaOpenButtonProps = {
  href: string;
  label: string;
  variant?: 'overlay' | 'control';
};

export const ProjectMediaOpenButton = ({
  href,
  label,
  variant = 'control',
}: ProjectMediaOpenButtonProps) => (
  <a
    aria-label={label}
    className={
      variant === 'overlay'
        ? 'absolute top-4 right-4 inline-flex size-12 items-center justify-center bg-background/70 text-foreground opacity-0 transition-all hover:bg-primary hover:text-primary-foreground group-hover:opacity-100'
        : projectMediaControlClassName
    }
    href={href}
    rel="noopener"
    target="_blank"
  >
    <ExternalLink aria-hidden="true" className="pointer-events-none size-5" />
  </a>
);
