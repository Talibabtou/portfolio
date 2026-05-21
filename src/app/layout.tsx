import type { Metadata } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';
import Script from 'next/script';

import StickyEmail from '@/app/_components/StickyEmail';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import LenisProvider from '@/components/LenisProvider';
import Navbar from '@/components/Navbar';
import Preloader from '@/components/Preloader';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
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
    const storedPreferences = window.localStorage.getItem('${STORAGE_KEYS.userPreferences}');
    const theme = storedPreferences ? JSON.parse(storedPreferences).theme : '${THEME_VALUES.dark}';

    document.documentElement.classList.toggle('${THEME_CLASS}', theme !== '${THEME_VALUES.light}');
  } catch {
    document.documentElement.classList.add('${THEME_CLASS}');
  }
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
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <LenisProvider>
          <div className="custom-cursor-scope relative z-1">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <StickyEmail />
          </div>

          <CustomCursor />
          <Preloader />
          <ScrollProgressIndicator />
          <TopographicBackground />
        </LenisProvider>
      </body>
    </html>
  );
}
