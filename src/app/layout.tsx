import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import StickyEmail from '@/app/_components/StickyEmail';
import ClientVisualEffects from '@/components/ClientVisualEffects';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import PageTransitionOverlay from '@/components/PageTransitionOverlay';
import { THEME_CLASS } from '@/lib/constants';
import './globals.css';

const antonFont = localFont({
  src: '../../public/fonts/Anton-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-anton',
});

const robotoFlex = localFont({
  preload: false,
  src: '../../public/fonts/RobotoFlex-VariableFont_GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf',
  weight: '100 800',
  style: 'normal',
  variable: '--font-roboto-flex',
});

export const metadata: Metadata = {
  title: 'Portfolio - Talibabtou',
  description:
    'Frontend developer focused on Web3, fintech, trading, prediction markets, wallet-aware UX and product interfaces.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={THEME_CLASS} lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${antonFont.variable} ${robotoFlex.variable} ${robotoFlex.className} antialiased`}
      >
        <div className="custom-cursor-scope relative z-1">
          <Navbar />
          <main>{children}</main>
          <Footer />
          <StickyEmail />
        </div>

        <PageTransitionOverlay />
        <ClientVisualEffects />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
