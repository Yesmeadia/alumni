// components/Dashboard.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  School,
  Grid3x3,
  Calendar,
  Building2,
  Zap,
  List,
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
  const mainContentRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 24;

  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalSchools: 0,
    totalCompanies: 0,
    recentRegistrations: 0,
  });

  const [schoolsStats, setSchoolsStats] = useState<Record<string, number>>({});
  const [companiesStats, setCompaniesStats] = useState<Record<string, number>>({});

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
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = sortedAlumni.filter((a) => {
          const d = a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0;
          return d > thirtyDaysAgo;
        }).length;

        const schoolsMap: Record<string, number> = {};
        const companiesMap: Record<string, number> = {};
        
        sortedAlumni.forEach(a => {
          const s = a.data.schoolAttended;
          const c = a.data.companyName;
          if (s) schoolsMap[s] = (schoolsMap[s] || 0) + 1;
          if (c) companiesMap[c] = (companiesMap[c] || 0) + 1;
        });

        setSchoolsStats(schoolsMap);
        setCompaniesStats(companiesMap);

        setStats({
          totalAlumni: sortedAlumni.length,
          totalSchools: Object.keys(schoolsMap).length,
          totalCompanies: Object.keys(companiesMap).length,
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
        a.data.mobileNumber?.includes(term)
      );
    }
    setFilteredAlumni(result);
    setCurrentPage(1);
  }, [searchTerm, selectedYear, alumniList]);

  useEffect(() => {
    if (!loading && mainContentRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, loading]);

  const graduationYears = Array.from(new Set(alumniList.map(a => a.data.yearOfGraduation).filter(Boolean))).sort().reverse();

  const handleViewDetails = (alumni: AlumniWithId) => {
    setSelectedAlumni({ ...alumni.data, id: alumni.id } as any);
    setIsDialogOpen(true);
  };

  const handleEditAlumni = (id: string) => {
    const found = alumniList.find(a => a.id === id);
    if (found) {
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
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!window.confirm("Permanently delete profile?")) return;
    try {
      await remove(ref(database, `alumni/${id}`));
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleExportData = () => {
    const exportData = filteredAlumni.map(alumni => ({ id: alumni.id, ...alumni.data }));
    exportAlumniToCSV(exportData, `alumni-registry-${new Date().toISOString().split('T')[0]}`);
  };

  const handleYearFilterChange = (year: string) => setSelectedYear(year);
  const clearFilters = () => { setSearchTerm(''); setSelectedYear('all'); };

  const statsCards = [
    { title: 'Total Alumni', value: stats.totalAlumni, icon: <Users />, description: 'Registered members' },
    { title: 'Institutions', value: stats.totalSchools, icon: <School />, description: 'Verified centers' },
    { title: 'Companies', value: stats.totalCompanies, icon: <Building2 />, description: 'Employer network' },
    { title: 'New Today', value: stats.recentRegistrations, icon: <Zap />, description: 'Recent activity' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 relative">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold mb-4">
             Registry Management System
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Alumni Control Center
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Monitor and coordinate the global YES INDIA alumni network.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat, index) => (
            <div key={index}><StatsCard {...stat} index={index} /></div>
          ))}
        </div>

        {/* Minimalist Grid Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <Card className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                 <CardHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                       <School className="h-4 w-4 text-slate-400" />
                       <CardTitle className="text-base font-bold">Top Institutions</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 pt-2">
                    <div className="grid grid-cols-1 gap-1.5">
                       {Object.entries(schoolsStats).slice(0, 5).map(([name, count]) => (
                         <button key={name} onClick={() => setSearchTerm(name)} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-600">
                           <span className="truncate mr-2">{name}</span>
                           <span className="text-indigo-600">{count}</span>
                         </button>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <Card className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                 <CardHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                       <Building2 className="h-4 w-4 text-slate-400" />
                       <CardTitle className="text-base font-bold">Major Employers</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 pt-2">
                    <div className="grid grid-cols-1 gap-1.5">
                       {Object.entries(companiesStats).slice(0, 5).map(([name, count]) => (
                         <button key={name} onClick={() => setSearchTerm(name)} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-600">
                           <span className="truncate mr-2">{name}</span>
                           <span className="text-indigo-600">{count}</span>
                         </button>
                       ))}
                    </div>
                 </CardContent>
              </Card>
        </div>

        {/* Main List Management */}
        <Card className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <CardHeader className="p-6 lg:p-8 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-xl font-bold">Alumni Registry</CardTitle>
                <CardDescription className="font-medium">{filteredAlumni.length} Registry Entries</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                 <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                    <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="h-8 px-3 text-xs font-bold rounded-md">
                      <Grid3x3 className="h-3.5 w-3.5 mr-1.5" /> Grid
                    </Button>
                    <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('table')} className="h-8 px-3 text-xs font-bold rounded-md">
                      <List className="h-3.5 w-3.5 mr-1.5" /> List
                    </Button>
                 </div>
                 <Button onClick={handleExportData} size="sm" className="h-9 px-4 rounded-lg bg-slate-900 font-bold text-xs">
                    <Download className="mr-2 h-4 w-4" /> Export
                 </Button>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>
              <div className="flex gap-2">
                <select value={selectedYear} onChange={(e) => handleYearFilterChange(e.target.value)} className="h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-600 outline-none">
                  <option value="all">All Batches</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>Class of {year}</option>
                  ))}
                </select>
                {(searchTerm || selectedYear !== 'all') && (
                  <Button variant="ghost" onClick={clearFilters} className="h-11 w-11 p-0 rounded-xl bg-slate-100 text-slate-600">
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 lg:p-8">
             <Tabs value={viewMode} className="mt-0">
                <TabsContent value="grid" className="mt-0 outline-none">
                  <AnimatePresence mode="wait">
                    {filteredAlumni.length === 0 ? (
                      <div className="py-24 text-center">
                        <Users className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No results found</h3>
                        <p className="text-sm text-slate-400 font-medium">Try broadening your search criteria.</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAlumni.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((alumni, index) => (
                          <AlumniGridCard key={alumni.id} alumni={{ id: alumni.id, ...alumni.data }} index={index} onClick={() => handleViewDetails(alumni)} />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </TabsContent>
                <TabsContent value="table" className="mt-0 outline-none">
                   <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader className="bg-slate-50">
                          <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="py-4 pl-6 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Profile</TableHead>
                            <TableHead className="py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider">Academic</TableHead>
                            <TableHead className="py-4 font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">Batch</TableHead>
                            <TableHead className="py-4 pr-6 font-bold text-slate-400 uppercase text-[10px] tracking-wider text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAlumni.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((alumni, index) => (
                            <AlumniTableRow key={alumni.id} alumni={{ id: alumni.id, ...alumni.data }} index={index} onClick={() => handleViewDetails(alumni)} />
                          ))}
                        </TableBody>
                      </Table>
                   </div>
                </TabsContent>
             </Tabs>

             {/* Pagination */}
             {filteredAlumni.length > 0 && (
                <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
                   <p className="text-[11px] font-bold text-slate-400 uppercase">Page {currentPage} of {Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE)}</p>
                   <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="h-9 px-4 rounded-lg font-bold text-xs border-slate-200">Previous</Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE), prev + 1))} disabled={currentPage === Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE)} className="h-9 px-4 rounded-lg font-bold text-xs border-slate-200">Next</Button>
                   </div>
                </div>
             )}
          </CardContent>
        </Card>
      </div>

      <AlumniDetailsDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} alumni={selectedAlumni} onEdit={handleEditAlumni} onDelete={handleDeleteAlumni} />
      <EditAlumniDialog isOpen={isEditOpen} onOpenChange={setIsEditOpen} alumni={selectedAlumni} onSave={handleUpdateAlumni} />
    </div>
  );
};

export default Dashboard;
