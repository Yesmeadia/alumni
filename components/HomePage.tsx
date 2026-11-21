import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import VisionMissionSection from '@/components/home/VisionMissionSection';
import FeaturedAlumniSection from '@/components/home/FeaturedAlumniSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import CareerOpportunitiesSection from '@/components/home/CareerOpportunitiesSection';
import CommunitySection from '@/components/home/CommunitySection';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <VisionMissionSection />
      <FeaturedAlumniSection />
      <BenefitsSection />
      <CareerOpportunitiesSection />
      <CommunitySection />
    </>
  );
}
