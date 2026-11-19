import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#212529] selection:bg-[#2a1b63] selection:text-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
