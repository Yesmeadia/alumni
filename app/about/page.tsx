import type { Metadata } from 'next';
import PublicLayout from '@/components/layout/PublicLayout';
import VisionMissionSection from '@/components/home/VisionMissionSection';
import FeaturedAlumniSection from '@/components/home/FeaturedAlumniSection';

export const metadata: Metadata = {
  title: 'About & Vision - YES INDIA Alumni',
  description: 'Learn about the vision, mission, and featured graduates of the YES INDIA Alumni Network.',
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5874c]">
          About the Network
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#2a1b63] mt-2">
          YES INDIA Alumni Network
        </h1>
        <p className="text-base text-gray-600 mt-3 max-w-2xl leading-relaxed">
          Uniting graduates of YES INDIA Foundation institutions around shared values, lifelong
          fellowship, and community service.
        </p>
      </section>

      <VisionMissionSection />
      <FeaturedAlumniSection />
    </PublicLayout>
  );
}
