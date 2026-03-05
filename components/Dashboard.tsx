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
  Building2,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  X
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
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

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
        const alumniArray: AlumniWithId[] = [];
        Object.entries(data).forEach(([firebaseKey, alumniData]) => {
          if (typeof alumniData === 'object' && alumniData !== null) {
            alumniArray.push({
              id: firebaseKey,
              data: alumniData as AlumniData,
            });
          }
        });

        const sortedAlumni = alumniArray.sort((a, b) => (b.data.registrationDate ? new Date(b.data.registrationDate).getTime() : 0) - (a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0));

        setAlumniList(sortedAlumni);
        setFilteredAlumni(sortedAlumni);

        // Stats Calculation
        const uniqueSchools = new Set(sortedAlumni.map((a) => a.data.schoolAttended).filter(Boolean)).size;
        const uniqueCompanies = new Set(sortedAlumni.map((a) => a.data.companyName).filter(Boolean)).size;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = sortedAlumni.filter((a) => {
          const d = a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0;
          return d > thirtyDaysAgo;
        }).length;

        setStats({
          totalAlumni: sortedAlumni.length,
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

    if (selectedYear !== 'all') {
      result = result.filter(a => a.data.yearOfGraduation === selectedYear);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.data.fullName?.toLowerCase().includes(term) ||
        a.data.schoolAttended?.toLowerCase().includes(term) ||
        a.data.currentJobTitle?.toLowerCase().includes(term) ||
        a.data.companyName?.toLowerCase().includes(term) ||
        a.data.mobileNumber?.includes(term) ||
        a.data.place?.toLowerCase().includes(term) ||
        a.data.district?.toLowerCase().includes(term)
      );
    }

    setFilteredAlumni(result);
    setCurrentPage(1);
  }, [searchTerm, selectedYear, alumniList]);

  const graduationYears = Array.from(new Set(alumniList.map(a => a.data.yearOfGraduation).filter(Boolean))).sort().reverse();

  const handleViewDetails = (alumni: AlumniWithId) => {
    // Unify to flat structure for state
    // IMPORTANT: Set id AFTER spreading data to ensure ID from Firebase is the source of truth
    setSelectedAlumni({ ...alumni.data, id: alumni.id } as any);
    setIsDialogOpen(true);
  };

  const handleEditAlumni = (id: string) => {
    const found = alumniList.find(a => a.id === id);
    if (found) {
      // Set id AFTER spreading data
      setSelectedAlumni({ ...found.data, id: found.id } as any);
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
      // Refresh the local selected alumni if it's the one being edited
      if (selectedAlumni && (selectedAlumni as any).id === id) {
        setSelectedAlumni({ ...cleanData, id } as any);
      }
    } catch (e) {
      console.error("Update failed", e);
      alert("Update failed");
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!window.confirm("Permanently delete this alumni profile?")) return;
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
    exportAlumniToCSV(exportData, `yes-india-alumni-export-${new Date().toISOString().split('T')[0]}`);
  };

  const handleYearFilterChange = (year: string) => setSelectedYear(year);
  const clearFilters = () => { setSearchTerm(''); setSelectedYear('all'); };

  const statsCards = [
    {
      title: 'Total Alumni',
      value: stats.totalAlumni,
      icon: <Users className="h-6 w-6" />,
      description: 'Registered members',
      gradient: 'from-indigo-600 to-blue-700',
      bgGradient: 'from-indigo-50 to-indigo-100',
    },
    {
      title: 'YES INDIA Schools',
      value: stats.totalSchools,
      icon: <School className="h-6 w-6" />,
      description: 'Represented schools',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
    },
    {
      title: 'Companies',
      value: stats.totalCompanies,
      icon: <Building2 className="h-6 w-6" />,
      description: 'Represented companies',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-amber-100',
    },
    {
      title: 'New Registrants',
      value: stats.recentRegistrations,
      icon: <Zap className="h-6 w-6" />,
      description: 'Growing community',
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-rose-100',
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-600/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-100/30 blur-[120px] pointer-events-none" />

      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="w-full px-8 py-10 lg:py-16 relative z-10">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
                <Grid3x3 className="h-8 w-8 text-white" />
              </div>
              Control Center
            </h1>
            <p className="mt-4 text-slate-500 font-medium text-lg ml-2 max-w-2xl leading-relaxed">
              Empower and connect the YES INDIA alumni ecosystem. Manage registrations, analyze professional trends, and foster community growth.
            </p>
          </motion.div>
        </header>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statsCards.map((stat, index) => (
            <div key={index}>
              <StatsCard {...stat} index={index} />
            </div>
          ))}
        </div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white/70 backdrop-blur-2xl overflow-hidden ring-1 ring-slate-200/50">
            <CardHeader className="p-10 pb-6 border-b border-slate-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <CardTitle className="text-2xl font-black text-slate-900">Alumni Directory</CardTitle>
                  </div>
                  <CardDescription className="text-slate-500 font-medium text-base">
                    Curating <span className="text-indigo-600 font-bold">{filteredAlumni.length}</span> verified profiles
                    {selectedYear !== 'all' && <span className="text-slate-400"> for Batch {selectedYear}</span>}
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    onClick={handleExportData}
                    className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-slate-200 transition-all duration-300 rounded-2xl px-6 h-12 font-bold"
                    disabled={filteredAlumni.length === 0}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Export CSV
                  </Button>
                  {/* Add NEW button if needed */}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="mt-10 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Search by name, expertise, location, or school..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 h-14 bg-slate-50/50 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-slate-900 font-medium"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-4 flex items-center gap-3 flex-1">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <select
                        value={selectedYear}
                        onChange={(e) => handleYearFilterChange(e.target.value)}
                        className="bg-transparent border-none outline-none text-slate-600 font-bold text-sm w-full"
                      >
                        <option value="all">Every Batch</option>
                        {graduationYears.map(year => (
                          <option key={year} value={year}>Class of {year}</option>
                        ))}
                      </select>
                    </div>
                    {(searchTerm || selectedYear !== 'all') && (
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100"
                      >
                        <Filter className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10 pt-8 min-h-[600px]">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'table')} className="w-full">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Real-time Data Sync
                  </div>

                  <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl ring-1 ring-slate-200/50">
                    <TabsTrigger value="grid" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold py-2.5">
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Visual Grid
                    </TabsTrigger>
                    <TabsTrigger value="table" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-bold py-2.5">
                      <List className="h-4 w-4 mr-2" />
                      Data Sheet
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="mt-0 focus-visible:ring-0">
                  <AnimatePresence mode="wait">
                    {filteredAlumni.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200"
                      >
                        <div className="p-8 bg-white rounded-full shadow-2xl shadow-slate-200 mb-8">
                          <Users className="h-16 w-16 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Profiles Match</h3>
                        <p className="text-slate-500 font-medium text-center max-w-sm mb-8">
                          We couldn't find any alumni based on your current filters. Try broadening your criteria.
                        </p>
                        <Button
                          onClick={clearFilters}
                          variant="outline"
                          className="rounded-xl px-8 border-slate-200 hover:bg-white font-bold"
                        >
                          Clear All Filters
                        </Button>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          layout
                          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12"
                        >
                          {filteredAlumni.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((alumni, index) => (
                            <div key={alumni.id} className="h-full">
                              <AlumniGridCard
                                alumni={{ id: alumni.id, ...alumni.data }}
                                index={index}
                                onClick={() => handleViewDetails(alumni)}
                              />
                            </div>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="table" className="mt-0 focus-visible:ring-0">
                  <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-200/50">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                          <TableHead className="py-6 pl-8 font-black text-slate-400 uppercase text-[11px] tracking-widest">Profile</TableHead>
                          <TableHead className="py-6 font-black text-slate-400 uppercase text-[11px] tracking-widest">Name</TableHead>
                          <TableHead className="py-6 font-black text-slate-400 uppercase text-[11px] tracking-widest">Educational Hub</TableHead>
                          <TableHead className="py-6 font-black text-slate-400 uppercase text-[11px] tracking-widest text-center">Batch</TableHead>
                          <TableHead className="py-6 font-black text-slate-400 uppercase text-[11px] tracking-widest">Expertise</TableHead>
                          <TableHead className="py-6 font-black text-slate-400 uppercase text-[11px] tracking-widest">Location</TableHead>
                          <TableHead className="py-6 pr-8 font-black text-slate-400 uppercase text-[11px] tracking-widest text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlumni.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((alumni) => (
                          <AlumniTableRow
                            key={alumni.id}
                            alumni={{ id: alumni.id, ...alumni.data }}
                            onClick={() => handleViewDetails(alumni)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Unified Pagination Display */}
                {filteredAlumni.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-3">
                      <div className="flex items-center -space-x-2">
                        {[...Array(Math.min(3, Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE)))].map((_, i) => (
                          <div key={i} className={`h-2 w-2 rounded-full ${currentPage === i + 1 ? 'bg-indigo-600 scale-125' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                      Showing {Math.min(ITEMS_PER_PAGE, filteredAlumni.length - (currentPage - 1) * ITEMS_PER_PAGE)} of {filteredAlumni.length} entries
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-12 w-12 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-indigo-600 font-black text-sm">{currentPage}</span>
                        <span className="text-slate-300 font-bold text-xs mx-1">/</span>
                        <span className="text-slate-500 font-bold text-sm">{Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE)}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE)}
                        className="h-12 w-12 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AlumniDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        alumni={selectedAlumni as any}
        onEdit={handleEditAlumni}
        onDelete={handleDeleteAlumni}
      />

      <EditAlumniDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        alumni={selectedAlumni as any}
        onSave={handleUpdateAlumni}
      />
    </div>
  );
};

export default Dashboard;
