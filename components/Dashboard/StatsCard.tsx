// components/dashboard/StatsCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="h-full"
    >
      <Card className="h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 [&_svg]:h-5 [&_svg]:w-5">
              {icon}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
               {title}
            </p>
          </div>

          <div className="mt-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {value.toLocaleString()}
            </h3>
            <p className="text-xs font-medium text-slate-400">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
