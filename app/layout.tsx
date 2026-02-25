import type { Metadata } from 'next';
import Script from 'next/script';

import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import FloatingQuizButton from '@/components/FloatingQuizButton';
import './globals.css';

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
          src={`src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <FloatingQuizButton />
        <Analytics />
      </body>
    </html>
  );
}
