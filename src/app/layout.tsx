import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Anton, Roboto_Flex } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import StickyEmail from '@/app/_components/StickyEmail';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PageTransitionOverlay from '@/components/PageTransitionOverlay';
import Preloader from '@/components/Preloader';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import TopographicBackground from '@/components/TopographicBackground';
import { THEME_CLASS, THEME_COOKIE_NAME, THEME_VALUES } from '@/lib/constants';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const initialTheme =
    themeCookie === THEME_VALUES.light ? THEME_VALUES.light : THEME_VALUES.dark;

  return (
    <html
      className={initialTheme === THEME_VALUES.dark ? THEME_CLASS : undefined}
      lang="en"
      suppressHydrationWarning
    >
      <head />
      <body
        className={`${antonFont.variable} ${robotoFlex.variable} antialiased`}
      >
        <div className="custom-cursor-scope relative z-1">
          <Navbar initialTheme={initialTheme} />
          <main>{children}</main>
          <Footer />
          <StickyEmail />
          <ScrollProgressIndicator />
        </div>

        <CustomCursor />
        <PageTransitionOverlay />
        <Preloader />
        <TopographicBackground />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
