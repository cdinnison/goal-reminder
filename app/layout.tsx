import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import PostHogProvider from '@/components/providers/PostHogProvider';
import ColorBorder from '@/components/ui/ColorBorder';

const font = GeistSans;

export const metadata: Metadata = {
  title: "Goal Reminder",
  description: "Reach your goals with daily SMS reminders that keep you motivated and accountable.",
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Goal Reminder',
    description: 'Reach your goals with daily SMS reminders that keep you motivated and accountable.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Goal Reminder - Daily SMS motivation',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ColorBorder />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
