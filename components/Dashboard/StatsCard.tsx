'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  gradient: string;
  bgGradient: string;
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  gradient,
  bgGradient,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="h-full group"
    >
      <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-500 h-full bg-white rounded-[2rem] ring-1 ring-slate-200/50">
        {/* Decorative Gradient Background */}
        <div className={`absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-2xl transition-all duration-700 group-hover:scale-150`} />

        <CardContent className="p-8 relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-xl shadow-indigo-200 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              {icon}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Live <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 mt-auto">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                {value.toLocaleString()}
              </h3>
              <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
            <p className="text-sm text-slate-500 font-semibold pt-1">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
