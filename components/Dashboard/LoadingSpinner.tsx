// components/dashboard/LoadingSpinner.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-blue-400 opacity-20 animate-ping" />
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading dashboard...</p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;