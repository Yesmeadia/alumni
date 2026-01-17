
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

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
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full backdrop-blur-md bg-white/80">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 hover:scale-110`} />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transform transition-transform duration-300 hover:scale-110`}>
              {icon}
            </div>
            {/* Optional: Add a small trend indicator or sparkline here if data allows */}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {value.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;