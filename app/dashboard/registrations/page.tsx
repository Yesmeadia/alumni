'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GENDER_OPTIONS } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@/components/ui/icon';
import { useAlumniData, AlumniRecord } from '@/hooks/useAlumniData';
import AlumniTableRow from '@/components/Dashboard/AlumniTableRow';
import AlumniGridCard from '@/components/Dashboard/AlumniGridCard';
import AlumniDetailsDialog from '@/components/Dashboard/AlumniDetailsDialog';
import EditAlumniDialog from '@/components/Dashboard/EditAlumniDialog';
import ExportExcelDialog from '@/components/Dashboard/ExportExcelDialog';
import ImportExcelDialog from '@/components/Dashboard/ImportExcelDialog';
import RestoreStoragePhotosDialog from '@/components/Dashboard/RestoreStoragePhotosDialog';
import LoadingSpinner from '@/components/Dashboard/LoadingSpinner';

const ITEMS_PER_PAGE = 20;

function RegistrationsContent() {
  const searchParams = useSearchParams();
  const {
    alumniList,
    loading,
    sortedSchools,
    graduationYears,
    statesList,
    jobsList,
    updateAlumni,
    deleteAlumni,
  } = useAlumniData();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('batch') || 'all');
  const [selectedSchool, setSelectedSchool] = useState(searchParams.get('school') || 'all');
  const [selectedJob, setSelectedJob] = useState(searchParams.get('job') || 'all');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || 'all');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isRestorePhotosOpen, setIsRestorePhotosOpen] = useState(false);

  const filteredAlumni = useMemo(() => {
    let result = alumniList;
    if (selectedYear !== 'all') result = result.filter((a) => a.data.yearOfGraduation === selectedYear);
    if (selectedSchool !== 'all') result = result.filter((a) => a.data.schoolAttended === selectedSchool);
    if (selectedJob !== 'all') result = result.filter((a) => (a.data.currentJobTitle || '').trim() === selectedJob);
    if (selectedState !== 'all') result = result.filter((a) => a.data.state === selectedState);
    if (selectedGender !== 'all') {
      result = result.filter((a) => {
        const g = (a.data.gender || '').trim().toLowerCase();
        return selectedGender === 'unspecified' ? g === '' : g === selectedGender.toLowerCase();
      });
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.data.fullName?.toLowerCase().includes(term) ||
          a.data.schoolAttended?.toLowerCase().includes(term) ||
          a.data.currentJobTitle?.toLowerCase().includes(term) ||
          a.data.companyName?.toLowerCase().includes(term) ||
          a.data.state?.toLowerCase().includes(term) ||
          a.data.place?.toLowerCase().includes(term) ||
          a.data.mobileNumber?.includes(term)
      );
    }
    return result;
  }, [alumniList, selectedYear, selectedSchool, selectedJob, selectedGender, selectedState, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedSchool, selectedJob, selectedGender, selectedState]);

  const totalPages = Math.max(1, Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE));
  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedYear !== 'all' ||
    selectedSchool !== 'all' ||
    selectedJob !== 'all' ||
    selectedGender !== 'all' ||
    selectedState !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedYear('all');
    setSelectedSchool('all');
    setSelectedJob('all');
    setSelectedGender('all');
    setSelectedState('all');
  };

  const handleViewDetails = (alumni: AlumniRecord) => {
    setSelectedAlumni({ ...alumni.data, id: alumni.id });
    setIsDialogOpen(true);
  };

  const handleEditAlumni = (id: string) => {
    const found = alumniList.find((a) => a.id === id);
    if (found) {
      setSelectedAlumni({ ...found.data, id: found.id });
      setIsEditOpen(true);
    }
  };

  const handleUpdateAlumni = async (id: string, data: any) => {
    try {
      await updateAlumni(id, data);
      setIsEditOpen(false);
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    const safeId = typeof id === 'string' ? id.trim() : '';
    if (!safeId) {
      console.error('Blocked delete with empty alumni ID');
      return;
    }
    if (!window.confirm('Permanently delete this alumni profile?')) return;
    try {
      await deleteAlumni(safeId);
      setIsDialogOpen(false);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#1D1E20] tracking-tight">
            Alumni Registrations
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Search, filter, inspect, edit, and export all registered YES INDIA alumni.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsRestorePhotosOpen(true)}
            className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] text-sm"
          >
            <Icon name="photo_library" className="text-[18px] mr-2" />
            Restore Photos
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsImportOpen(true)}
            className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] text-sm"
          >
            <Icon name="upload_file" className="text-[18px] mr-2" />
            Import Excel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsExportOpen(true)}
            className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] text-sm"
          >
            <Icon name="table_view" className="text-[18px] mr-2" />
            Export Excel
          </Button>
          <Link href="/register">
            <Button
              type="button"
              className="h-11 px-5 rounded-xl bg-[#2a1b63] hover:bg-[#1f134c] text-white text-sm"
            >
              <Icon name="person_add" className="text-[18px] mr-2" />
              New Registration
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E5E7EB] space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Icon
                name="search"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8A8F98] pointer-events-none"
              />
              <Input
                placeholder="Search by name, school, job, company, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-[#FAFBFF] border-[#E5E7EB] rounded-xl text-sm focus:bg-white focus:border-[#2a1b63]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filter by batch"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-11 bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl px-3 text-xs text-[#1D1E20] outline-none focus:border-[#2a1b63]"
              >
                <option value="all">All Batches</option>
                {graduationYears.map((y) => (
                  <option key={y} value={y}>
                    Batch {y}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by school"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="h-11 max-w-[200px] bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl px-3 text-xs text-[#1D1E20] outline-none focus:border-[#2a1b63]"
              >
                <option value="all">All Schools</option>
                {sortedSchools.map(([s]) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by job"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="h-11 max-w-[170px] bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl px-3 text-xs text-[#1D1E20] outline-none focus:border-[#2a1b63]"
              >
                <option value="all">All Jobs</option>
                {jobsList.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="h-11 bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl px-3 text-xs text-[#1D1E20] outline-none focus:border-[#2a1b63]"
              >
                <option value="all">All Genders</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="unspecified">Not Specified</option>
              </select>

              <select
                aria-label="Filter by state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-11 bg-[#FAFBFF] border border-[#E5E7EB] rounded-xl px-3 text-xs text-[#1D1E20] outline-none focus:border-[#2a1b63]"
              >
                <option value="all">All States</option>
                {statesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <div className="bg-[#FAFBFF] border border-[#E5E7EB] p-1 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`h-9 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    viewMode === 'table'
                      ? 'bg-[#2a1b63] text-white'
                      : 'text-[#5F6368] hover:text-[#2a1b63]'
                  }`}
                >
                  <Icon name="view_list" className="text-[16px]" />
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#2a1b63] text-white'
                      : 'text-[#5F6368] hover:text-[#2a1b63]'
                  }`}
                >
                  <Icon name="grid_view" className="text-[16px]" />
                  Grid
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="text-[#5F6368]">
              Showing{' '}
              <span className="text-[#1D1E20]">
                {filteredAlumni.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>
              &ndash;
              <span className="text-[#1D1E20]">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredAlumni.length)}
              </span>{' '}
              of <span className="text-[#1D1E20]">{filteredAlumni.length}</span> records
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3F0FA] text-[#2a1b63] hover:bg-[#2a1b63] hover:text-white transition-colors"
              >
                <Icon name="close" className="text-[14px]" />
                Reset filters
              </button>
            )}
          </div>
        </div>

        {filteredAlumni.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center mx-auto mb-3">
              <Icon name="group" className="text-[24px]" />
            </div>
            <h3 className="text-base text-[#1D1E20]">No records found</h3>
            <p className="text-sm text-[#5F6368] mt-1">
              Try adjusting your search or resetting active filters.
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#FAFBFF]">
                <TableRow className="hover:bg-transparent border-[#E5E7EB]">
                  <TableHead className="py-3.5 pl-5 text-[11px] uppercase tracking-wider text-[#8A8F98]">
                    Alumni
                  </TableHead>
                  <TableHead className="py-3.5 text-[11px] uppercase tracking-wider text-[#8A8F98]">
                    Institution
                  </TableHead>
                  <TableHead className="py-3.5 text-[11px] uppercase tracking-wider text-[#8A8F98] text-center">
                    Batch
                  </TableHead>
                  <TableHead className="py-3.5 text-[11px] uppercase tracking-wider text-[#8A8F98]">
                    Career
                  </TableHead>
                  <TableHead className="py-3.5 text-[11px] uppercase tracking-wider text-[#8A8F98]">
                    Location
                  </TableHead>
                  <TableHead className="py-3.5 pr-5 text-[11px] uppercase tracking-wider text-[#8A8F98] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAlumni.map((alumni, index) => (
                  <AlumniTableRow
                    key={alumni.id}
                    alumni={{ ...alumni.data, id: alumni.id }}
                    index={index}
                    onClick={() => handleViewDetails(alumni)}
                    onEdit={handleEditAlumni}
                    onDelete={handleDeleteAlumni}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedAlumni.map((alumni, index) => (
              <AlumniGridCard
                key={alumni.id}
                alumni={{ ...alumni.data, id: alumni.id }}
                index={index}
                onClick={() => handleViewDetails(alumni)}
              />
            ))}
          </div>
        )}

        {filteredAlumni.length > 0 && (
          <div className="px-5 sm:px-6 py-4 border-t border-[#E5E7EB] bg-[#FAFBFF] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#5F6368]">
              Page <span className="text-[#1D1E20]">{currentPage}</span> of{' '}
              <span className="text-[#1D1E20]">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9 px-4 rounded-xl text-xs border-[#E5E7EB]"
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-4 rounded-xl text-xs border-[#E5E7EB]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlumniDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        alumni={selectedAlumni}
        onEdit={handleEditAlumni}
        onDelete={handleDeleteAlumni}
      />
      <EditAlumniDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        alumni={selectedAlumni}
        onSave={handleUpdateAlumni}
      />
      <ExportExcelDialog
        isOpen={isExportOpen}
        onOpenChange={setIsExportOpen}
        alumniList={alumniList}
        initialFilters={{
          batch: selectedYear,
          school: selectedSchool,
          job: selectedJob,
          gender: selectedGender,
          state: selectedState,
        }}
      />
      <ImportExcelDialog isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
      <RestoreStoragePhotosDialog
        isOpen={isRestorePhotosOpen}
        onOpenChange={setIsRestorePhotosOpen}
        alumniList={alumniList}
      />
    </div>
  );
}

export default function RegistrationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegistrationsContent />
    </Suspense>
  );
}
