// components/dashboard/AlumniIdCard.tsx
'use client';

import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniIdCardProps {
  alumni: AlumniData & { id: string };
}

const AlumniIdCard: React.FC<AlumniIdCardProps> = ({ alumni }) => {
  return (
    <div className="w-full max-w-[300px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden print:shadow-none">
      <div className="h-16 bg-slate-900 p-4 flex items-center justify-between">
        <img src="/logo.png" alt="Logo" className="h-8 w-auto invert" />
      </div>
      <div className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-28 w-28 border-4 border-slate-50 shadow-md mb-4 -mt-14">
          <AvatarImage src={alumni.photoURL || undefined} alt={alumni.fullName} className="object-cover" />
        </Avatar>
        <h4 className="text-base font-bold text-slate-900">{alumni.fullName}</h4>
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">BATCH {alumni.yearOfGraduation}</p>

        <div className="w-full space-y-2 text-left pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-bold text-slate-400 uppercase">School:</span>
            <span className="text-[9px] font-bold text-slate-700 truncate max-w-[140px] text-right">{alumni.schoolAttended || 'YES INDIA'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-bold text-slate-400 uppercase">Role:</span>
            <span className="text-[9px] font-bold text-emerald-600 text-right">{alumni.currentJobTitle || 'Alumni'}</span>
          </div>
        </div>

      </div>
      <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
        <p className="text-[8px] font-bold text-slate-400">www.yesindiafoundation.com/alumni</p>
      </div>
    </div>
  );
};

export default AlumniIdCard;
