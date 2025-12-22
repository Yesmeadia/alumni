
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
      <Card className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${bgGradient}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;