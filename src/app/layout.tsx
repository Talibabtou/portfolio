import { ReactLenis } from 'lenis/react';
import type { Metadata } from 'next';
import { Anton, Roboto_Flex } from 'next/font/google';

import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import 'lenis/dist/lenis.css';
import Preloader from '@/components/Preloader';
import StickyEmail from '@/app/_components/StickyEmail';
import TopographicBackground from '@/components/TopographicBackground';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${antonFont.variable} ${robotoFlex.variable} antialiased`}
      >
        <ReactLenis
          root
          options={{
            lerp: 0.1,
            duration: 1.4,
          }}
        >
          <div className="custom-cursor-scope">
            <Navbar />
            <main>{children}</main>
            <Footer />
            <StickyEmail />
          </div>

          <CustomCursor />
          <Preloader />
          <ScrollProgressIndicator />
          <TopographicBackground />
        </ReactLenis>
      </body>
    </html>
  );
}
