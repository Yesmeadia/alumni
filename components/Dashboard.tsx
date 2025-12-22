// components/Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  GraduationCap,
  Building2,
  Search,
  Download,
  School,
  TrendingUp,
  Grid3x3,
  List,
} from 'lucide-react';

// Import components
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatsCard from '@/components/Dashboard/StatsCard';
import AlumniGridCard from '@/components/Dashboard/AlumniGridCard';
import AlumniTableRow from '@/components/Dashboard/AlumniTableRow';
import AlumniDetailsDialog from '@/components/Dashboard/AlumniDetailsDialog';
import LoadingSpinner from '@/components/Dashboard/LoadingSpinner';

// Import the export utility
import { exportAlumniToCSV } from '@/utils/exportData';

interface AlumniWithId extends AlumniData {
  id: string;
}

const Dashboard = () => {
  const [alumniList, setAlumniList] = useState<AlumniWithId[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalSchools: 0,
    totalCompanies: 0,
    recentRegistrations: 0,
  });

  useEffect(() => {
    const alumniRef = ref(database, 'alumni');

    const unsubscribe = onValue(alumniRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alumniArray: AlumniWithId[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as AlumniData),
        }));

        setAlumniList(alumniArray);
        setFilteredAlumni(alumniArray);

        const uniqueSchools = new Set(alumniArray.map((a) => a.schoolAttended)).size;
        const uniqueCompanies = new Set(alumniArray.map((a) => a.companyName)).size;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = alumniArray.filter((a) => {
          const createdAt = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          return createdAt > thirtyDaysAgo;
        }).length;

        setStats({
          totalAlumni: alumniArray.length,
          totalSchools: uniqueSchools,
          totalCompanies: uniqueCompanies,
          recentRegistrations: recentCount,
        });
      }
      setLoading(false);
    });

    return () => off(alumniRef, 'value', unsubscribe);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAlumni(alumniList);
    } else {
      const filtered = alumniList.filter(
        (alumni) =>
          alumni.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.schoolAttended?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.place?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlumni(filtered);
    }
  }, [searchTerm, alumniList]);

  const handleViewDetails = (alumni: AlumniWithId) => {
    setSelectedAlumni(alumni);
    setIsDialogOpen(true);
  };

  const handleExportData = () => {
    exportAlumniToCSV(filteredAlumni, `yes-india-alumni-${new Date().toISOString().split('T')[0]}`);
  };

  const statsCards = [
    {
      title: 'Total Alumni',
      value: stats.totalAlumni,
      icon: <Users className="h-6 w-6" />,
      description: 'Registered members',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'YES INDIA Schools',
      value: stats.totalSchools,
      icon: <School className="h-6 w-6" />,
      description: 'Represented schools',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Companies',
      value: stats.totalCompanies,
      icon: <Building2 className="h-6 w-6" />,
      description: 'Organizations',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Recent',
      value: stats.recentRegistrations,
      icon: <TrendingUp className="h-6 w-6" />,
      description: 'Last 30 days',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} index={index} />
          ))}
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
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
                    Browse and manage {filteredAlumni.length} registered alumni
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExportData}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    {filteredAlumni.length === 0 ? (
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
                        {filteredAlumni.map((alumni, index) => (
                          <AlumniGridCard
                            key={alumni.id}
                            alumni={alumni}
                            index={index}
                            onClick={handleViewDetails}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Table View */}
                <TabsContent value="table">
                  {filteredAlumni.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                        <Users className="h-16 w-16 text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        No alumni found matching your search
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-bold">Photo</TableHead>
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold">School</TableHead>
                            <TableHead className="font-bold">Batch</TableHead>
                            <TableHead className="font-bold">Current Position</TableHead>
                            <TableHead className="font-bold">Location</TableHead>
                            <TableHead className="font-bold text-center">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAlumni.map((alumni) => (
                            <AlumniTableRow
                              key={alumni.id}
                              alumni={alumni}
                              onClick={handleViewDetails}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alumni Details Dialog */}
      <AlumniDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        alumni={selectedAlumni}
      />
    </div>
  );
};

export default Dashboard;