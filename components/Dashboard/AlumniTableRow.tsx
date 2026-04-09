// components/dashboard/AlumniTableRow.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, MapPin, Building2, ExternalLink, ShieldCheck } from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

interface AlumniTableRowProps {
  alumni: AlumniWithId;
  index: number;
  onClick: (alumni: AlumniWithId) => void;
}

const AlumniTableRow: React.FC<AlumniTableRowProps> = ({ alumni, index, onClick }) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (!rowRef.current) return;
    
    gsap.fromTo(rowRef.current,
      { opacity: 0, x: -20 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        delay: index * 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );
  }, [index]);

  return (
    <TableRow
      ref={rowRef}
      className="group hover:bg-slate-50/80 transition-all duration-300 border-slate-100 cursor-pointer"
      onClick={() => onClick(alumni)}
    >
      <TableCell className="pl-8 py-5">
        <div className="relative inline-block">
          <Avatar className="h-14 w-14 ring-4 ring-white shadow-md relative z-10 rounded-2xl">
            <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
            <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">
              {alumni.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </TableCell>

      <TableCell>
        <div className="font-bold text-slate-800 text-sm">{alumni.fullName}</div>
      </TableCell>

      <TableCell>
        <div className="font-semibold text-slate-600 text-xs truncate max-w-[200px]" title={alumni.schoolAttended}>
          {alumni.schoolAttended || 'YES INDIA School'}
        </div>
      </TableCell>

      <TableCell className="text-center">
        <span className="text-xs font-black text-slate-400 bg-slate-100/50 px-3 py-1 rounded-lg border border-slate-100">
          {alumni.yearOfGraduation}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-slate-800 text-[11px] truncate uppercase tracking-tight" title={alumni.currentJobTitle}>
              {alumni.currentJobTitle || 'Member'}
            </div>
            <div className="text-[10px] text-slate-400 font-bold truncate">
              {alumni.companyName || 'Private Org'}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center text-slate-500 font-semibold gap-2">
          <MapPin className="h-3.5 w-3.5 text-slate-300 shrink-0" />
          <span className="truncate max-w-[150px] text-[11px] font-bold text-slate-500">{[alumni.place, alumni.state].filter(Boolean).join(', ') || 'N/A'}</span>
        </div>
      </TableCell>

      <TableCell className="pr-8 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick(alumni);
          }}
          className="h-9 w-9 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AlumniTableRow;
