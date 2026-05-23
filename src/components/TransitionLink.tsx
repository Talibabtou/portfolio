'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

interface Props extends ComponentProps<typeof Link> {
  back?: boolean;
}

const TransitionLink = ({
  href,
  onClick,
  children,
  back = false,
  ...rest
}: Props) => {
  const router = useRouter();

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (!back || e.defaultPrevented) return;

    e.preventDefault();
    router.back();
  };

  return (
    <Link href={href} {...rest} onClick={handleLinkClick}>
      {children}
    </Link>
  );
};

export default TransitionLink;
