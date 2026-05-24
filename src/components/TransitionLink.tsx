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

  const handleLinkClick = contextSafe((e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;
    if (!back && !href) return;

    e.preventDefault();

    gsap.set(PAGE_TRANSITION_SELECTOR, { autoAlpha: 1, yPercent: 100 });
    gsap.set(PAGE_TRANSITION_INNER_SELECTOR, { yPercent: 100 });

    gsap
      .timeline()
      .to(PAGE_TRANSITION_SELECTOR, {
        yPercent: 0,
        duration: 0.28,
        ease: 'power2.out',
      })
      .to(
        PAGE_TRANSITION_INNER_SELECTOR,
        {
          yPercent: 0,
          duration: 0.22,
          ease: 'power2.out',
        },
        '-=0.12',
      )
      .then(() => {
        if (back) {
          router.back();
        } else if (href) {
          router.push(href.toString());
        }
      });
  });

  return (
    <Link href={href} {...rest} onClick={handleLinkClick}>
      {children}
    </Link>
  );
};

export default TransitionLink;
