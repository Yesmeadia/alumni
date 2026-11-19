'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import {
  JOB_TYPE_OPTIONS,
  JobApplicationStatus,
} from '@/lib/types';
import { useJobApplications, JobApplicationRecord } from '@/hooks/useJobApplications';

const STATUS_META: Record<
  JobApplicationStatus,
  { label: string; pillClass: string; dotClass: string }
> = {
  pending: {
    label: 'Pending',
    pillClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
    dotClass: 'bg-[#D97706]',
  },
  reviewed: {
    label: 'Reviewed',
    pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    dotClass: 'bg-[#2563EB]',
  },
  shortlisted: {
    label: 'Shortlisted',
    pillClass: 'bg-[#ECFDF5] text-[#16A34A] border-[#A7F3D0]',
    dotClass: 'bg-[#16A34A]',
  },
  rejected: {
    label: 'Rejected',
    pillClass: 'bg-red-50 text-[#DC2626] border-red-200',
    dotClass: 'bg-[#DC2626]',
  },
};

export default function JobApplicationsPage() {
  const {
    applications,
    loading,
    counts,
    updateApplicationStatus,
    deleteApplication,
  } = useJobApplications();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<JobApplicationRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return applications.filter(({ data }) => {
      if (statusFilter !== 'all' && (data.status || 'pending') !== statusFilter) return false;
      if (jobTypeFilter !== 'all' && data.jobType !== jobTypeFilter) return false;
      if (!q) return true;
      return (
        (data.fullName || '').toLowerCase().includes(q) ||
        (data.mobileNumber || '').toLowerCase().includes(q) ||
        (data.positionApplied || '').toLowerCase().includes(q) ||
        (data.preferredLocation || '').toLowerCase().includes(q) ||
        (data.skills || '').toLowerCase().includes(q) ||
        (data.schoolAttended || '').toLowerCase().includes(q)
      );
    });
  }, [applications, searchTerm, statusFilter, jobTypeFilter]);

  const formatDate = (dateInput?: string | number) => {
    if (!dateInput) return '—';
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const handleStatusChange = async (id: string, nextStatus: JobApplicationStatus) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, nextStatus);
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord({
          ...selectedRecord,
          data: { ...selectedRecord.data, status: nextStatus },
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job application?'
    );
    if (!confirmed) return;
    await deleteApplication(id);
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  const saasCardClass =
    'bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a1b63]/20 border-t-[#2a1b63] animate-spin" />
          <p className="text-sm text-[#5F6368]">Loading job applications...</p>
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
            Job Applications
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Review career applications submitted by registered YES INDIA alumni.
          </p>
        </div>

        <Link href="/jobs" target="_blank">
          <Button
            variant="outline"
            className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
          >
            <Icon name="open_in_new" className="text-[17px] mr-2" />
            Open Public Form
          </Button>
        </Link>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${saasCardClass} p-5 flex items-center gap-4`}>
          <div className="h-11 w-11 rounded-xl bg-[#F3F0FA] text-[#2a1b63] border border-[#DDD6F3]/70 flex items-center justify-center shrink-0">
            <Icon name="work" className="text-[22px]" />
          </div>
          <div>
            <p className="text-xs text-[#8A8F98]">Total Applications</p>
            <p className="text-2xl text-[#1D1E20] mt-0.5">{counts.total}</p>
          </div>
        </div>

        <div className={`${saasCardClass} p-5 flex items-center gap-4`}>
          <div className="h-11 w-11 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]/70 flex items-center justify-center shrink-0">
            <Icon name="hourglass_top" className="text-[22px]" />
          </div>
          <div>
            <p className="text-xs text-[#8A8F98]">Pending Review</p>
            <p className="text-2xl text-[#1D1E20] mt-0.5">{counts.pending}</p>
          </div>
        </div>

        <div className={`${saasCardClass} p-5 flex items-center gap-4`}>
          <div className="h-11 w-11 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]/70 flex items-center justify-center shrink-0">
            <Icon name="check_circle" className="text-[22px]" />
          </div>
          <div>
            <p className="text-xs text-[#8A8F98]">Shortlisted</p>
            <p className="text-2xl text-[#1D1E20] mt-0.5">{counts.shortlisted}</p>
          </div>
        </div>

        <div className={`${saasCardClass} p-5 flex items-center gap-4`}>
          <div className="h-11 w-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/70 flex items-center justify-center shrink-0">
            <Icon name="fact_check" className="text-[22px]" />
          </div>
          <div>
            <p className="text-xs text-[#8A8F98]">Reviewed</p>
            <p className="text-2xl text-[#1D1E20] mt-0.5">{counts.reviewed}</p>
          </div>
        </div>
      </div>

      {/* Applications Table Card */}
      <Card className={saasCardClass}>
        <CardHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-base text-[#1D1E20]">Submitted Applications</CardTitle>
            <CardDescription className="text-xs text-[#8A8F98] mt-0.5">
              Showing {filteredApplications.length} of {applications.length} applications
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Icon
                name="search"
                className="text-[18px] text-[#8A8F98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, mobile, role..."
                className="pl-10 h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-36 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="h-10 w-36 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                {JOB_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredApplications.length === 0 ? (
            <div className="py-14 px-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center mx-auto mb-3">
                <Icon name="work_off" className="text-[24px]" />
              </div>
              <p className="text-sm text-[#1D1E20]">No job applications found.</p>
              <p className="text-xs text-[#8A8F98] mt-1">
                Applications submitted through the public Job Application page will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#FAFBFF] text-xs text-[#5F6368]">
                    <th className="py-3.5 px-6">Applicant</th>
                    <th className="py-3.5 px-4">Position &amp; Type</th>
                    <th className="py-3.5 px-4">Location &amp; Exp.</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Resume</th>
                    <th className="py-3.5 px-4">Applied On</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/70 text-sm">
                  {filteredApplications.map((record) => {
                    const { id, data } = record;
                    const statusKey = (data.status || 'pending') as JobApplicationStatus;
                    const meta = STATUS_META[statusKey] || STATUS_META.pending;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-[#FAFBFF] transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <Avatar className="h-10 w-10 rounded-xl border border-[#E5E7EB] shrink-0">
                              <AvatarImage src={data.photoURL || undefined} className="object-cover" />
                              <AvatarFallback className="rounded-xl bg-[#F3F0FA] text-[#2a1b63] text-xs">
                                {data.fullName?.charAt(0) || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm text-[#1D1E20] truncate">{data.fullName}</p>
                              <p className="text-xs text-[#8A8F98] truncate max-w-[200px]">
                                {data.schoolAttended || 'YES INDIA'}
                                {data.yearOfGraduation ? ` · ${data.yearOfGraduation}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <p className="text-sm text-[#1D1E20]">{data.positionApplied}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-[#F3F0FA] text-[#2a1b63] text-[11px]">
                            {data.jobType}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm text-[#1D1E20]">{data.preferredLocation || '—'}</p>
                            {data.willingForAbroad === 'Yes' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-[11px]">
                                <Icon name="public" className="text-[12px]" />
                                Abroad OK
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#8A8F98] mt-0.5">
                            {data.experienceYears || 'Fresher'}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <p className="text-sm text-[#1D1E20]">{data.mobileNumber || '—'}</p>
                          {data.email && (
                            <p className="text-xs text-[#8A8F98] truncate max-w-[180px]">
                              {data.email}
                            </p>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {data.resumeURL ? (
                            <a
                              href={data.resumeURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={data.resumeFileName || 'Open Resume'}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F3F0FA] border border-[#DDD6F3] text-xs text-[#2a1b63] hover:bg-[#2a1b63] hover:text-white transition-colors whitespace-nowrap"
                            >
                              <Icon name="description" className="text-[15px]" />
                              <span className="max-w-[110px] truncate">
                                {data.resumeFileName || 'Resume'}
                              </span>
                            </a>
                          ) : (
                            <span className="text-xs text-[#8A8F98]">Not uploaded</span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-xs text-[#5F6368] whitespace-nowrap">
                          {formatDate(data.appliedAt || data.createdAt)}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${meta.pillClass}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                            {meta.label}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRecord(record)}
                              className="h-8 px-3 rounded-lg border-[#E5E7EB] text-xs text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
                            >
                              <Icon name="visibility" className="text-[16px] mr-1" />
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(id)}
                              title="Delete application"
                              className="h-8 w-8 p-0 rounded-lg text-[#8A8F98] hover:text-[#DC2626] hover:bg-red-50"
                            >
                              <Icon name="delete" className="text-[18px]" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      {selectedRecord && (
        <Dialog
          open={Boolean(selectedRecord)}
          onOpenChange={(open) => !open && setSelectedRecord(null)}
        >
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-[780px] w-[95vw] p-0 overflow-hidden border border-[#E5E7EB] bg-[#FAFBFF] rounded-[20px] shadow-2xl max-h-[90vh] flex flex-col"
          >
            <DialogTitle className="sr-only">
              Job Application — {selectedRecord.data.fullName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Application details for {selectedRecord.data.positionApplied}
            </DialogDescription>

            <div className="h-1.5 w-full bg-[#2a1b63] shrink-0" />

            {/* Modal Header */}
            <div className="bg-white border-b border-[#E5E7EB] px-6 py-5 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14 rounded-2xl border border-[#E5E7EB] shrink-0">
                  <AvatarImage
                    src={selectedRecord.data.photoURL || undefined}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-2xl bg-[#F3F0FA] text-[#2a1b63] text-lg">
                    {selectedRecord.data.fullName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="text-lg text-[#1D1E20] truncate">
                    {selectedRecord.data.fullName}
                  </h2>
                  <p className="text-xs text-[#5F6368] truncate">
                    Applied for <span className="text-[#2a1b63]">{selectedRecord.data.positionApplied}</span> ·{' '}
                    {selectedRecord.data.jobType}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRecord(null)}
                className="h-9 w-9 p-0 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA]"
              >
                <Icon name="close" className="text-[20px]" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Status Update Bar */}
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-[#5F6368]">
                  Application Status
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(['pending', 'reviewed', 'shortlisted', 'rejected'] as JobApplicationStatus[]).map(
                    (st) => {
                      const active = (selectedRecord.data.status || 'pending') === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={updatingId === selectedRecord.id}
                          onClick={() => handleStatusChange(selectedRecord.id, st)}
                          className={`px-3 py-1.5 rounded-xl text-xs border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#2a1b63] text-white border-[#2a1b63]'
                              : 'bg-[#FAFBFF] text-[#5F6368] border-[#E5E7EB] hover:bg-[#F3F0FA] hover:text-[#2a1b63]'
                          }`}
                        >
                          {STATUS_META[st].label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Job Details Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#8A8F98]">Position Applied</p>
                  <p className="text-[#1D1E20] mt-0.5">{selectedRecord.data.positionApplied}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Job Type</p>
                  <p className="text-[#1D1E20] mt-0.5">{selectedRecord.data.jobType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Preferred Location</p>
                  <p className="text-[#1D1E20] mt-0.5">
                    {selectedRecord.data.preferredLocation || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Willing to Work Abroad</p>
                  <p className="text-[#1D1E20] mt-0.5">
                    {selectedRecord.data.willingForAbroad || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Experience</p>
                  <p className="text-[#1D1E20] mt-0.5">
                    {selectedRecord.data.experienceYears || 'Fresher'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Expected Salary / CTC</p>
                  <p className="text-[#1D1E20] mt-0.5">
                    {selectedRecord.data.expectedSalary || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Notice Period</p>
                  <p className="text-[#1D1E20] mt-0.5">
                    {selectedRecord.data.noticePeriod || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Mobile / WhatsApp</p>
                  <p className="text-[#1D1E20] mt-0.5">
                    {selectedRecord.data.mobileNumber || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8F98]">Email</p>
                  <p className="text-[#1D1E20] mt-0.5 truncate">
                    {selectedRecord.data.email || '—'}
                  </p>
                </div>
              </div>

              {/* Skills & Cover Note */}
              <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 space-y-4">
                {selectedRecord.data.skills && (
                  <div>
                    <p className="text-xs text-[#8A8F98] mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.data.skills
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl bg-[#FAFBFF] border border-[#E5E7EB] text-xs text-[#1D1E20]"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {selectedRecord.data.coverNote && (
                  <div>
                    <p className="text-xs text-[#8A8F98] mb-1.5">Cover Note</p>
                    <p className="text-sm text-[#1D1E20] leading-relaxed whitespace-pre-wrap">
                      {selectedRecord.data.coverNote}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E5E7EB]/70">
                  <p className="text-xs text-[#8A8F98] mb-2">Uploaded Resume / CV</p>
                  {selectedRecord.data.resumeURL ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FAFBFF] border border-[#E5E7EB]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center shrink-0">
                          <Icon name="description" className="text-[19px]" />
                        </div>
                        <p className="text-sm text-[#1D1E20] truncate">
                          {selectedRecord.data.resumeFileName || 'Applicant_Resume'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={selectedRecord.data.resumeURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] transition-colors"
                        >
                          <Icon name="open_in_new" className="text-[15px]" />
                          <span>View</span>
                        </a>
                        <a
                          href={selectedRecord.data.resumeURL}
                          download={selectedRecord.data.resumeFileName || 'resume'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a1b63] text-xs text-white hover:bg-[#2a1b63]/90 transition-colors"
                        >
                          <Icon name="download" className="text-[15px]" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8A8F98]">No resume uploaded with this application.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex items-center justify-between gap-3 shrink-0">
              {selectedRecord.data.alumniId ? (
                <Link
                  href={`/alumni/${selectedRecord.data.alumniId}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#2a1b63] hover:underline"
                >
                  <Icon name="person" className="text-[16px]" />
                  <span>View Alumni Profile</span>
                </Link>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() => handleDelete(selectedRecord.id)}
                className="inline-flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-red-700"
              >
                <Icon name="delete" className="text-[16px]" />
                <span>Delete Application</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
