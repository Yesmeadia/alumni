'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col items-start leading-none">
            <img src="/logo.png" alt="YES INDIA Foundation" className="h-8 w-auto object-contain" />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a5874c]">
              Alumni Network
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-[#212529] hover:text-[#2a1b63] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-[#212529] hover:text-[#2a1b63] transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
