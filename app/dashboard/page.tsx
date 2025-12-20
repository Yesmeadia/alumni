// app/dashboard/page.tsx
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import Footer from '@/components/Footer';


export const metadata = {
  title: 'Alumni Dashboard - YES INDIA',
  description: 'View and manage YES INDIA alumni registrations',
};

export default function DashboardPage() {
  return (
    <>
    <ProtectedRoute>
      <Dashboard />
      <Footer />
    </ProtectedRoute>
    </>
  );
}