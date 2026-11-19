import ProtectedLayout from '@/components/layout/ProtectedLayout';

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
