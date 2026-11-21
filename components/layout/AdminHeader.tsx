'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

interface AdminHeaderProps {
  onOpenMobileNav: () => void;
}

export default function AdminHeader({ onOpenMobileNav }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'Authorized User');

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    if (pathname.startsWith('/dashboard/registrations')) return 'Registrations';
    if (pathname.startsWith('/dashboard/institutions')) return 'Institutions';
    if (pathname.startsWith('/dashboard/employers')) return 'Employers';
    if (pathname.startsWith('/dashboard/job-applications')) return 'Job Applications';
    if (pathname.startsWith('/dashboard/reports')) return 'Reports & Export';
    if (pathname === '/profile') return 'Account Settings';
    if (pathname.includes('/edit')) return 'Edit Alumni';
    if (pathname.includes('/id-card')) return 'Alumni ID Card';
    if (pathname.includes('/pdf')) return 'Alumni Profile PDF';
    if (pathname.startsWith('/alumni')) return 'Alumni Profile';
    return 'Admin';
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8 print:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="lg:hidden p-2 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
        >
          <Icon name="menu" className="text-[22px]" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#8A8F98] hidden sm:inline">Admin</span>
          <span className="text-[#8A8F98] hidden sm:inline">/</span>
          <span className="text-[#1D1E20] text-base">{getPageTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-[#E5E7EB] text-[#5F6368] hover:text-[#2a1b63] hover:bg-[#F3F0FA] hover:border-[#DDD6F3]"
          >
            <Icon name="open_in_new" className="text-[15px] mr-1.5" />
            Public Portal
          </Button>
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#F3F0FA] transition-colors cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F0FA] text-[#2a1b63] text-sm border border-[#DDD6F3]">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs text-[#1D1E20] leading-tight truncate max-w-[140px] capitalize">
                {displayName}
              </p>
              <p className="text-[11px] text-[#8A8F98] leading-tight">Administrator</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-[#E5E7EB]">
                <p className="text-xs text-[#8A8F98]">Signed in as</p>
                <p className="text-sm text-[#1D1E20] truncate">
                  {user?.email || 'Administrator'}
                </p>
                <span className="mt-1 inline-block bg-[#F3F0FA] text-[#2a1b63] text-[10px] px-2 py-0.5 rounded-full uppercase">
                  Admin
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63] rounded-xl"
                >
                  <Icon name="person" className="text-[18px]" />
                  Account &amp; Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#DC2626] hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <Icon name="logout" className="text-[18px]" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
