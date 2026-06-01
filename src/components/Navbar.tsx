'use client';
import { THEME_CLASS, THEME_VALUES } from '@/lib/constants';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import {
  useThemePreference,
  writeThemePreference,
} from '@/lib/theme-preference';
import {
  getHomeHashUrl,
  getSectionIdFromHomeHash,
  PENDING_SECTION_KEY,
  scrollToSection,
} from '@/lib/section-navigation';
import { cn } from '@/lib/utils';
import { Moon, MoveUpRight, Sun } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { ThemePreference } from '@/types';
import { useEffect, useState } from 'react';

const COLORS = [
  'bg-yellow-500 text-black',
  'bg-blue-500 text-white',
  'bg-teal-500 text-black',
  'bg-indigo-500 text-white',
  'bg-pink-500 text-black',
  'bg-lime-500 text-black',
];

const MENU_LINKS = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'About Me',
    url: '/#about-me',
  },
  {
    name: 'Experience',
    url: '/#my-experience',
  },
  {
    name: 'Stack',
    url: '/#my-stack',
  },
  {
    name: 'Projects',
    url: '/#selected-projects',
  },
  {
    name: 'Demos',
    url: '/#demo-lab',
  },
];

type NavbarProps = {
  initialTheme: ThemePreference;
};

const Navbar = ({ initialTheme }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useThemePreference(initialTheme);
  const isDarkMode = theme === THEME_VALUES.dark;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle(THEME_CLASS, isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (pathname !== '/') return;

    const pendingSectionId = sessionStorage.getItem(PENDING_SECTION_KEY);
    if (!pendingSectionId) return;

    sessionStorage.removeItem(PENDING_SECTION_KEY);
    const frame = requestAnimationFrame(() => {
      scrollToSection(pendingSectionId, 'auto');
      window.history.replaceState(null, '', getHomeHashUrl(pendingSectionId));
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const toggleTheme = () => {
    writeThemePreference({
      theme: isDarkMode ? THEME_VALUES.light : THEME_VALUES.dark,
    });
  };

  const navigateToMenuLink = (url: string) => {
    setIsMenuOpen(false);

    if (url === '/') {
      router.push('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionId = getSectionIdFromHomeHash(url);

    if (!sectionId) {
      router.push(url);
      return;
    }

    if (pathname !== '/') {
      sessionStorage.setItem(PENDING_SECTION_KEY, sectionId);
      router.push('/');
      return;
    }

    window.history.pushState(null, '', getHomeHashUrl(sectionId));
    scrollToSection(sectionId);
  };

  return (
    <>
      <div className="sticky top-0 z-4">
        <button
          aria-label={
            isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className={cn(
            'fixed top-5 z-4 flex size-12 items-center justify-center text-foreground transition-[right,color] duration-700 md:hover:text-primary',
            {
              'right-20 md:right-24': !isMenuOpen,
              'right-[calc(min(clamp(20rem,20vw,26rem),calc(100vw-3rem))-4.25rem)]':
                isMenuOpen,
            },
          )}
          onClick={toggleTheme}
          type="button"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <button
          className={cn('group fixed top-5 right-5 z-4 size-12 md:right-10')}
          type="button"
          aria-label={
            isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={cn(
              'absolute top-1/2 left-1/2 inline-block h-0.5 w-3/5 -translate-x-1/2 -translate-y-1.25 rounded-full bg-foreground duration-300',
              {
                '-translate-y-1/2 rotate-45': isMenuOpen,
                'md:group-hover:rotate-12': !isMenuOpen,
              },
            )}
          ></span>
          <span
            className={cn(
              'absolute top-1/2 left-1/2 inline-block h-0.5 w-3/5 -translate-x-1/2 translate-y-1.25 rounded-full bg-foreground duration-300',
              {
                '-translate-y-1/2 -rotate-45': isMenuOpen,
                'md:group-hover:-rotate-12': !isMenuOpen,
              },
            )}
          ></span>
        </button>
      </div>

      <button
        aria-label="Close navigation menu"
        className={cn(
          'fixed inset-0 z-2 bg-black/70 transition-all duration-150',
          {
            'pointer-events-none invisible opacity-0': !isMenuOpen,
          },
        )}
        onClick={() => setIsMenuOpen(false)}
        type="button"
      ></button>

      <div
        className={cn(
          'fixed top-0 right-0 z-3 h-dvh w-[clamp(20rem,20vw,26rem)] max-w-[calc(100vw-3rem)] translate-x-full transform overflow-hidden transition-transform duration-700',
          'flex flex-col justify-between gap-y-14 py-10',
          { 'translate-x-0': isMenuOpen },
        )}
      >
        <div
          className={cn(
            'fixed inset-0 z-[-1] translate-x-1/2 scale-150 rounded-[50%] bg-background-light delay-150 duration-700 dark:bg-background',
            {
              'translate-x-0': isMenuOpen,
            },
          )}
        ></div>

        <div className="mx-8 w-full max-w-75 pt-12 sm:mx-auto">
          <p className="mb-5 text-muted-foreground md:mb-8">MENU</p>
          <ul className="space-y-3">
            {MENU_LINKS.map((link, idx) => (
              <li key={link.name}>
                <button
                  type="button"
                  onClick={() => navigateToMenuLink(link.url)}
                  className="group flex items-center gap-3 text-xl"
                >
                  <span
                    className={cn(
                      'flex size-3.5 items-center justify-center rounded-full bg-white/20 transition-all group-hover:scale-[200%]',
                      COLORS[idx],
                    )}
                  >
                    <MoveUpRight
                      size={8}
                      className="scale-0 transition-all group-hover:scale-100"
                    />
                  </span>
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-8 w-full max-w-75 space-y-8 sm:mx-auto">
          <div>
            <p className="mb-5 text-muted-foreground md:mb-8">SOCIAL</p>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg capitalize hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-muted-foreground">GET IN TOUCH</p>
            <a href={`mailto:${GENERAL_INFO.email}`}>{GENERAL_INFO.email}</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
