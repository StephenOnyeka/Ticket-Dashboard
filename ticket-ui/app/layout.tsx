import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SupportDesk — Multi-Channel Ticket Dashboard',
  description:
    'A professional support ticket management dashboard for teams to track, filter, and resolve customer issues across web, email, and messaging channels.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-app">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
