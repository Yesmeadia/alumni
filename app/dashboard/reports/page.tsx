'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/ui/icon';
import { useAlumniData } from '@/hooks/useAlumniData';
import {
  exportAlumniToExcel,
  exportAlumniToCSV,
  buildExportFilename,
  AlumniWithId,
} from '@/utils/exportData';

export default function ReportsPage() {
  const {
    alumniList,
    loading,
    sortedSchools,
    graduationYears,
    statesList,
    jobsList,
    industriesList,
  } = useAlumniData();

  const [batch, setBatch] = useState('all');
  const [gender, setGender] = useState('all');
  const [school, setSchool] = useState('all');
  const [job, setJob] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  const filteredRecords = useMemo(() => {
    return alumniList.filter(({ data }) => {
      if (batch !== 'all' && data.yearOfGraduation !== batch) return false;
      if (gender !== 'all') {
        const g = (data.gender || '').trim().toLowerCase();
        if (gender === 'unspecified') {
          if (g) return false;
        } else if (g !== gender.toLowerCase()) {
          return false;
        }
      }
      if (school !== 'all' && data.schoolAttended !== school) return false;
      if (job !== 'all' && (data.currentJobTitle || '').trim() !== job) return false;
      if (industry !== 'all' && (data.industry || '').trim() !== industry) return false;
      if (stateFilter !== 'all' && data.state !== stateFilter) return false;
      return true;
    });
  }, [alumniList, batch, gender, school, job, industry, stateFilter]);

  const hasActiveFilters =
    batch !== 'all' ||
    gender !== 'all' ||
    school !== 'all' ||
    job !== 'all' ||
    industry !== 'all' ||
    stateFilter !== 'all';

  const handleReset = () => {
    setBatch('all');
    setGender('all');
    setSchool('all');
    setJob('all');
    setIndustry('all');
    setStateFilter('all');
  };

  const buildPayload = (): { list: AlumniWithId[]; filename: string } => {
    const list: AlumniWithId[] = filteredRecords.map((item) => ({
      ...item.data,
      id: item.id,
    }));
    const filename = buildExportFilename({
      batch,
      gender,
      school,
      job,
      industry,
      state: stateFilter,
    });
    return { list, filename };
  };

  const handleExportExcel = async () => {
    if (filteredRecords.length === 0) return;
    setExporting(true);
    try {
      const { list, filename } = buildPayload();
      await exportAlumniToExcel(list, filename);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;
    const { list, filename } = buildPayload();
    exportAlumniToCSV(list, filename);
  };

  const saasCardClass =
    'bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a1b63]/20 border-t-[#2a1b63] animate-spin" />
          <p className="text-sm text-[#5F6368]">Loading export builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#1D1E20] tracking-tight">
            Reports &amp; Export
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Filter alumni records by batch, gender, school, job, industry, or state and download as Excel or CSV.
          </p>
        </div>

        <Link href="/dashboard/registrations">
          <Button
            variant="outline"
            className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
          >
            <Icon name="group" className="text-[18px] mr-2" />
            Open Registry
          </Button>
        </Link>
      </div>

      {/* Filter Builder Card */}
      <Card className={saasCardClass}>
        <CardHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base text-[#1D1E20]">Export Filters</CardTitle>
            <CardDescription className="text-xs text-[#8A8F98] mt-0.5">
              Combine any filters below to generate a targeted spreadsheet
            </CardDescription>
          </div>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-[#2a1b63] hover:bg-[#F3F0FA] self-start sm:self-auto"
            >
              <Icon name="restart_alt" className="text-[16px] mr-1.5" />
              Reset Filters
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Batch */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#5F6368]">Batch / Graduation Year</Label>
              <Select value={batch} onValueChange={setBatch}>
                <SelectTrigger className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {graduationYears.map((yr) => (
                    <SelectItem key={yr} value={yr}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#5F6368]">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="unspecified">Not Specified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* School */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#5F6368]">School / Institution</Label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                  <SelectValue placeholder="All Schools" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {sortedSchools.map(([schoolName]) => (
                    <SelectItem key={schoolName} value={schoolName}>
                      {schoolName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#5F6368]">Job Title</Label>
              <Select value={job} onValueChange={setJob}>
                <SelectTrigger className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                  <SelectValue placeholder="All Job Titles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Titles</SelectItem>
                  {jobsList.map((j) => (
                    <SelectItem key={j} value={j}>
                      {j}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#5F6368]">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industriesList.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#5F6368]">State</Label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {statesList.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-[#1D1E20]">
                  {filteredRecords.length} matching {filteredRecords.length === 1 ? 'record' : 'records'}
                </p>
                <p className="text-xs text-[#8A8F98]">
                  Out of {alumniList.length} total alumni profiles
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleExportCSV}
                disabled={filteredRecords.length === 0 || exporting}
                className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
              >
                <Icon name="description" className="text-[18px] mr-2" />
                Download CSV
              </Button>
              <Button
                type="button"
                onClick={handleExportExcel}
                disabled={filteredRecords.length === 0 || exporting}
                className="h-10 px-5 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-white"
              >
                <Icon name="download" className="text-[18px] mr-2" />
                {exporting ? 'Generating...' : 'Download Excel (.xlsx)'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      <Card className={saasCardClass}>
        <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
          <CardTitle className="text-base text-[#1D1E20]">Export Preview</CardTitle>
          <CardDescription className="text-xs text-[#8A8F98] mt-0.5">
            Showing up to the first 10 matching alumni records
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRecords.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#5F6368]">
              No alumni match the selected filters. Adjust your criteria to preview and export data.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#FAFBFF] text-xs text-[#5F6368]">
                    <th className="py-3.5 px-6">Full Name</th>
                    <th className="py-3.5 px-4">Gender</th>
                    <th className="py-3.5 px-4">Batch</th>
                    <th className="py-3.5 px-4">School</th>
                    <th className="py-3.5 px-4">Job Title</th>
                    <th className="py-3.5 px-4">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/70 text-sm">
                  {filteredRecords.slice(0, 10).map(({ id, data }) => (
                    <tr key={id} className="hover:bg-[#FAFBFF] transition-colors">
                      <td className="py-3.5 px-6 text-[#1D1E20]">
                        <Link
                          href={`/alumni/${id}`}
                          className="hover:text-[#2a1b63] transition-colors"
                        >
                          {data.fullName || '—'}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6368]">{data.gender || '—'}</td>
                      <td className="py-3.5 px-4 text-[#5F6368]">{data.yearOfGraduation || '—'}</td>
                      <td className="py-3.5 px-4 text-[#5F6368] max-w-[240px] truncate">
                        {data.schoolAttended || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6368] max-w-[200px] truncate">
                        {data.currentJobTitle || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-[#5F6368]">{data.state || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
