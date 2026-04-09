// components/dashboard/DashboardHeader.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Search,
  ExternalLink,
  LayoutDashboard,
  Users
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchTerm = '',
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full bg-white border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Left Side: Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Middle: Integrated Search */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search alumni, companies..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 h-10 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-50">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-50">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-all"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">
                  {user?.displayName || 'Administrator'}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden p-1.5"
                >
                  <div className="p-2.5 mb-1 bg-slate-50 rounded-lg">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Account</p>
                    <p className="text-xs font-semibold text-slate-900 truncate">{user?.email}</p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/registry"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Users className="h-4 w-4" /> Registry
                    </Link>
                    <div className="h-[1px] bg-slate-100 my-1.5" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
