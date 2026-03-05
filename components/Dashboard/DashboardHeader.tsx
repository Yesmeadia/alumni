// components/dashboard/DashboardHeader.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  LayoutDashboard,
  Bell,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Search,
  ExternalLink,
  Menu,
  X
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
  onSearchChange
}) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 transition-all duration-300">
      <div className="px-6 h-20 flex items-center justify-between gap-8">

        {/* Left Side: Brand & Main Nav */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="transition-transform hover:scale-[1.02]">
            <img
              src="/logo.png"
              alt="YES INDIA"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Middle: Integrated Search (Visual Only for now) */}
        <div className="hidden xl:flex flex-1 max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search alumni, companies, or batches..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 h-11 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-1 rounded-2xl transition-all duration-300 ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'
                }`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm rounded-xl">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black text-xs">
                    {user?.email?.charAt(0).toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="hidden lg:block text-left mr-1">
                <p className="text-xs font-black text-slate-900 leading-tight">
                  {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Admin User')}
                </p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white border border-slate-200/60 shadow-2xl shadow-indigo-500/10 rounded-2xl overflow-hidden p-2 origin-top-right"
                >
                  <div className="p-3 mb-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Logged as</p>
                    <p className="text-xs font-black text-slate-900">{user?.email || 'admin@yesindia.org'}</p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                    >
                      <UserIcon className="h-4 w-4" /> My Profile
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      <ExternalLink className="h-4 w-4" /> View Site
                    </Link>
                    <div className="h-[1px] bg-slate-100 my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-10 w-10 md:hidden rounded-xl border border-slate-200/60"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
