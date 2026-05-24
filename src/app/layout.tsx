import type { Metadata } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';

import StickyEmail from '@/app/_components/StickyEmail';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import LenisProvider from '@/components/LenisProvider';
import Navbar from '@/components/Navbar';
import PageTransitionOverlay from '@/components/PageTransitionOverlay';
import Preloader from '@/components/Preloader';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import TopographicBackground from '@/components/TopographicBackground';
import { STORAGE_KEYS, THEME_CLASS, THEME_VALUES } from '@/lib/constants';
import 'lenis/dist/lenis.css';
import './globals.css';

const antonFont = Anton({
  weight: '400',
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-anton',
});

const robotoFlex = Roboto_Flex({
  weight: ['100', '400', '500', '600', '700', '800'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-roboto-flex',
});

export const metadata: Metadata = {
  title: 'Portfolio - Talibabtou',
  description:
    'Frontend developer focused on Web3, fintech, trading, prediction markets, wallet-aware UX and product interfaces.',
};

const themeInitScript = `
(() => {
  try {
    const storedState = window.localStorage.getItem('${STORAGE_KEYS.localState}');
    const parsedState = storedState ? JSON.parse(storedState) : undefined;
    const storedPreferences = parsedState?.values?.userPreferences;
    const legacyPreferences = window.localStorage.getItem('${STORAGE_KEYS.legacyUserPreferences}');
    const theme = storedPreferences?.theme ?? (legacyPreferences ? JSON.parse(legacyPreferences).theme : '${THEME_VALUES.dark}');

    document.documentElement.classList.toggle('${THEME_CLASS}', theme !== '${THEME_VALUES.light}');
  } catch {
    document.documentElement.classList.add('${THEME_CLASS}');
  }
})();
`;

const historyRestoreScript = `
(() => {
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) {
      document.documentElement.style.visibility = 'hidden';
    }
  });

  window.addEventListener('pageshow', (event) => {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const isHistoryRestore =
      event.persisted || navigationEntry?.type === 'back_forward';

    if (!isHistoryRestore) {
      document.documentElement.style.visibility = '';
      return;
    }

    if (isHistoryRestore) {
      window.location.reload();
    }
  });
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={THEME_CLASS} lang="en" suppressHydrationWarning>
      <body
        className={`${antonFont.variable} ${robotoFlex.variable} antialiased`}
      >
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Must run before client hydration to apply the saved theme class.
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
          id="theme-init"
        />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Must run before hydration so browser history restores fall back to a clean reload.
          dangerouslySetInnerHTML={{ __html: historyRestoreScript }}
          id="history-restore"
        />
        <LenisProvider>
          <div className="custom-cursor-scope relative z-1">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <StickyEmail />
            <ScrollToTopButton />
          </div>

          <CustomCursor />
          <PageTransitionOverlay />
          <Preloader />
          <ScrollProgressIndicator />
          <TopographicBackground />
        </LenisProvider>
      </body>
    </html>
  );
}
