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
  Filter,
  Calendar,
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

// This represents what we get from Firebase - the key is separate from data
interface AlumniWithId {
  id: string; // Firebase push key
  data: AlumniData; // The actual alumni data
}

const Dashboard = () => {
  const [alumniList, setAlumniList] = useState<AlumniWithId[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedYear, setSelectedYear] = useState<string>('all');

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
      console.log('Firebase data:', data); // Debug log
      
      if (data) {
        const alumniArray: AlumniWithId[] = [];
        
        Object.entries(data).forEach(([firebaseKey, alumniData]) => {
          console.log('Processing entry:', firebaseKey, alumniData); // Debug log
          
          // The Firebase key is the ID, alumniData is the actual data
          alumniArray.push({
            id: firebaseKey, // Use Firebase push key as ID
            data: alumniData as AlumniData,
          });
        });

        console.log('Processed alumni array:', alumniArray); // Debug log

        // Sort by registration date (newest first)
        alumniArray.sort((a, b) => {
          const dateA = a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0;
          const dateB = b.data.registrationDate ? new Date(b.data.registrationDate).getTime() : 0;
          return dateB - dateA;
        });

        setAlumniList(alumniArray);
        setFilteredAlumni(alumniArray);

        // Calculate stats
        const uniqueSchools = new Set(alumniArray.map((a) => a.data.schoolAttended)).size;
        const uniqueCompanies = new Set(alumniArray.map((a) => a.data.companyName)).size;
        
        // Count registrations from last 30 days
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = alumniArray.filter((a) => {
          if (!a.data.registrationDate) return false;
          try {
            const registrationDate = new Date(a.data.registrationDate).getTime();
            return registrationDate > thirtyDaysAgo;
          } catch {
            return false;
          }
        }).length;

        setStats({
          totalAlumni: alumniArray.length,
          totalSchools: uniqueSchools,
          totalCompanies: uniqueCompanies,
          recentRegistrations: recentCount,
        });
      } else {
        console.log('No data found in Firebase'); // Debug log
        setAlumniList([]);
        setFilteredAlumni([]);
        setStats({
          totalAlumni: 0,
          totalSchools: 0,
          totalCompanies: 0,
          recentRegistrations: 0,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching alumni data:', error);
      setLoading(false);
    });

    return () => off(alumniRef, 'value', unsubscribe);
  }, []);

  // Get unique graduation years for filter
  const graduationYears = React.useMemo(() => {
    const years = new Set(alumniList.map(alumni => alumni.data.yearOfGraduation).filter(Boolean));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [alumniList]);

  // Filter alumni based on search term and selected year
  useEffect(() => {
    setFilteredAlumni(alumniList);
  }, [alumniList]);

  useEffect(() => {
    const filtered = filteredAlumni;

    let result = filtered;

    // Apply year filter
    if (selectedYear !== 'all') {
      result = result.filter(alumni => alumni.data.yearOfGraduation === selectedYear);
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (alumni) =>
          alumni.data.fullName?.toLowerCase().includes(term) ||
          alumni.data.schoolAttended?.toLowerCase().includes(term) ||
          alumni.data.currentJobTitle?.toLowerCase().includes(term) ||
          alumni.data.companyName?.toLowerCase().includes(term) ||
          alumni.data.place?.toLowerCase().includes(term) ||
          alumni.data.qualification?.toLowerCase().includes(term) ||
          alumni.data.mobileNumber?.includes(searchTerm)
      );
    }

    setFilteredAlumni(result);
  }, [searchTerm, selectedYear]);

  const handleViewDetails = (alumni: AlumniWithId) => {
    console.log('View details clicked for:', alumni.id, alumni.data.fullName); // Debug log
    setSelectedAlumni(alumni);
    setIsDialogOpen(true);
  };

  const handleExportData = () => {
    // Convert to format expected by export utility
    const exportData = filteredAlumni.map(alumni => ({
      id: alumni.id,
      ...alumni.data
    }));
    exportAlumniToCSV(exportData, `yes-india-alumni-${new Date().toISOString().split('T')[0]}`);
  };

  const handleYearFilterChange = (year: string) => {
    setSelectedYear(year);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('all');
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
                    {selectedYear !== 'all' && ` from batch ${selectedYear}`}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExportData}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  disabled={filteredAlumni.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </div>

              {/* Filters and Search Bar */}
              <div className="mt-6 space-y-4">
                {/* Year Filter */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter by Batch:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedYear === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleYearFilterChange('all')}
                      className={`px-3 ${selectedYear === 'all' ? 'bg-blue-500 text-white' : ''}`}
                    >
                      All Years
                    </Button>
                    {graduationYears.slice(0, 5).map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleYearFilterChange(year)}
                        className={`px-3 ${selectedYear === year ? 'bg-blue-500 text-white' : ''}`}
                      >
                        {year}
                      </Button>
                    ))}
                    {graduationYears.length > 5 && (
                      <div className="relative group">
                        <Button variant="outline" size="sm" className="px-3">
                          More...
                        </Button>
                        <div className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-1 min-w-[120px]">
                          {graduationYears.slice(5).map((year) => (
                            <Button
                              key={year}
                              variant={selectedYear === year ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => handleYearFilterChange(year)}
                              className="w-full justify-start mb-1"
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {(searchTerm || selectedYear !== 'all') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, school, job title, company, location, or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-6 text-base border-2 focus:border-blue-500 rounded-xl shadow-sm"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setSearchTerm('')}
                    >
                      <span className="sr-only">Clear search</span>
                      ×
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <TabsList className="grid w-full sm:w-auto grid-cols-2 p-1 bg-gray-100 rounded-xl">
                    <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Grid View
                    </TabsTrigger>
                    <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <List className="h-4 w-4 mr-2" />
                      Table View
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="text-sm text-gray-600">
                    Showing {filteredAlumni.length} of {alumniList.length} alumni
                    {selectedYear !== 'all' && ` from batch ${selectedYear}`}
                  </div>
                </div>

                {/* Grid View */}
                <TabsContent value="grid" className="mt-0">
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
                          {searchTerm || selectedYear !== 'all' ? 'Try adjusting your search criteria' : 'No alumni registered yet'}
                        </p>
                        {(searchTerm || selectedYear !== 'all') && (
                          <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="mt-4"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      >
                        {filteredAlumni.map((alumni, index) => (
                          <AlumniGridCard
                            key={alumni.id}
                            alumni={{ id: alumni.id, ...alumni.data }}
                            index={index}
                            onClick={() => handleViewDetails(alumni)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Table View */}
                <TabsContent value="table" className="mt-0">
                  {filteredAlumni.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                        <Users className="h-16 w-16 text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        No alumni found matching your search
                      </p>
                      {(searchTerm || selectedYear !== 'all') && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="mt-4"
                        >
                          Clear Filters
                        </Button>
                      )}
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
                              alumni={{ id: alumni.id, ...alumni.data }}
                              onClick={() => handleViewDetails(alumni)}
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
        alumni={selectedAlumni ? { id: selectedAlumni.id, ...selectedAlumni.data } : null}
      />
    </div>
  );
};

export default Dashboard;