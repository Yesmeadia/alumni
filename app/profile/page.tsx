'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';
import { SITE_CONFIG } from '@/data/site';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const displayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'Admin User');

  const lastSignIn = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'Active Session';

  const accountCreated = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : '—';

  const saasCardClass =
    'bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden';

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto space-y-7">
      {/* Page Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#1D1E20] tracking-tight">
            Account &amp; Profile
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            View your administrator profile, session details, and quick workspace controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
            >
              <Icon name="grid_view" className="text-[18px] mr-2" />
              Dashboard
            </Button>
          </Link>
          <Button
            type="button"
            onClick={() => logout()}
            variant="outline"
            className="h-10 px-4 rounded-xl border-red-200 text-[#DC2626] hover:bg-red-50 hover:border-red-300"
          >
            <Icon name="logout" className="text-[18px] mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card className={saasCardClass}>
        <div className="h-28 sm:h-32 bg-[#2a1b63] relative">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#a5874c]" />
        </div>
        <CardContent className="px-6 sm:px-8 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 relative z-10">
            <Avatar className="h-24 w-24 rounded-2xl ring-4 ring-white shadow-md bg-white shrink-0">
              <AvatarImage src={user?.photoURL || ''} alt={displayName} />
              <AvatarFallback className="rounded-2xl bg-[#F3F0FA] text-[#2a1b63] text-2xl font-semibold uppercase">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1D1E20] capitalize truncate">
                  {displayName}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  Active Admin
                </span>
              </div>
              <p className="text-sm text-[#5F6368] mt-0.5 truncate">
                {user?.email || SITE_CONFIG.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details & Quick Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Account Information */}
        <div className="lg:col-span-5 space-y-6">
          <Card className={saasCardClass}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-base font-semibold text-[#1D1E20]">
                Account Information
              </CardTitle>
              <CardDescription className="text-xs text-[#8A8F98]">
                Authenticated administrator identity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#F3F0FA] text-[#2a1b63] border border-[#DDD6F3]/70 flex items-center justify-center shrink-0">
                  <Icon name="mail" className="text-[20px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#8A8F98]">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-[#1D1E20] truncate">
                    {user?.email || SITE_CONFIG.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/70 flex items-center justify-center shrink-0">
                  <Icon name="verified_user" className="text-[20px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#8A8F98]">
                    Access Level
                  </p>
                  <p className="text-sm font-medium text-[#1D1E20]">Registry Administrator</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]/70 flex items-center justify-center shrink-0">
                  <Icon name="location_on" className="text-[20px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#8A8F98]">
                    Organization
                  </p>
                  <p className="text-sm font-medium text-[#1D1E20]">{SITE_CONFIG.fullName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={saasCardClass}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-base font-semibold text-[#1D1E20]">
                Session &amp; Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3.5 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]/60">
                <span className="text-[#5F6368]">Last Sign-In</span>
                <span className="font-medium text-[#1D1E20]">{lastSignIn}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]/60">
                <span className="text-[#5F6368]">Account Created</span>
                <span className="font-medium text-[#1D1E20]">{accountCreated}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#5F6368]">Session Timeout</span>
                <span className="font-medium text-[#1D1E20]">30 min inactivity</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Workspace Quick Actions */}
        <div className="lg:col-span-7">
          <Card className={`${saasCardClass} h-full`}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <CardTitle className="text-base font-semibold text-[#1D1E20]">
                Workspace Controls
              </CardTitle>
              <CardDescription className="text-xs text-[#8A8F98]">
                Shortcuts to manage registrations, exports, and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/registrations"
                  className="group p-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFF] hover:bg-[#F3F0FA] hover:border-[#DDD6F3] transition-all flex items-start gap-3.5"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#E5E7EB] text-[#2a1b63] flex items-center justify-center shrink-0">
                    <Icon name="group" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1E20] group-hover:text-[#2a1b63]">
                      Alumni Registry
                    </p>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      Search, edit, and manage alumni profiles
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/reports"
                  className="group p-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFF] hover:bg-[#F3F0FA] hover:border-[#DDD6F3] transition-all flex items-start gap-3.5"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#E5E7EB] text-[#2a1b63] flex items-center justify-center shrink-0">
                    <Icon name="description" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1E20] group-hover:text-[#2a1b63]">
                      Export Excel / CSV
                    </p>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      Download filtered alumni spreadsheets
                    </p>
                  </div>
                </Link>

                <Link
                  href="/forgot-password"
                  className="group p-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFF] hover:bg-[#F3F0FA] hover:border-[#DDD6F3] transition-all flex items-start gap-3.5"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#E5E7EB] text-[#2a1b63] flex items-center justify-center shrink-0">
                    <Icon name="lock_reset" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1E20] group-hover:text-[#2a1b63]">
                      Reset Password
                    </p>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      Request a password reset email
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="group p-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFF] hover:bg-red-50 hover:border-red-200 transition-all flex items-start gap-3.5 text-left"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-[#E5E7EB] text-[#DC2626] flex items-center justify-center shrink-0">
                    <Icon name="logout" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1E20] group-hover:text-[#DC2626]">
                      Sign Out
                    </p>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      End your current administrator session
                    </p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
