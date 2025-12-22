'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  GraduationCap,
  Building2,
  MapPin,
  Search,
  Download,
  Eye,
  Grid3x3,
  List,
} from 'lucide-react';
import { AlumniWithId } from './types';
import AlumniGridCard from './AlumniGridCard';
import AlumniTableView from './AlumniTableRow';

interface DashboardAlumniDirectoryProps {
  alumniList: AlumniWithId[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onViewDetails: (alumni: AlumniWithId) => void;
}

const DashboardAlumniDirectory: React.FC<DashboardAlumniDirectoryProps> = ({
  alumniList,
  searchTerm,
  onSearchChange,
  onExport,
  onViewDetails,
}) => {
  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              Alumni Directory
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Browse and manage {alumniList.length} registered alumni
            </CardDescription>
          </div>
          <Button
            onClick={onExport}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, school, job title, company, or location..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 py-6 text-base border-2 focus:border-blue-500 rounded-xl shadow-sm"
          />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 p-1 bg-gray-100 rounded-xl">
            <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid View
            </TabsTrigger>
            <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
              <List className="h-4 w-4 mr-2" />
              Table View
            </TabsTrigger>
          </TabsList>

          {/* Grid View */}
          <TabsContent value="grid">
            <AnimatePresence mode="wait">
              {alumniList.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                    <Users className="h-16 w-16 text-gray-300" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No alumni found matching your search
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your search criteria
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {alumniList.map((alumni, index) => (
                    <AlumniGridCard
                      key={alumni.id}
                      alumni={alumni}
                      index={index}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Table View */}
          <TabsContent value="table">
            <AlumniTableView
              alumniList={alumniList}
              onViewDetails={onViewDetails}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardAlumniDirectory;