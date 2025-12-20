'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Home, UserPlus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              YES INDIA Alumni
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center space-x-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;