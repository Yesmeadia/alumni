// components/dashboard/AlumniGridCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniGridCardProps {
  alumni: AlumniData & { id: string };
  index: number;
  onClick: (alumni: AlumniData & { id: string }) => void;
}

const AlumniGridCard: React.FC<AlumniGridCardProps> = ({ alumni, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="h-full"
    >
      <Card
        className="group relative h-full flex flex-col bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer rounded-3xl"
        onClick={() => onClick(alumni)}
      >
        {/* Card Header / Banner */}
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>

        <CardContent className="flex-1 flex flex-col pt-0 px-6 pb-6 relative z-10 w-full min-h-0">

          {/* Avatar - overlapping the banner */}
          <div className="-mt-12 mb-4 flex justify-between items-end w-full shrink-0">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl bg-white">
                <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                  {alumni.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-[3px] border-white rounded-full shadow-sm" />
            </div>
            <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 shadow-sm px-3 py-1 text-xs font-semibold">
              Batch {alumni.yearOfGraduation}
            </Badge>
          </div>

          {/* Profile Details */}
          <div className="mb-6 shrink-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate pr-2" title={alumni.fullName}>
              {alumni.fullName}
            </h3>
            <p className="text-blue-600 font-medium text-sm truncate pr-2 mb-0.5" title={alumni.currentJobTitle || 'Alumni Member'}>
              {alumni.currentJobTitle || 'Alumni Member'}
            </p>
            <p className="text-gray-500 text-xs truncate" title={alumni.companyName}>
              {alumni.companyName}
            </p>
          </div>

          {/* Info Grid - Pushed to bottom but flexible */}
          <div className="mt-auto space-y-2.5 w-full">
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
              <GraduationCap className="h-4 w-4 mr-3 flex-shrink-0 text-indigo-500" />
              <span className="truncate flex-1 text-xs font-medium" title={alumni.schoolAttended}>
                {alumni.schoolAttended || 'YES INDIA School'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
              <MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-rose-500" />
              <span className="truncate flex-1 text-xs font-medium" title={[alumni.place, alumni.state].filter(Boolean).join(', ')}>
                {[alumni.place, alumni.state].filter(Boolean).join(', ') || 'Location not available'}
              </span>
            </div>
          </div>

          {/* View Profile Action - Visible on Hover for Desktop, always for touch? Make it subtle at bottom */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-blue-600 font-semibold text-sm shrink-0">
            <span className="group-hover:translate-x-1 transition-transform duration-300">View Full Profile</span>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlumniGridCard;