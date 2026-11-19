'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlumniData } from '@/lib/types';

interface AlumniGridCardProps {
  alumni: AlumniData & { id: string };
  index: number;
  onClick: (alumni: AlumniData & { id: string }) => void;
}

const AlumniGridCard: React.FC<AlumniGridCardProps> = ({ alumni, onClick }) => {
  return (
    <Card
      className="group h-full bg-white border border-gray-200/80 hover:border-[#a5874c] shadow-xs hover:shadow-md transition-all cursor-pointer rounded-2xl overflow-hidden flex flex-col"
      onClick={() => onClick(alumni)}
    >
      <CardContent className="p-5 flex flex-col items-center h-full">
        <Avatar className="h-16 w-16 rounded-2xl border-2 border-[#f7f4ed] shadow-xs mb-3.5">
          <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
          <AvatarFallback className="bg-[#2a1b63]/10 text-[#2a1b63] font-bold uppercase rounded-2xl">
            {alumni.fullName?.charAt(0) || 'A'}
          </AvatarFallback>
        </Avatar>

        <div className="text-center w-full space-y-1 mb-4">
          <h3 className="font-display text-sm font-bold text-[#212529] group-hover:text-[#2a1b63] transition-colors truncate">
            {alumni.fullName}
          </h3>
          <p className="text-xs font-semibold text-[#a5874c] truncate">
            {alumni.currentJobTitle || 'Alumni Member'}
          </p>
          <p className="text-[11px] text-gray-500 truncate">
            {alumni.companyName || alumni.schoolAttended || 'YES INDIA Foundation'}
          </p>
        </div>

        <div className="mt-auto w-full pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
          <span className="px-2 py-0.5 rounded bg-[#f7f4ed] text-[#2a1b63] font-mono font-bold">
            {alumni.yearOfGraduation || 'N/A'}
          </span>
          <span className="font-semibold text-gray-500 group-hover:text-[#2a1b63] transition-colors">
            View &rarr;
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlumniGridCard;
