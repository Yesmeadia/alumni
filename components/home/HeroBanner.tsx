'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { HERO_SLIDES } from '@/data/home';
import { useAutoSlider } from '@/hooks/useAutoSlider';

export default function HeroBanner() {
  const { index, setIndex, next, prev, setPaused } = useAutoSlider(HERO_SLIDES.length, 4800);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-8">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative h-[430px] sm:h-[510px] lg:h-[560px] w-full rounded-[28px] overflow-hidden bg-[#2a1b63]"
      >
        {/* Background Photo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[index].src}
              alt={HERO_SLIDES[index].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#170e3b]/90 via-[#170e3b]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Left-Aligned Editorial Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`hero-title-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-4"
            >
              {HERO_SLIDES[index].title}
            </motion.h1>
          </AnimatePresence>

          <p className="text-sm sm:text-base text-white/85 max-w-xl leading-relaxed mb-7">
            Connect with fellow graduates, mentor current students, and stay part of the lifelong
            YES INDIA legacy across chapters worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center px-7 py-3.5 bg-[#a5874c] hover:bg-[#93763e] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <span>Register as Alumni</span>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Apply for Jobs
            </Link>
          </div>
        </div>

        {/* Bottom-Right Minimal Controls & Slide Counter */}
        <div className="hidden sm:flex items-center gap-3 absolute bottom-8 right-8 z-10">
          <span className="text-xs font-mono font-semibold text-white/80 mr-1">
            {String(index + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <Icon name="chevron_left" className="text-[20px]" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
        </div>

        {/* Mobile Slide Dots */}
        <div className="sm:hidden flex items-center gap-1.5 absolute top-5 right-5 z-10">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === index ? 'w-6 bg-[#a5874c]' : 'w-1.5 bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
