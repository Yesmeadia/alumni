import React from 'react';
import { COMMUNITY_PILLARS } from '@/data/home';

export default function BenefitsSection() {
  return (
    <section className="w-full bg-[#2a1b63] text-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6be8a]">
              Membership Privileges
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mt-2">
              Why Join
              <br />
              YES INDIA
              <br />
              Alumni
            </h2>
            <p className="text-sm sm:text-base text-white/75 mt-5 leading-relaxed">
              Lifelong fellowship, mentorship, and opportunities designed for every graduate.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {COMMUNITY_PILLARS.map((pillar, idx) => (
              <div key={pillar.title} className="border-t border-white/20 pt-5">
                <span className="font-mono text-xs font-bold text-[#d6be8a]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-bold text-white mt-2 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
