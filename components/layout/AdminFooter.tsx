'use client';

import React from 'react';
import { SITE_CONFIG } from '@/data/site';

export default function AdminFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-5 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
