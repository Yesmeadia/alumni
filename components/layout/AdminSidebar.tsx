'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { SITE_CONFIG } from '@/data/site';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps): React.ReactElement {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: 'grid_view',
      active: pathname === '/dashboard',
    },
    {
      href: '/dashboard/registrations',
      label: 'Registrations',
      icon: 'group',
      active:
        pathname.startsWith('/dashboard/registrations') || pathname.startsWith('/alumni'),
    },
    {
      href: '/dashboard/institutions',
      label: 'Institutions',
      icon: 'school',
      active: pathname.startsWith('/dashboard/institutions'),
    },
    {
      href: '/dashboard/employers',
      label: 'Employers',
      icon: 'business_center',
      active: pathname.startsWith('/dashboard/employers'),
    },
    {
      href: '/dashboard/job-applications',
      label: 'Job Applications',
      icon: 'work',
      active: pathname.startsWith('/dashboard/job-applications'),
    },
    {
      href: '/dashboard/reports',
      label: 'Reports & Export',
      icon: 'description',
      active: pathname.startsWith('/dashboard/reports'),
    },
  ];

  const secondaryItems = [
    {
      href: '/register',
      label: 'New Registration',
      icon: 'person_add',
      active: false,
    },
    {
      href: '/profile',
      label: 'Account Settings',
      icon: 'tune',
      active: pathname === '/profile',
    },
  ];

  const renderSidebarBody = (isMobile: boolean) => {
    const showLabels = !collapsed || isMobile;
    return (
      <div className="h-full flex flex-col bg-white border-r border-[#E5E7EB] select-none">
        {/* Brand Header */}
        <div
          className={`flex h-20 items-center border-b border-[#E5E7EB] ${
            showLabels ? 'justify-between px-4' : 'justify-center gap-1 px-2'
          }`}
        >
          <Link
            href="/dashboard"
            onClick={() => isMobile && onCloseMobile()}
            className="flex items-center overflow-hidden"
          >
            {showLabels ? (
              <img
                src="/logo.png"
                alt={SITE_CONFIG.fullName}
                className="h-10 w-auto max-w-[160px] object-contain"
              />
            ) : (
              <img
                src="/icon.png"
                alt={SITE_CONFIG.fullName}
                className="h-9 w-9 shrink-0 object-contain"
              />
            )}
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="p-2 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63] transition-colors"
            >
              <Icon name="close" className="text-[20px]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63] transition-colors"
            >
              <Icon
                name={collapsed ? 'chevron_right' : 'chevron_left'}
                className="text-[16px]"
              />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && onCloseMobile()}
              title={!showLabels ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 ${
                item.active
                  ? 'bg-[#2a1b63] text-white shadow-sm'
                  : 'text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63]'
              }`}
            >
              <Icon name={item.icon} className="text-[20px] shrink-0" />
              {showLabels && <span className="truncate">{item.label}</span>}
            </Link>
          ))}

          <div className="my-4 border-t border-[#E5E7EB]" />

          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && onCloseMobile()}
              title={!showLabels ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-150 ${
                item.active
                  ? 'bg-[#2a1b63] text-white shadow-sm'
                  : 'text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63]'
              }`}
            >
              <Icon name={item.icon} className="text-[20px] shrink-0" />
              {showLabels && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Bottom Role Pill */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFBFF]">
          {showLabels ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5F6368]">Current Role:</span>
              <span className="text-[#2a1b63] bg-[#F3F0FA] px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                Admin
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" title="Admin active" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 ease-in-out print:hidden ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex print:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            {renderSidebarBody(true)}
          </aside>
        </div>
      )}
    </>
  );
}
