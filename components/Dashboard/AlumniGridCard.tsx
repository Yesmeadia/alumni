// components/dashboard/AlumniGridCard.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { AlumniData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface AlumniGridCardProps {
  alumni: AlumniData & { id: string };
  index: number;
  onClick: (alumni: AlumniData & { id: string }) => void;
}

const AlumniGridCard: React.FC<AlumniGridCardProps> = ({ alumni, index, onClick }) => {
  return (
    <Card
      className="group h-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer rounded-xl overflow-hidden flex flex-col"
      onClick={() => onClick(alumni)}
    >
      <CardContent className="p-6 flex flex-col items-center">
        {/* Simplified Avatar */}
        <div className="mb-4">
          <Avatar className="h-16 w-16 border-2 border-slate-50 shadow-sm">
            <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
            <AvatarFallback className="bg-slate-100 text-slate-400 font-bold uppercase">
              {alumni.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Clean Identity */}
        <div className="text-center w-full space-y-1 mb-5">
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            {alumni.fullName}
          </h3>
          <p className="text-[11px] font-semibold text-indigo-600 truncate">
            {alumni.currentJobTitle || 'Professional Member'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {alumni.companyName || 'Verified Registry'}
          </p>
        </div>

        {/* Status & Action */}
        <div className="mt-auto w-full pt-4 border-t border-slate-50 flex items-center justify-between">
          <Badge variant="outline" className="text-[9px] font-bold text-slate-400 py-0 border-slate-200">
             BATCH {alumni.yearOfGraduation}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
            Profile <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlumniGridCard;
