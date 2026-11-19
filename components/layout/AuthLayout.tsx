import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/data/site';
import SiteFooter from './SiteFooter';

interface AuthLayoutProps {
  leftContent: React.ReactNode;
  topLinks: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthLayout({
  leftContent,
  topLinks,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#212529]">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Brand Panel */}
        <div className="lg:w-[46%] bg-[#2a1b63] text-white flex flex-col justify-between p-8 sm:p-10 lg:p-14">
          <Link href="/" className="inline-flex flex-col items-start w-fit leading-none">
            <img
              src="/footer_logo.png"
              alt={SITE_CONFIG.fullName}
              className="h-10 w-auto object-contain"
            />
            <span className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-[#d6be8a] font-semibold">
              {SITE_CONFIG.subtitle}
            </span>
          </Link>

          <div className="my-10 lg:my-0 w-full max-w-md mx-auto">{leftContent}</div>

          <p className="hidden lg:block text-xs text-white/65">{SITE_CONFIG.tagline}</p>
        </div>

        {/* Right Form Panel */}
        <div className="lg:w-[54%] flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-10 text-sm">{topLinks}</div>
            {children}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
