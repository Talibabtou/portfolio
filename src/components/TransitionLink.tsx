'use client';
import { gsap, useGSAP } from '@/lib/gsap';
import {
  PAGE_TRANSITION_INNER_SELECTOR,
  PAGE_TRANSITION_SELECTOR,
} from '@/lib/page-transition';
import { navigateToHomeHashUrl } from '@/lib/section-navigation';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

interface Props extends ComponentProps<typeof Link> {
  back?: boolean;
}

const runPageTransition = () => {
  gsap.set(PAGE_TRANSITION_SELECTOR, { autoAlpha: 1, yPercent: 100 });
  gsap.set(PAGE_TRANSITION_INNER_SELECTOR, { yPercent: 100 });

  return gsap
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
    );
};

const TransitionLink = ({
  href,
  onClick,
  children,
  back = false,
  ...rest
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { contextSafe } = useGSAP(() => {});

  const handleLinkClick = contextSafe((e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;
    if (!back && !href) return;

    e.preventDefault();

    runPageTransition().then(() => {
      if (back) {
        router.back();
        return;
      }

      if (href) {
        navigateToHomeHashUrl({
          pathname,
          push: router.push,
          url: href.toString(),
        });
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
