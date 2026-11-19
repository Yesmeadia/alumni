'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AlumniData, GENDER_OPTIONS } from '@/lib/types';
import {
  exportAlumniToExcel,
  exportAlumniToCSV,
  buildExportFilename,
  AlumniExportFilters,
} from '@/utils/exportData';

interface AlumniEntry {
  id: string;
  data: AlumniData;
}

interface ExportExcelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alumniList: AlumniEntry[];
  initialFilters?: AlumniExportFilters;
}

export default function ExportExcelDialog({
  isOpen,
  onOpenChange,
  alumniList,
  initialFilters,
}: ExportExcelDialogProps) {
  const [batch, setBatch] = useState('all');
  const [school, setSchool] = useState('all');
  const [job, setJob] = useState('all');
  const [gender, setGender] = useState('all');
  const [state, setState] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [exporting, setExporting] = useState(false);

  // Sync with dashboard's active filters whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      setBatch(initialFilters?.batch || 'all');
      setSchool(initialFilters?.school || 'all');
      setJob(initialFilters?.job || 'all');
      setGender(initialFilters?.gender || 'all');
      setState(initialFilters?.state || 'all');
      setIndustry(initialFilters?.industry || 'all');
    }
  }, [isOpen, initialFilters]);

  const filterOptions = useMemo(() => {
    const batches = new Set<string>();
    const schools = new Set<string>();
    const jobs = new Set<string>();
    const states = new Set<string>();
    const industries = new Set<string>();

    alumniList.forEach(({ data }) => {
      if (data.yearOfGraduation) batches.add(data.yearOfGraduation);
      if (data.schoolAttended) schools.add(data.schoolAttended);
      if (data.currentJobTitle) jobs.add(data.currentJobTitle.trim());
      if (data.state) states.add(data.state);
      if (data.industry) industries.add(data.industry.trim());
    });

    return {
      batches: Array.from(batches).sort().reverse(),
      schools: Array.from(schools).sort(),
      jobs: Array.from(jobs).sort((a, b) => a.localeCompare(b)),
      states: Array.from(states).sort(),
      industries: Array.from(industries).sort((a, b) => a.localeCompare(b)),
    };
  }, [alumniList]);

  const matchedAlumni = useMemo(() => {
    return alumniList.filter(({ data }) => {
      if (batch !== 'all' && data.yearOfGraduation !== batch) return false;
      if (school !== 'all' && data.schoolAttended !== school) return false;
      if (job !== 'all' && (data.currentJobTitle || '').trim() !== job) return false;
      if (state !== 'all' && data.state !== state) return false;
      if (industry !== 'all' && (data.industry || '').trim() !== industry) return false;
      if (gender !== 'all') {
        const g = (data.gender || '').trim().toLowerCase();
        if (gender === 'unspecified') {
          if (g !== '') return false;
        } else if (g !== gender.toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }, [alumniList, batch, school, job, gender, state, industry]);

  const resetFilters = () => {
    setBatch('all');
    setSchool('all');
    setJob('all');
    setGender('all');
    setState('all');
    setIndustry('all');
  };

  const currentFilters: AlumniExportFilters = { batch, school, job, gender, state, industry };

  const handleDownloadExcel = async () => {
    if (matchedAlumni.length === 0) return;
    setExporting(true);
    try {
      const records = matchedAlumni.map((a) => ({ id: a.id, ...a.data }));
      const filename = buildExportFilename(currentFilters);
      await exportAlumniToExcel(records, filename);
      onOpenChange(false);
    } catch (err) {
      console.error('Excel export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadCSV = () => {
    if (matchedAlumni.length === 0) return;
    const records = matchedAlumni.map((a) => ({ id: a.id, ...a.data }));
    const filename = buildExportFilename(currentFilters);
    exportAlumniToCSV(records, filename);
    onOpenChange(false);
  };

  const selectClass =
    'w-full h-10 bg-[#faf9f6] border border-gray-200 rounded-lg px-3 text-sm text-[#212529] outline-none focus:border-[#2a1b63] focus:bg-white transition-colors';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="bg-[#2a1b63] px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-white">
              Export Alumni Data
            </DialogTitle>
            <DialogDescription className="text-xs text-white/75 mt-1">
              Filter records by batch, school, job, gender, state, or industry before downloading.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Filter Controls */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Batch / Year
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className={selectClass}
              >
                <option value="all">All Batches</option>
                {filterOptions.batches.map((y) => (
                  <option key={y} value={y}>
                    Batch {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={selectClass}
              >
                <option value="all">All Genders</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="unspecified">Not Specified</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                School / Institution
              </label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={selectClass}
              >
                <option value="all">All Institutions</option>
                {filterOptions.schools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Job Title / Role
              </label>
              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className={selectClass}
              >
                <option value="all">All Job Titles</option>
                {filterOptions.jobs.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className={selectClass}
              >
                <option value="all">All Industries</option>
                {filterOptions.industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={selectClass}
              >
                <option value="all">All States</option>
                {filterOptions.states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Match Summary */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f7f4ed] border-l-4 border-[#a5874c]">
            <p className="text-sm text-[#212529]">
              <span className="font-bold text-[#2a1b63]">{matchedAlumni.length}</span> of{' '}
              <span className="font-semibold">{alumniList.length}</span> records match your filters
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#2a1b63] hover:text-[#a5874c] transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadCSV}
              disabled={matchedAlumni.length === 0 || exporting}
              className="w-full sm:w-auto border-gray-300 text-[#212529] hover:border-[#2a1b63] hover:text-[#2a1b63] rounded-lg"
            >
              <Icon name="description" className="mr-1.5 text-[16px]" />
              Download CSV
            </Button>
            <Button
              type="button"
              onClick={handleDownloadExcel}
              disabled={matchedAlumni.length === 0 || exporting}
              className="w-full sm:w-auto bg-[#2a1b63] hover:bg-[#1f134c] text-white rounded-lg px-6"
            >
              {exporting ? (
                <Icon name="progress_activity" className="mr-2 text-[16px] animate-spin" />
              ) : (
                <Icon name="table_view" className="mr-2 text-[16px]" />
              )}
              Download Excel (.xlsx)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
