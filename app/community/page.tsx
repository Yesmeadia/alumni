import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import CommunitySection from '@/components/home/CommunitySection';
import FeaturedAlumniSection from '@/components/home/FeaturedAlumniSection';

export const metadata: Metadata = {
  title: 'Community - YES INDIA Alumni',
  description: 'Explore the YES INDIA alumni community, chapters, and featured graduates.',
};

export default function CommunityPage() {
  return (
    <PublicLayout>
      <CommunitySection />
      <FeaturedAlumniSection />
    </PublicLayout>
  );
}
