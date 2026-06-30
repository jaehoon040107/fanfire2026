import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FANFIRE — Where the World Watches the Cup',
  description:
    'The global fan hub for the 2026 World Cup. Predict matches, react live, and feel the heat of fans from every country. ESPN gives you info — FANFIRE gives you the experience.',
  keywords: ['World Cup 2026', 'football', 'soccer', 'predictions', 'live', 'fan community'],
  openGraph: {
    title: 'FANFIRE — Where the World Watches the Cup',
    description: 'Predict. React. Feel the heat. The global fan hub for the 2026 World Cup.',
    type: 'website',
    siteName: 'FANFIRE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FANFIRE — 2026 World Cup Fan Hub',
    description: 'Predict. React. Feel the heat.',
  },
  metadataBase: new URL('https://fanfire2026.com'),
};

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
