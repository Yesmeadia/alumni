import React from 'react';
import { ALUMNI_STATS, VISION_MISSION } from '@/data/home';

export default function VisionMissionSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      {/* Top Editorial Header + Clean Metric Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end mb-10 sm:mb-12">
        <div className="lg:col-span-6">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5874c]">
            Our Purpose
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1b63] mt-2 leading-tight">
            Guided by Values, Connected for Life
          </h2>
        </div>

        {/* Architectural 3-Column Count Strip */}
        <div className="lg:col-span-6">
          <div className="grid grid-cols-3 divide-x divide-gray-200 bg-[#faf9f6] rounded-2xl border border-gray-200/80 py-5 px-2 sm:px-4">
            {ALUMNI_STATS.map((stat) => (
              <div key={stat.label} className="px-3 sm:px-5">
                <div className="w-6 h-0.5 bg-[#a5874c] mb-2.5" />
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#2a1b63] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contrasting Side-by-Side Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vision — Deep Indigo */}
        <div className="bg-[#2a1b63] text-white rounded-[24px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs font-bold text-[#d6be8a]">01</span>
              <span className="w-8 h-px bg-[#a5874c]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                Direction
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
              {VISION_MISSION.vision.title}
            </h3>
            <p className="text-base text-white/85 leading-relaxed">
              {VISION_MISSION.vision.body}
            </p>
          </div>
        </div>

        {/* Mission — Warm Stone */}
        <div className="bg-[#faf9f6] text-[#212529] rounded-[24px] border border-gray-200/80 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-xs font-bold text-[#a5874c]">02</span>
              <span className="w-8 h-px bg-[#2a1b63]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                Commitment
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1b63] mb-4">
              {VISION_MISSION.mission.title}
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              {VISION_MISSION.mission.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
