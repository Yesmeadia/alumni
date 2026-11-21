import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

const CAREER_HIGHLIGHTS = [
  {
    icon: 'work',
    title: 'Domestic & Global Roles',
    description:
      'Explore full-time, part-time, internship, and international career opportunities facilitated by YES INDIA Foundation.',
  },
  {
    icon: 'verified_user',
    title: 'Quick Alumni Verification',
    description:
      'Already registered on the portal? Verify your profile instantly using your registered mobile number and name.',
  },
  {
    icon: 'description',
    title: 'Direct Career Desk Review',
    description:
      'Attach your resume and skills once—our alumni career coordinators review and connect candidates with hiring partners.',
  },
];

export default function CareerOpportunitiesSection() {
  return (
    <section className="w-full bg-[#faf9f6] border-y border-gray-200/70 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5874c]">
              Alumni Career Portal
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1b63] mt-1.5">
              Job Applications &amp; Career Support
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              Looking for your next role in India or abroad? Registered YES INDIA alumni can submit
              a job application directly through our career portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#2a1b63] hover:bg-[#1f134c] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Apply for Jobs
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-[#F3F0FA] border border-gray-300 text-[#2a1b63] text-sm font-semibold rounded-lg transition-colors"
            >
              Register as Alumni
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAREER_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 space-y-3 shadow-xs"
            >
              <div className="h-11 w-11 rounded-xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center">
                <Icon name={item.icon} className="text-[22px]" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#2a1b63]">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
