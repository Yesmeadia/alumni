// components/dashboard/AlumniTableRow.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, MapPin, Building2, ExternalLink } from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

interface AlumniTableRowProps {
  alumni: AlumniWithId;
  onClick: (alumni: AlumniWithId) => void;
}

const AlumniTableRow: React.FC<AlumniTableRowProps> = ({ alumni, onClick }) => {
  return (
    <TableRow
      className="group hover:bg-slate-50/80 transition-all duration-300 border-slate-100 cursor-pointer"
      onClick={() => onClick(alumni)}
    >
      <TableCell className="pl-8 py-5">
        <div className="relative inline-block">
          <Avatar className="h-14 w-14 ring-4 ring-white shadow-md relative z-10">
            <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-extrabold">
              {alumni.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 border-[3px] border-white rounded-full z-20 shadow-sm" />
        </div>
      </TableCell>

      <TableCell>
        <div className="font-black text-slate-900 text-base">{alumni.fullName}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Verified Alumni</div>
      </TableCell>

      <TableCell>
        <div className="font-bold text-slate-600 truncate max-w-[200px]" title={alumni.schoolAttended}>
          {alumni.schoolAttended || 'YES INDIA School'}
        </div>
        <div className="text-xs text-slate-400 font-medium">Secondary Education</div>
      </TableCell>

      <TableCell className="text-center">
        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-4 py-1.5 rounded-xl font-black text-xs">
          {alumni.yearOfGraduation}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-slate-900 truncate" title={alumni.currentJobTitle}>
              {alumni.currentJobTitle || 'Member'}
            </div>
            <div className="text-xs text-indigo-600 font-bold truncate">
              {alumni.companyName || 'Private Org'}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center text-slate-500 font-semibold gap-2">
          <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
          <span className="truncate max-w-[150px]">{[alumni.place, alumni.state].filter(Boolean).join(', ') || 'N/A'}</span>
        </div>
      </TableCell>

      <TableCell className="pr-8 text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick(alumni);
          }}
          className="border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl font-bold transition-all duration-300 shadow-sm"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AlumniTableRow;
