'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { HEADER_NAV_LINKS, SITE_CONFIG } from '@/data/site';

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col items-start leading-none">
            <img
              src="/logo.png"
              alt={SITE_CONFIG.fullName}
              className="h-9 sm:h-10 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a5874c]">
              {SITE_CONFIG.subtitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {HEADER_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'text-[#2a1b63] font-semibold'
                      : 'text-[#212529] hover:text-[#2a1b63]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="px-6 py-2.5 bg-[#2a1b63] hover:bg-[#1f134c] text-white text-[15px] font-medium rounded-lg transition-colors"
            >
              Register Now
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#2a1b63] hover:bg-gray-100 transition-colors"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} className="text-[24px]" />
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-1">
                {HEADER_NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full text-left py-2.5 px-3 text-[15px] rounded-lg ${
                        isActive
                          ? 'bg-[#f7f4ed] text-[#2a1b63] font-semibold'
                          : 'font-medium text-[#212529] hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/register');
                    }}
                    className="w-full py-3 bg-[#2a1b63] text-white text-[15px] font-semibold rounded-lg"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
