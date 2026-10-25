import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Malone Team | Gulf Real Estate Group',
  description: 'Luxury real estate website with admin panel for The Malone Team.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
