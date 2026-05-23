'use client';
import { gsap, useGSAP } from '@/lib/gsap';
import {
  PAGE_TRANSITION_INNER_SELECTOR,
  PAGE_TRANSITION_SELECTOR,
} from '@/lib/page-transition';
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

  const { contextSafe } = useGSAP(() => {});

  const handleLinkClick = contextSafe(
    async (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      gsap.set(PAGE_TRANSITION_SELECTOR, { yPercent: 100 });
      gsap.set(PAGE_TRANSITION_INNER_SELECTOR, { yPercent: 100 });

      const tl = gsap.timeline();

      tl.to(PAGE_TRANSITION_SELECTOR, {
        yPercent: 0,
        duration: 0.3,
      });

      tl.then(() => {
        if (back) {
          router.back();
        } else if (href) {
          router.push(href.toString());
        } else if (onClick) {
          onClick(e);
        }
      });
    },
  );

  return (
    <Link href={href} {...rest} onClick={handleLinkClick}>
      {children}
    </Link>
  );
};

export default TransitionLink;
