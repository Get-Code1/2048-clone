import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '2048',
  description: 'A distinct, dark-mode-friendly take on the classic 2048 puzzle.',
};

export const viewport = {
  themeColor: '#0f0a2e',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
