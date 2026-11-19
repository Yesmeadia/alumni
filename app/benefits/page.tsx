import type { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import BenefitsSection from '@/components/home/BenefitsSection';

export const metadata: Metadata = {
  title: 'Member Benefits - YES INDIA Alumni',
  description: 'Explore the lifelong benefits and opportunities available to YES INDIA alumni.',
};

export default function BenefitsPage() {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5874c]">
          Membership
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#2a1b63] mt-2">
          Alumni Benefits
        </h1>
        <p className="text-base text-gray-600 mt-3 max-w-2xl leading-relaxed">
          Discover how registering with the official YES INDIA Alumni Network supports your
          career, community connections, and mentorship initiatives.
        </p>
      </section>

      <BenefitsSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="bg-[#f7f4ed] border-l-4 border-[#a5874c] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#2a1b63]">
              Ready to join the registry?
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete your online registration to receive your verified digital Alumni ID card.
            </p>
          </div>
          <Link
            href="/register"
            className="px-7 py-3 bg-[#2a1b63] hover:bg-[#1f134c] text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
          >
            Register Now
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
