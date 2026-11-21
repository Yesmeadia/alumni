'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FEATURED_ALUMNI } from '@/data/alumni';

export default function FeaturedAlumniSection() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section className="w-full bg-[#faf9f6] border-y border-gray-200/70 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5874c]">
              Distinguished Graduates
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1b63] mt-1.5">
              Featured Alumni
            </h2>
          </div>
          <Link
            href="/register"
            className="text-sm font-semibold text-[#2a1b63] hover:text-[#a5874c] transition-colors"
          >
            Join the Alumni Registry
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_ALUMNI.map((person) => (
            <div
              key={person.name}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/5] bg-[#2a1b63] overflow-hidden">
                {failedImages[person.name] ? (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                    {person.name.charAt(0)}
                  </div>
                ) : (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [person.name]: true }))
                    }
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#170e3b]/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#d6be8a]">
                    {person.position}
                  </p>
                  <h3 className="font-display text-lg font-bold leading-snug mt-0.5">
                    {person.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">{person.department}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
