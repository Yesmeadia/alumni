// components/dashboard/DashboardHeader.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] shadow-2xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Alumni <span className="text-[#ffd700]">Dashboard</span>
              </h1>
              <p className="text-blue-100 text-lg mt-2">
                Manage and connect with YES INDIA Foundation alumni network
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHeader;