import type { Metadata } from 'next';
import Script from 'next/script';

import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import FloatingQuizButton from '@/components/FloatingQuizButton';
import './globals.css';
import QueryWrapper from '@/components/wrapper/QueryWrapper';
import { Suspense } from 'react';
import ElectionLivePopover from '@/components/ElectionLivePopover';
import ElectionDashboardOverlay from '@/components/ElectionLivePopover';
import { usePartyResults } from '@/core/hooks/projection/useElectionProjection';
import FloatingPredictionButton from '@/components/FloatingPredictionButton';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'नेपाल निर्वाचन पोर्टल | Nepal Election Portal',
  description:
    'नेपालको निर्वाचन, उम्मेदवार, घोषणापत्र, र मतदान विवरणको बारेमा विस्तृत जानकारी। तपाईंको भरपर्दो निर्वाचन जानकारी स्रोत।',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  other: {
    'google-adsense-account': `${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`,
    'Content-Language': 'ne',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <head>
        {/* AdSense script for verification and auto ads */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot="9830209083"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        <Script strategy="afterInteractive">
          {`
              window.atOptions = {
                'key' : 'd563f7b0681f5c24778e1ad9a2ebb17d',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
            `}
        </Script>
        <Script
          src="https://www.highperformanceformat.com/d563f7b0681f5c24778e1ad9a2ebb17d/invoke.js"
          strategy="afterInteractive"
        />
        <QueryWrapper>
          <Suspense>{children}</Suspense>
          <Script
            async
            data-cfasync="false"
            src="https://pl28833242.effectivegatecpm.com/3da129c742e7fa7952459c2f67d17583/invoke.js"
          ></Script>
          <div id="container-3da129c742e7fa7952459c2f67d17583"></div>
        </QueryWrapper>
        <FloatingQuizButton />
        <Analytics />
        {/* <SpeedInsights /> */}
        <Script src="https://pl28833246.effectivegatecpm.com/19/73/c0/1973c0d180dc2b83b494d9e32d9a1c6c.js"></Script>
      </body>
    </html>
  );
}
