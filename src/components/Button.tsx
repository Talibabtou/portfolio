import { cn } from '@/lib/utils';
import type { Variant } from '@/types';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';

interface LoadingIndicatorProps {
  icon?: boolean;
}

const LoadingIndicator = ({ icon }: LoadingIndicatorProps) => (
  <span className="flex items-center justify-center gap-3">
    <svg
      aria-hidden="true"
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    {!icon && 'Processing...'}
  </span>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
  as?: 'link' | 'button';
  loading?: boolean;
  icon?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
  variant?: Variant;
} & (ComponentProps<typeof Link> | ButtonProps);

const Button = ({
  loading,
  variant,
  className,
  children,
  as = 'link',
  icon = false,
  ...rest
}: Props) => {
  const variantClasses = {
    primary: `bg-primary text-primary-foreground hover:bg-primary-hover`,
    secondary: `bg-secondary text-secondary-foreground hover:bg-secondary-hover`,
    success: `bg-green-500 text-white hover:bg-green-600`,
    warning: `bg-orange-500 text-white hover:bg-orange-600`,
    danger: `bg-destructive text-destructive-foreground hover:bg-destructive/70`,
    info: `bg-blue-500 text-white hover:bg-blue-600`,
    light: `bg-background-active text-foreground hover:bg-background-active`,
    dark: `bg-foreground text-background hover:bg-foreground/80`,
    link: `text-foreground hover:text-primary`,
    'no-color': '',
  }[variant || 'primary'];

  const iconClasses = cn(
    'inline-flex aspect-square min-w-9 items-center justify-center rounded-md p-0 text-xl',
    variantClasses,
  );

  const buttonClasses = cn(
    `group relative isolate inline-flex h-12 items-center justify-center gap-2 overflow-hidden px-8 font-anton text-lg uppercase tracking-widest outline-none transition-colors`,
    variantClasses,
    { [iconClasses]: icon },
    className,
  );

  if (as === 'link') {
    const props = rest as ComponentProps<typeof Link>;

    if (props.target === '_blank') {
      return (
        <a
          className={buttonClasses}
          {...props}
          href={props.href.toString() || '#'}
        >
          {variant !== 'link' && (
            <span className="absolute top-[200%] right-0 left-0 h-full scale-150 rounded-[50%] bg-white/20 transition-all duration-500 group-hover:top-0"></span>
          )}
          <span className="z-[1]">
            {loading ? <LoadingIndicator icon={icon} /> : children}
          </span>
        </a>
      );
    }

    return (
      <Link className={buttonClasses} {...props} href={props.href || '#'}>
        {variant !== 'link' && (
          <span className="absolute top-[200%] right-0 left-0 h-full scale-150 rounded-[50%] bg-white/20 transition-all duration-500 group-hover:top-0"></span>
        )}
        <span className="z-[1]">
          {loading ? <LoadingIndicator icon={icon} /> : children}
        </span>
      </Link>
    );
  } else if (as === 'button') {
    const props = rest as ButtonProps;

    return (
      <button className={buttonClasses} type="button" {...props}>
        {variant !== 'link' && (
          <span className="absolute top-[200%] right-0 left-0 h-full scale-150 rounded-[50%] bg-white/20 transition-all duration-500 group-hover:top-0"></span>
        )}
        <span className="z-[1]">
          {loading ? <LoadingIndicator icon={icon} /> : children}
        </span>
      </button>
    );
  }
};

export default Button;
