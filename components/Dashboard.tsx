// components/Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, off, remove, update } from 'firebase/database';
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
  Briefcase,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  School,
  TrendingUp,
  Grid3x3,
  Calendar,
  Building2
} from 'lucide-react';

// Import components
import DashboardHeader from './Dashboard/DashboardHeader';
import StatsCard from './Dashboard/StatsCard';
import AlumniGridCard from './Dashboard/AlumniGridCard';
import AlumniTableRow from './Dashboard/AlumniTableRow';
import AlumniDetailsDialog from './Dashboard/AlumniDetailsDialog';
import LoadingSpinner from './Dashboard/LoadingSpinner';
import EditAlumniDialog from './Dashboard/EditAlumniDialog';

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(12);

  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalSchools: 0,
    totalCompanies: 0,
    recentRegistrations: 0,
  });

  useEffect(() => {
    // Fix: Use 'alumni' path as per firebaseService.ts
    const alumniRef = ref(database, 'alumni');

    const unsubscribe = onValue(alumniRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alumniArray: AlumniWithId[] = [];
        Object.entries(data).forEach(([firebaseKey, alumniData]) => {
          // Basic validation or type assertion
          if (typeof alumniData === 'object' && alumniData !== null) {
            alumniArray.push({
              id: firebaseKey,
              data: alumniData as AlumniData,
            });
          }
        });

        // Filter approved and sort (Temporarily allowing all for visibility if needed, or stick to approved)
        // If 'status' is missing in some records, default to 'approved' for legacy or show all?
        // Let's show ALL for now to fix "data not loading" complaint, or at least log it.
        const approvedAlumni = alumniArray
          // .filter(a => a.data.status === 'approved') // DATA LOADING FIX: Commented out to ensure data is visible
          .sort((a, b) => (b.data.registrationDate ? new Date(b.data.registrationDate).getTime() : 0) - (a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0));

        setAlumniList(approvedAlumni);
        setFilteredAlumni(approvedAlumni);

        // Stats Calculation
        const uniqueSchools = new Set(approvedAlumni.map((a) => a.data.schoolAttended)).size;
        const uniqueCompanies = new Set(approvedAlumni.map((a) => a.data.companyName)).size;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = approvedAlumni.filter((a) => {
          const d = a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0;
          return d > thirtyDaysAgo;
        }).length;

        setStats({
          totalAlumni: approvedAlumni.length,
          totalSchools: uniqueSchools,
          totalCompanies: uniqueCompanies,
          recentRegistrations: recentCount,
        });
      } else {
        setAlumniList([]);
        setFilteredAlumni([]);
        setStats({ totalAlumni: 0, totalSchools: 0, totalCompanies: 0, recentRegistrations: 0 });
      }
      setLoading(false);
    });

    return () => off(alumniRef, 'value', unsubscribe);
  }, []);

  // Filter Logic (Year + Search)
  useEffect(() => {
    let result = alumniList;

    // Filter by Year
    if (selectedYear !== 'all') {
      result = result.filter(a => a.data.yearOfGraduation === selectedYear);
    }

    // Filter by Search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.data.fullName?.toLowerCase().includes(term) ||
        a.data.schoolAttended?.toLowerCase().includes(term) ||
        a.data.currentJobTitle?.toLowerCase().includes(term) ||
        a.data.companyName?.toLowerCase().includes(term) ||
        a.data.mobileNumber?.includes(term)
      );
    }

    setFilteredAlumni(result);
    setDisplayCount(12);
  }, [searchTerm, selectedYear, alumniList]);

  const graduationYears = Array.from(new Set(alumniList.map(a => a.data.yearOfGraduation).filter(Boolean))).sort().reverse();

  // Handlers
  const handleViewDetails = (alumni: AlumniWithId) => {
    setSelectedAlumni(alumni);
    setIsDialogOpen(true);
  };

  const handleEditAlumni = (id: string) => {
    const found = alumniList.find(a => a.id === id);
    if (found) {
      setSelectedAlumni(found);
      setIsEditOpen(true);
    }
  };

  const handleUpdateAlumni = async (id: string, data: Partial<AlumniData>) => {
    try {
      const { id: _, ...cleanData } = data as any;
      await update(ref(database, `alumni/${id}`), {
        ...cleanData,
        updatedAt: Date.now()
      });
      setIsEditOpen(false);
      // Don't nullify selectedAlumni immediately so the dialog updates visibly
    } catch (e) {
      console.error("Update failed", e);
      alert("Update failed");
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!window.confirm("Delete this profile?")) return;
    try {
      await remove(ref(database, `alumni/${id}`));
      setIsDialogOpen(false);
      setSelectedAlumni(null);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleExportData = () => {
    const exportData = filteredAlumni.map(alumni => ({
      id: alumni.id,
      ...alumni.data
    }));
    exportAlumniToCSV(exportData, `yes-india-alumni-${new Date().toISOString().split('T')[0]}`);
  };

  const handleYearFilterChange = (year: string) => setSelectedYear(year);
  const clearFilters = () => { setSearchTerm(''); setSelectedYear('all'); };

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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-200/40 blur-[100px] pointer-events-none" />

      <DashboardHeader />

      <div className="container mx-auto px-4 py-8 lg:py-12 relative z-10 max-w-7xl">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => (
            <div key={index} className="h-full">
              <StatsCard {...stat} index={index} />
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-2xl backdrop-blur-xl bg-white/80 overflow-hidden ring-1 ring-black/5">
            <CardHeader className="bg-gradient-to-r from-white via-blue-50/50 to-white border-b px-8 py-8">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    <span>Alumni Directory</span>
                  </CardTitle>
                  <CardDescription className="text-base mt-2 ml-16 text-gray-500">
                    Browse and manage <span className="font-semibold text-blue-600">{filteredAlumni.length}</span> registered alumni
                    {selectedYear !== 'all' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">Batch {selectedYear}</span>}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExportData}
                  className="bg-gray-900 hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl px-6"
                  disabled={filteredAlumni.length === 0}
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Data
                </Button>
              </div>

              {/* Filters and Search Bar */}
              <div className="mt-8 space-y-6">
                {/* Search Bar */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Search by name, school, company, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 py-7 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm bg-white"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-red-50 hover:text-red-500 rounded-lg"
                        onClick={() => setSearchTerm('')}
                      >
                        <span className="sr-only">Clear search</span>
                        ×
                      </Button>
                    )}
                  </div>
                </div>

                {/* Year Filter */}
                <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mr-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Filter Batch:</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedYear === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleYearFilterChange('all')}
                      className={`rounded-lg px-4 transition-all ${selectedYear === 'all' ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                    >
                      All Years
                    </Button>
                    {graduationYears.slice(0, 6).map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleYearFilterChange(year)}
                        className={`rounded-lg transition-all ${selectedYear === year ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                      >
                        {year}
                      </Button>
                    ))}
                    {graduationYears.length > 6 && (
                      <div className="relative group">
                        <Button variant="outline" size="sm" className="bg-white border-dashed text-gray-500">
                          More...
                        </Button>
                        <div className="absolute z-20 left-0 hidden group-hover:block bg-white shadow-xl ring-1 ring-black/5 rounded-xl p-2 mt-2 min-w-[120px] max-h-60 overflow-y-auto">
                          {graduationYears.slice(6).map((year) => (
                            <Button
                              key={year}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleYearFilterChange(year)}
                              className={`w-full justify-start rounded-lg mb-1 ${selectedYear === year ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
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
                      className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-3"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 bg-gray-50/30 min-h-[500px]">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <TabsList className="grid w-full sm:w-auto grid-cols-2 p-1.5 bg-white border shadow-sm rounded-xl">
                    <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-medium">
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 font-medium">
                      <List className="h-4 w-4 mr-2" />
                      Table
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
                    Showing <span className="text-gray-900 font-bold">{filteredAlumni.length}</span> of {alumniList.length} alumni
                  </div>
                </div>

                {/* Grid View */}
                <TabsContent value="grid" className="mt-0 outline-none">
                  <AnimatePresence mode="wait">
                    {filteredAlumni.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
                      >
                        <div className="p-6 bg-blue-50 rounded-full mb-6 relative">
                          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
                          <Users className="h-12 w-12 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No profiles found</h3>
                        <p className="text-gray-500 max-w-sm text-center mb-6">
                          We couldn't find any alumni matching your search. Try adjusting your filters or search terms.
                        </p>
                        <Button
                          onClick={clearFilters}
                          variant="outline"
                          className="w-full max-w-xs"
                        >
                          Reset Filters
                        </Button>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10"
                        >
                          {filteredAlumni.slice(0, displayCount).map((alumni, index) => (
                            <div key={alumni.id} className="h-[420px]">
                              <AlumniGridCard
                                alumni={{ id: alumni.id, ...alumni.data }}
                                index={index}
                                onClick={() => handleViewDetails(alumni)}
                              />
                            </div>
                          ))}
                        </motion.div>

                        {filteredAlumni.length > displayCount && (
                          <div className="flex justify-center pb-8">
                            <Button
                              onClick={() => setDisplayCount(prev => prev + 12)}
                              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                              <span>View More Alumni</span>
                              <div className="ml-2 p-1 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                              </div>
                            </Button>
                          </div>
                        )}

                        <div className="text-center text-sm text-gray-400 pb-4">
                          Showing {Math.min(displayCount, filteredAlumni.length)} of {filteredAlumni.length} profiles
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Table View */}
                <TabsContent value="table" className="mt-0 outline-none">
                  {filteredAlumni.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                      <div className="p-6 bg-blue-50 rounded-full mb-6">
                        <Users className="h-12 w-12 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No profiles found</h3>
                      <Button onClick={clearFilters} variant="outline">Reset Filters</Button>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                      <Table>
                        <TableHeader className="bg-gray-50/50">
                          <TableRow>
                            <TableHead className="py-5 font-bold text-gray-700">Photo</TableHead>
                            <TableHead className="py-5 font-bold text-gray-700">Name</TableHead>
                            <TableHead className="py-5 font-bold text-gray-700">School Details</TableHead>
                            <TableHead className="py-5 font-bold text-gray-700">Batch</TableHead>
                            <TableHead className="py-5 font-bold text-gray-700">Professional Info</TableHead>
                            <TableHead className="py-5 font-bold text-gray-700">Location</TableHead>
                            <TableHead className="py-5 font-bold text-gray-700 text-center">Action</TableHead>
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
      {/* Alumni Details Dialog */}
      <AlumniDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        alumni={selectedAlumni ? {
          id: selectedAlumni.id,
          ...(alumniList.find(a => a.id === selectedAlumni.id)?.data || selectedAlumni.data)
        } : null}
        onEdit={handleEditAlumni}
        onDelete={handleDeleteAlumni}
      />
      <EditAlumniDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        alumni={selectedAlumni ? {
          id: selectedAlumni.id,
          ...(alumniList.find(a => a.id === selectedAlumni.id)?.data || selectedAlumni.data)
        } : null}
        onSave={handleUpdateAlumni}
      />
    </div>
  );
};

export default Dashboard;