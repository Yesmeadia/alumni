'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { COMMUNITY_COPY, HERO_SLIDES } from '@/data/home';
import { useAutoSlider } from '@/hooks/useAutoSlider';

export default function CommunitySection() {
  const { index, setIndex } = useAutoSlider(HERO_SLIDES.length, 4500);

  const thumbOne = (index + 1) % HERO_SLIDES.length;
  const thumbTwo = (index + 2) % HERO_SLIDES.length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5874c]">
          Our Fellowship
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#2a1b63] mt-1.5">
          {COMMUNITY_COPY.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 sm:mb-12">
        <p className="text-base text-gray-700 leading-relaxed">{COMMUNITY_COPY.leftParagraph}</p>
        <p className="text-base text-gray-700 leading-relaxed lg:border-l-2 lg:border-[#2a1b63] lg:pl-8">
          {COMMUNITY_COPY.rightParagraph}
        </p>
      </div>

      {/* Bento Photo Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Large Photo */}
        <div className="lg:col-span-8 relative h-[320px] sm:h-[440px] rounded-[24px] overflow-hidden bg-[#2a1b63]">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={HERO_SLIDES[index].src}
              alt="YES INDIA Alumni Community"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <Link
            href="/register"
            className="inline-flex items-center absolute bottom-0 right-0 bg-[#2a1b63]/85 hover:bg-[#2a1b63] backdrop-blur-md text-white px-7 py-4 rounded-tl-[22px] text-sm font-medium transition-colors"
          >
            <span>Register as Alumni</span>
          </Link>
        </div>

        {/* Two Clickable Side Thumbnails */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-5">
          {[thumbOne, thumbTwo].map((slideIdx) => (
            <button
              key={slideIdx}
              type="button"
              onClick={() => setIndex(slideIdx)}
              className="relative h-40 sm:h-52 lg:h-[210px] rounded-[20px] overflow-hidden bg-[#2a1b63] group text-left"
            >
              <img
                src={HERO_SLIDES[slideIdx].src}
                alt={HERO_SLIDES[slideIdx].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
