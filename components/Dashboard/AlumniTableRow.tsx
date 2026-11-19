'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { Icon } from '@/components/ui/icon';
import { AlumniData } from '@/lib/types';

export interface AlumniWithId extends AlumniData {
  id: string;
}

interface AlumniTableRowProps {
  alumni: AlumniWithId;
  index: number;
  onClick: (alumni: AlumniWithId) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AlumniTableRow: React.FC<AlumniTableRowProps> = ({
  alumni,
  onClick,
  onEdit,
  onDelete,
}) => {
  const locationText = [alumni.place, alumni.state].filter(Boolean).join(', ') || '—';

  return (
    <TableRow
      className="group hover:bg-[#FAFBFF] transition-colors border-[#E5E7EB]/70 cursor-pointer"
      onClick={() => onClick(alumni)}
    >
      {/* 1. Alumni Profile */}
      <TableCell className="py-3.5 pl-5">
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar className="h-10 w-10 rounded-xl border border-[#E5E7EB] shrink-0">
            <AvatarImage src={alumni.photoURL} alt={alumni.fullName} className="object-cover" />
            <AvatarFallback className="bg-[#F3F0FA] text-[#2a1b63] text-xs font-medium uppercase rounded-xl">
              {alumni.fullName?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-[#1D1E20] text-sm truncate group-hover:text-[#2a1b63] transition-colors">
              {alumni.fullName}
            </p>
            <p className="text-xs text-[#8A8F98] font-mono truncate">
              {alumni.mobileNumber || alumni.email || '—'}
            </p>
          </div>
        </div>
      </TableCell>

      {/* 2. Institution */}
      <TableCell className="py-3.5">
        <div className="max-w-[220px]">
          <p className="text-xs font-medium text-[#1D1E20] truncate" title={alumni.schoolAttended}>
            {alumni.schoolAttended || 'YES INDIA School'}
          </p>
          <p className="text-[11px] text-[#8A8F98] truncate">
            {alumni.qualification || alumni.lastClassAttended || '—'}
          </p>
        </div>
      </TableCell>

      {/* 3. Batch */}
      <TableCell className="py-3.5 text-center">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F3F0FA] border border-[#DDD6F3] text-[#2a1b63] text-xs font-medium">
          {alumni.yearOfGraduation || '—'}
        </span>
      </TableCell>

      {/* 4. Career */}
      <TableCell className="py-3.5">
        <div className="max-w-[200px]">
          <p className="text-xs font-medium text-[#1D1E20] truncate" title={alumni.currentJobTitle}>
            {alumni.currentJobTitle || '—'}
          </p>
          <p className="text-[11px] text-[#8A8F98] truncate" title={alumni.companyName}>
            {alumni.companyName || '—'}
          </p>
        </div>
      </TableCell>

      {/* 5. Location */}
      <TableCell className="py-3.5">
        <span className="text-xs text-[#5F6368] truncate block max-w-[160px]" title={locationText}>
          {locationText}
        </span>
      </TableCell>

      {/* 6. Actions */}
      <TableCell className="py-3.5 pr-5 text-right">
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            title="View details"
            onClick={() => onClick(alumni)}
            className="h-8 w-8 p-0 text-[#5F6368] hover:text-[#2a1b63] hover:bg-[#F3F0FA] rounded-lg"
          >
            <Icon name="visibility" className="text-[18px]" />
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Edit profile"
              onClick={() => onEdit(alumni.id)}
              className="h-8 w-8 p-0 text-[#5F6368] hover:text-[#2a1b63] hover:bg-[#F3F0FA] rounded-lg"
            >
              <Icon name="edit" className="text-[18px]" />
            </Button>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Delete profile"
              onClick={() => onDelete(alumni.id)}
              className="h-8 w-8 p-0 text-[#8A8F98] hover:text-[#DC2626] hover:bg-red-50 rounded-lg"
            >
              <Icon name="delete" className="text-[18px]" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AlumniTableRow;
