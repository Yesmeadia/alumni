// components/dashboard/AlumniTableRow.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
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
    <TableRow className="hover:bg-blue-50 transition-colors">
      <TableCell>
        <Avatar className="h-12 w-12 ring-2 ring-gray-200">
          <AvatarImage src={alumni.photoURL} alt={alumni.fullName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
            {alumni.fullName
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-semibold text-gray-900">
        {alumni.fullName}
      </TableCell>
      <TableCell className="text-gray-600">
        {alumni.schoolAttended}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {alumni.yearOfGraduation}
        </Badge>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium text-gray-900">
            {alumni.currentJobTitle}
          </div>
          <div className="text-sm text-gray-500">
            {alumni.companyName}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-gray-600">
        {alumni.place}, {alumni.state}
      </TableCell>
      <TableCell className="text-center">
        <Button
          size="sm"
          onClick={() => onClick(alumni)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AlumniTableRow;