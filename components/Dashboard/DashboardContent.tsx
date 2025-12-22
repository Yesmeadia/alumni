'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import { AlumniWithId } from './types';
import DashboardLoading from './LoadingSpinner';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './StatsCard';
import DashboardAlumniDirectory from './DashboardAlumniDirectory';
import AlumniDetailsDialog from './AlumniDetailsDialog';

const DashboardContent = () => {
  const [alumniList, setAlumniList] = useState<AlumniWithId[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        const alumniArray: AlumniWithId[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as AlumniData),
        }));

        setAlumniList(alumniArray);
        setFilteredAlumni(alumniArray);

        const uniqueSchools = new Set(alumniArray.map((a) => a.schoolAttended)).size;
        const uniqueCompanies = new Set(alumniArray.map((a) => a.companyName)).size;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = alumniArray.filter((a) => {
          const createdAt = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          return createdAt > thirtyDaysAgo;
        }).length;

        setStats({
          totalAlumni: alumniArray.length,
          totalSchools: uniqueSchools,
          totalCompanies: uniqueCompanies,
          recentRegistrations: recentCount,
        });
      }
      setLoading(false);
    });

    return () => off(alumniRef, 'value', unsubscribe);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAlumni(alumniList);
    } else {
      const filtered = alumniList.filter(
        (alumni) =>
          alumni.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.schoolAttended?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.place?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlumni(filtered);
    }
  }, [searchTerm, alumniList]);

  const handleViewDetails = (alumni: AlumniWithId) => {
    setSelectedAlumni(alumni);
    setIsDialogOpen(true);
  };

  const handleExportData = () => {
    const headers = [
      'Full Name',
      'Mobile',
      'WhatsApp',
      'Place',
      'State',
      'School',
      'Batch',
      'Last Class',
      'Current Job',
      'Company',
      'Qualification',
    ];

    const csvData = filteredAlumni.map((alumni) => [
      alumni.fullName,
      alumni.mobileNumber,
      alumni.whatsappNumber,
      alumni.place,
      alumni.state,
      alumni.schoolAttended,
      alumni.yearOfGraduation,
      alumni.lastClassAttended === 'Other' ? alumni.otherClass : alumni.lastClassAttended,
      alumni.currentJobTitle,
      alumni.companyName,
      alumni.qualification,
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yes-india-alumni-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <DashboardStats stats={stats} />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <DashboardAlumniDirectory
            alumniList={filteredAlumni}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onExport={handleExportData}
            onViewDetails={handleViewDetails}
          />
        </motion.div>
      </div>

      <AlumniDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        alumni={selectedAlumni}
      />
    </div>
  );
};

export default DashboardContent;