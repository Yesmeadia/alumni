// app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YES INDIA Alumni Management',
  description: 'Manage YES INDIA alumni registrations',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get nonce from middleware headers
  const headersList = await headers();
  const nonce = headersList.get('X-Nonce') || '';

  return (
    <html lang="en">
      <head>
        {/* Inject nonce into meta tag for client-side access */}
        <meta property="csp-nonce" content={nonce} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}