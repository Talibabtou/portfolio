import { SOCIAL_LINKS } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { ReactNode, SVGProps } from 'react';

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
};

type SocialIconProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

const GitHubIcon = (props: SocialIconProps) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M12 .3A12 12 0 0 0 8.2 23.7c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
  </svg>
);

const LinkedInIcon = (props: SocialIconProps) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1a3.7 3.7 0 0 1 3.3-1.8c3.6 0 4.2 2.3 4.2 5.4v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13H3.5V9h3.6v11.4ZM22.2 0H1.8C.8 0 0 .8 0 1.8v20.4c0 1 .8 1.8 1.8 1.8h20.4c1 0 1.8-.8 1.8-1.8V1.8c0-1-.8-1.8-1.8-1.8Z" />
  </svg>
);

const XSocialIcon = (props: SocialIconProps) => (
  <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M18.9 1.2h3.7l-8.1 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.2H4.4l13.2 17.5Z" />
  </svg>
);

const SOCIAL_META: Record<
  (typeof SOCIAL_LINKS)[number]['name'],
  {
    Icon?: (props: SocialIconProps) => ReactNode;
    label: string;
    text?: string;
  }
> = {
  cv: {
    label: 'CV',
    text: 'CV',
  },
  github: {
    Icon: GitHubIcon,
    label: 'GitHub',
  },
  linkedin: {
    Icon: LinkedInIcon,
    label: 'LinkedIn',
  },
  x: {
    Icon: XSocialIcon,
    label: 'X',
  },
};

const SocialLinks = ({ className, linkClassName }: SocialLinksProps) => (
  <div className={cn('flex flex-wrap items-center gap-2', className)}>
    {SOCIAL_LINKS.map((link) => {
      const social = SOCIAL_META[link.name];
      const isExternal = link.url.startsWith('http');
      const Icon = social.Icon;

      return (
        <a
          aria-label={social.label}
          className={cn(
            'inline-flex size-10 items-center justify-center rounded-md border border-foreground/10 text-foreground transition-colors hover:border-primary/60 hover:text-primary',
            linkClassName,
          )}
          href={link.url}
          key={link.name}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          target={isExternal ? '_blank' : undefined}
          title={social.label}
        >
          {Icon ? (
            <Icon className="size-5" />
          ) : (
            <span className="font-anton text-sm leading-none tracking-wide">
              {social.text}
            </span>
          )}
        </a>
      );
    })}
  </div>
);

export default SocialLinks;
