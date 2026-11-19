'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useAlumniData } from '@/hooks/useAlumniData';

export default function EmployersPage() {
  const { sortedCompanies, stats, loading } = useAlumniData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return sortedCompanies;
    return sortedCompanies.filter(([name]) => name.toLowerCase().includes(q));
  }, [sortedCompanies, searchTerm]);

  const saasCardClass =
    'bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a1b63]/20 border-t-[#2a1b63] animate-spin" />
          <p className="text-sm text-[#5F6368]">Loading employers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#1D1E20] tracking-tight">Employers</h1>
          <p className="text-sm text-[#5F6368] mt-1">
            {sortedCompanies.length} organizations and employers across {stats.totalAlumni} alumni profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/registrations">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
            >
              <Icon name="group" className="text-[18px] mr-2" />
              View All Registrations
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <Card className={saasCardClass}>
        <CardHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base text-[#1D1E20]">Organizations &amp; Employers</CardTitle>
            <CardDescription className="text-xs text-[#8A8F98] mt-0.5">
              Select any employer to view alumni working there
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Icon
              name="search"
              className="text-[18px] text-[#8A8F98] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employer..."
              className="pl-10 h-10 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {filteredCompanies.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#1D1E20]">No employers matched your search.</p>
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-xs text-[#2a1b63] hover:bg-[#F3F0FA]"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map(([company, count]) => (
                <Link
                  key={company}
                  href={`/dashboard/registrations?search=${encodeURIComponent(company)}`}
                  className="group p-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFF] hover:bg-[#F3F0FA] hover:border-[#DDD6F3] transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm text-[#1D1E20] group-hover:text-[#2a1b63] truncate">
                        {company}
                      </p>
                      <p className="text-xs text-[#5F6368] mt-0.5">
                        {count} {count === 1 ? 'alumnus' : 'alumni'}
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="chevron_right"
                    className="text-[20px] text-[#8A8F98] group-hover:text-[#2a1b63] shrink-0 transition-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
