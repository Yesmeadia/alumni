import React from 'react';
import Link from 'next/link';
import { FOOTER_QUICK_LINKS, SITE_CONFIG } from '@/data/site';

export default function SiteFooter() {
  return (
    <footer className="bg-[#2a1b63] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Contact */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex flex-col items-start">
              <img
                src="/footer_logo.png"
                alt={SITE_CONFIG.fullName}
                className="h-11 w-auto object-contain"
              />
              <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d6be8a]">
                {SITE_CONFIG.subtitle}
              </span>
            </div>

            <div className="pt-2 space-y-1.5 text-sm text-white/80">
              <p className="font-semibold text-white">Contact</p>
              <p>{SITE_CONFIG.email}</p>
              <p>{SITE_CONFIG.phone}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-base font-bold text-white mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-6 text-sm text-white/80">
              {FOOTER_QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={SITE_CONFIG.mainWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Main Website
              </a>
            </div>
          </div>

          {/* Offices */}
          <div className="lg:col-span-4 space-y-5 text-sm text-white/80">
            <div>
              <h3 className="font-display text-base font-bold text-white mb-1.5">
                {SITE_CONFIG.offices.registered.title}
              </h3>
              <p className="leading-relaxed">{SITE_CONFIG.offices.registered.address}</p>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white mb-1.5">
                {SITE_CONFIG.offices.administrative.title}
              </h3>
              <p className="leading-relaxed">{SITE_CONFIG.offices.administrative.address}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 text-center text-xs text-white/70">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
