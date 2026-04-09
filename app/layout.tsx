// app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Figtree } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import SmoothScrolling from '@/components/SmoothScrolling';

const figtree = Figtree({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'YES INDIA Alumni Management',
  description: 'Manage YES INDIA alumni registrations',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get nonce from proxy headers
  const headersList = await headers();
  const nonce = headersList.get('X-Nonce') || '';

  return (
    <html lang="en" className={`${figtree.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Inject nonce into meta tag for client-side access */}
        <meta property="csp-nonce" content={nonce} />
      </head>
      <body className="font-sans font-[400] antialiased">
        <SmoothScrolling>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}