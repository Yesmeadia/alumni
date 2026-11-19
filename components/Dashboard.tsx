'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icon } from '@/components/ui/icon';
import { useAlumniData, AlumniRecord } from '@/hooks/useAlumniData';
import StatsCard from './Dashboard/StatsCard';
import AlumniTableRow from './Dashboard/AlumniTableRow';
import AlumniDetailsDialog from './Dashboard/AlumniDetailsDialog';
import LoadingSpinner from './Dashboard/LoadingSpinner';
import EditAlumniDialog from './Dashboard/EditAlumniDialog';
import ExportExcelDialog from './Dashboard/ExportExcelDialog';

const saasCardClass =
  'bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden';

export default function Dashboard() {
  const router = useRouter();
  const { alumniList, loading, stats, sortedSchools, sortedCompanies, updateAlumni, deleteAlumni } =
    useAlumniData();

  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

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
    if (!window.confirm('Permanently delete this alumni profile?')) return;
    try {
      await deleteAlumni(id);
      setIsDialogOpen(false);
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-7">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#1D1E20] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Real-time alumni registry metrics, institutions, and employer distribution.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsExportOpen(true)}
            className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] hover:border-[#DDD6F3] text-sm"
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Total Alumni"
          value={stats.totalAlumni}
          icon={<Icon name="group" />}
          description="Verified registry entries"
          badge="Live"
          color="indigo"
          index={0}
          onClick={() => router.push('/dashboard/registrations')}
        />
        <StatsCard
          title="Institutions"
          value={stats.totalSchools}
          icon={<Icon name="school" />}
          description="YES INDIA schools represented"
          color="blue"
          index={1}
          onClick={() => router.push('/dashboard/institutions')}
        />
        <StatsCard
          title="Employers"
          value={stats.totalCompanies}
          icon={<Icon name="business_center" />}
          description="Active organizations"
          color="amber"
          index={2}
          onClick={() => router.push('/dashboard/employers')}
        />
        <StatsCard
          title="Last 30 Days"
          value={stats.recentRegistrations}
          icon={<Icon name="trending_up" />}
          description="New alumni joined"
          badge="30d"
          color="green"
          index={3}
          onClick={() => router.push('/dashboard/registrations')}
        />
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={saasCardClass}>
          <CardHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-[#1D1E20]">Top Institutions</CardTitle>
              <CardDescription className="text-xs text-[#8A8F98]">
                Click any school to inspect its alumni
              </CardDescription>
            </div>
            <Link href="/dashboard/institutions" className="text-xs text-[#2a1b63] hover:underline">
              View all &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {sortedSchools.slice(0, 6).map(([name, count]) => (
              <Link
                key={name}
                href={`/dashboard/registrations?school=${encodeURIComponent(name)}`}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAFBFF] hover:bg-[#F3F0FA] border border-transparent hover:border-[#DDD6F3] transition-colors"
              >
                <span className="text-sm text-[#1D1E20] truncate pr-3">{name}</span>
                <span className="text-xs text-[#2a1b63] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E7EB] shrink-0">
                  {count}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className={saasCardClass}>
          <CardHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-[#1D1E20]">Major Employers</CardTitle>
              <CardDescription className="text-xs text-[#8A8F98]">
                Click any organization to filter registrations
              </CardDescription>
            </div>
            <Link href="/dashboard/employers" className="text-xs text-[#2a1b63] hover:underline">
              View all &rarr;
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {sortedCompanies.slice(0, 6).map(([name, count]) => (
              <Link
                key={name}
                href={`/dashboard/registrations?search=${encodeURIComponent(name)}`}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAFBFF] hover:bg-[#F3F0FA] border border-transparent hover:border-[#DDD6F3] transition-colors"
              >
                <span className="text-sm text-[#1D1E20] truncate pr-3">{name}</span>
                <span className="text-xs text-[#2a1b63] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E7EB] shrink-0">
                  {count}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Registrations Table */}
      <Card className={saasCardClass}>
        <CardHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-[#1D1E20]">Recent Registrations</CardTitle>
            <CardDescription className="text-xs text-[#8A8F98]">
              Latest 8 alumni added to the registry
            </CardDescription>
          </div>
          <Link href="/dashboard/registrations">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl text-xs border-[#E5E7EB] text-[#2a1b63] hover:bg-[#F3F0FA]"
            >
              View All &rarr;
            </Button>
          </Link>
        </CardHeader>
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
              {alumniList.slice(0, 8).map((alumni, idx) => (
                <AlumniTableRow
                  key={alumni.id}
                  alumni={{ id: alumni.id, ...alumni.data }}
                  index={idx}
                  onClick={() => handleViewDetails(alumni)}
                  onEdit={handleEditAlumni}
                  onDelete={handleDeleteAlumni}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Modals */}
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
      />
    </div>
  );
}
