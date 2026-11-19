import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';

export const metadata = {
  title: 'Alumni Dashboard - YES INDIA',
  description: 'View and manage YES INDIA alumni registrations',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}
