'use client';

import React, { useState, useEffect, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('admin-figtree-only');
    return () => {
      document.body.classList.remove('admin-figtree-only');
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="admin-workspace min-h-screen flex bg-[#FAFBFF] text-[#1D1E20]">
        <Suspense fallback={null}>
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        </Suspense>

        <div className="flex-1 min-w-0 flex flex-col">
          <Suspense fallback={null}>
            <AdminHeader onOpenMobileNav={() => setMobileSidebarOpen(true)} />
          </Suspense>

          <main className="flex-1 flex flex-col">{children}</main>

          <AdminFooter />
        </div>
      </div>
    </ProtectedRoute>
  );
}
