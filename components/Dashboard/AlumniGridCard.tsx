// components/dashboard/AlumniGridCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, GraduationCap, MapPin, Eye } from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

interface AlumniGridCardProps {
  alumni: AlumniWithId;
  index: number;
  onClick: (alumni: AlumniWithId) => void;
}

const AlumniGridCard: React.FC<AlumniGridCardProps> = ({ alumni, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden"
        onClick={() => onClick(alumni)}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                <AvatarImage src={alumni.photoURL} alt={alumni.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold">
                  {alumni.fullName
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-green-500 rounded-full border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {alumni.fullName}
              </h3>
              <p className="text-sm text-gray-600 truncate font-medium">
                {alumni.currentJobTitle}
              </p>
              <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                Batch {alumni.yearOfGraduation}
              </Badge>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Building2 className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
              <span className="truncate">{alumni.companyName}</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
              <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
              <span className="truncate">{alumni.schoolAttended}</span>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
              <span className="truncate">
                {alumni.place}, {alumni.state}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlumniGridCard;