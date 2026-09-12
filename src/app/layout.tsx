import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://life-rpg.vercel.app'),
  title: {
    default: 'Life RPG — Gamified Productivity & Habit Progression',
    template: '%s | Life RPG',
  },
  description:
    'Turn your everyday real-world tasks and habits into an immersive RPG adventure. Earn XP, level up attributes, forge streaks, and conquer your goals.',
  keywords: [
    'gamified productivity',
    'life rpg',
    'habit tracker',
    'level up',
    'task manager',
    'gamification',
    'anti-cheat xp',
  ],
  authors: [{ name: 'Life RPG Team' }],
  openGraph: {
    title: 'Life RPG — Level Up Your Life',
    description: 'Turn your real-world tasks and habits into an epic RPG progression loop.',
    url: 'https://life-rpg.vercel.app',
    siteName: 'Life RPG',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary/30 selection:text-foreground">
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
