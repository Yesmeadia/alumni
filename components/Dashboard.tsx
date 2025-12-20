'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  GraduationCap,
  Building2,
  MapPin,
  Phone,
  Linkedin,
  Search,
  Download,
  Loader2,
  Calendar,
  School,
  TrendingUp,
  Eye,
  Grid3x3,
  List,
  Facebook,
  Instagram,
  Twitter,
  Briefcase,
} from 'lucide-react';

interface AlumniWithId extends AlumniData {
  id: string;
}

const Dashboard = () => {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-blue-400 opacity-20 animate-ping" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">
                  Alumni <span className="text-[#ffd700]">Dashboard</span>
                </h1>
                <p className="text-blue-100 text-lg mt-2">
                  Manage and connect with YES INDIA Foundation alumni network
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${stat.bgGradient}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    Alumni Directory
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Browse and manage {filteredAlumni.length} registered alumni
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExportData}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to CSV
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative mt-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, school, job title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-base border-2 focus:border-blue-500 rounded-xl shadow-sm"
                />
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="grid" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 p-1 bg-gray-100 rounded-xl">
                  <TabsTrigger value="grid" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="table" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                    <List className="h-4 w-4 mr-2" />
                    Table View
                  </TabsTrigger>
                </TabsList>

                {/* Grid View */}
                <TabsContent value="grid">
                  <AnimatePresence mode="wait">
                    {filteredAlumni.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16"
                      >
                        <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                          <Users className="h-16 w-16 text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                          No alumni found matching your search
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search criteria
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {filteredAlumni.map((alumni, index) => (
                          <motion.div
                            key={alumni.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden"
                              onClick={() => handleViewDetails(alumni)}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start space-x-4 mb-4">
                                  <div className="relative">
                                    <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                                      <AvatarImage src={alumni.photoURL} alt={alumni.fullName} />
                                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold">
                                        {alumni.fullName
                                          ?.split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-green-500 rounded-full border-2 border-white">
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                      {alumni.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-600 truncate font-medium">
                                      {alumni.currentJobTitle}
                                    </p>
                                    <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                                      Batch {alumni.yearOfGraduation}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <Building2 className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                                    <span className="truncate">{alumni.companyName}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                                    <span className="truncate">{alumni.schoolAttended}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
                                    <span className="truncate">
                                      {alumni.place}, {alumni.state}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  variant="outline"
                                  className="w-full mt-4 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* Table View */}
                <TabsContent value="table">
                  {filteredAlumni.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                        <Users className="h-16 w-16 text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        No alumni found matching your search
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-bold">Photo</TableHead>
                            <TableHead className="font-bold">Name</TableHead>
                            <TableHead className="font-bold">School</TableHead>
                            <TableHead className="font-bold">Batch</TableHead>
                            <TableHead className="font-bold">Current Position</TableHead>
                            <TableHead className="font-bold">Location</TableHead>
                            <TableHead className="font-bold text-center">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAlumni.map((alumni) => (
                            <TableRow key={alumni.id} className="hover:bg-blue-50 transition-colors">
                              <TableCell>
                                <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                                  <AvatarImage src={alumni.photoURL} alt={alumni.fullName} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold">
                                    {alumni.fullName
                                      ?.split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </TableCell>
                              <TableCell className="font-semibold text-gray-900">
                                {alumni.fullName}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {alumni.schoolAttended}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {alumni.yearOfGraduation}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {alumni.currentJobTitle}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {alumni.companyName}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {alumni.place}, {alumni.state}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  onClick={() => handleViewDetails(alumni)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAlumni && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-3xl font-bold text-gray-900">
                  Alumni Profile
                </DialogTitle>
                <DialogDescription className="text-base">
                  Detailed information about the alumni member
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                  <Avatar className="h-32 w-32 ring-4 ring-white shadow-xl">
                    <AvatarImage src={selectedAlumni.photoURL} alt={selectedAlumni.fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold">
                      {selectedAlumni.fullName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedAlumni.fullName}
                    </h3>
                    <p className="text-lg text-gray-600 mb-3">
                      {selectedAlumni.currentJobTitle}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge className="bg-blue-500 text-white px-4 py-1">
                        Batch {selectedAlumni.yearOfGraduation}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-1">
                        {selectedAlumni.qualification}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Phone className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Mobile</p>
                          <p className="font-semibold">{selectedAlumni.mobileNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">WhatsApp</p>
                          <p className="font-semibold">{selectedAlumni.whatsappNumber}</p>
                        </div>
                      </div>
                      {selectedAlumni.facebookLink && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Facebook className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Facebook</p>
                            <p className="font-semibold truncate text-sm">
                              {selectedAlumni.facebookLink}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedAlumni.instagramLink && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="p-2 bg-pink-100 rounded-lg">
                            <Instagram className="h-4 w-4 text-pink-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Instagram</p>
                            <p className="font-semibold truncate text-sm">
                              {selectedAlumni.instagramLink}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedAlumni.twitterLink && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Twitter className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Twitter/X</p>
                            <p className="font-semibold truncate text-sm">
                              {selectedAlumni.twitterLink}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedAlumni.linkedinLink && (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Linkedin className="h-4 w-4 text-blue-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">LinkedIn</p>
                            <p className="font-semibold truncate text-sm">
                              {selectedAlumni.linkedinLink}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedAlumni.address}, {selectedAlumni.place}, {selectedAlumni.state} -{' '}
                        {selectedAlumni.pinCode}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Educational Background */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      Educational Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">School</p>
                        <p className="font-semibold text-gray-900">{selectedAlumni.schoolAttended}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">Graduation Year</p>
                        <p className="font-semibold text-gray-900">{selectedAlumni.yearOfGraduation}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">Last Class Attended</p>
                        <p className="font-semibold text-gray-900">
                          {selectedAlumni.lastClassAttended === 'Other'
                            ? selectedAlumni.otherClass
                            : selectedAlumni.lastClassAttended}
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">Highest Qualification</p>
                        <p className="font-semibold text-gray-900">{selectedAlumni.qualification}</p>
                      </div>
                      {selectedAlumni.additionalQualification && (
                        <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500 sm:col-span-2">
                          <p className="text-xs text-gray-500 mb-1">Additional Qualifications</p>
                          <p className="font-semibold text-gray-900">{selectedAlumni.additionalQualification}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Details */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="h-5 w-5 text-orange-600" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Briefcase className="h-4 w-4 text-orange-600" />
                          </div>
                          <p className="text-xs text-gray-500">Current Position</p>
                        </div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {selectedAlumni.currentJobTitle}
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-orange-600" />
                          </div>
                          <p className="text-xs text-gray-500">Company</p>
                        </div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {selectedAlumni.companyName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Involvement */}
                {selectedAlumni.stayInvolved && selectedAlumni.stayInvolved.length > 0 && (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5 text-teal-600" />
                        Ways to Stay Involved
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {selectedAlumni.stayInvolved.map((involvement, index) => (
                          <Badge
                            key={index}
                            className="px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                          >
                            {involvement}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Message to Teachers */}
                {selectedAlumni.messageToTeacher && (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Message to Teachers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white p-6 rounded-xl border-l-4 border-yellow-400">
                        <div className="flex gap-2 mb-2">
                          <svg className="h-6 w-6 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg italic">
                          {selectedAlumni.messageToTeacher}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Registration Info */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Registration Date</p>
                      <p className="font-semibold text-gray-900">
                        {selectedAlumni.registrationDate 
                          ? new Date(selectedAlumni.registrationDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="px-4 py-2">
                    Alumni ID: {selectedAlumni.id.substring(0, 8)}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;