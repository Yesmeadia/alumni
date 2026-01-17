// components/dashboard/AlumniDetailsDialog.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  Linkedin,
  X,
  Download,
  Mail,
  Pencil,
  Trash2,
  MessageSquare,
  MessageCircle as MessageCircleIcon,
  Users
} from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: (AlumniData & { id: string }) | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AlumniDetailsDialog: React.FC<AlumniDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  alumni,
  onEdit,
  onDelete,
}) => {
  if (!alumni) return null;

  const formatSocialLink = (link?: string) => {
    if (!link) return '';
    if (link.startsWith('http')) return link;
    return `https://${link}`;
  };

  const handleExportProfile = () => {
    const printContent = document.getElementById('alumni-profile-content');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1200px] h-[90vh] max-h-[90vh] p-0 overflow-hidden border-0 shadow-3xl bg-slate-50 result-scroll-container flex flex-col rounded-2xl">
        {/* Accessibility */}
        <DialogTitle className="sr-only">{alumni.fullName} Profile</DialogTitle>
        <DialogDescription className="sr-only">Detailed profile view</DialogDescription>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" id="alumni-profile-content">

          {/* Header / Banner Section */}
          <div className="relative">
            {/* Gradient Banner */}
            <div className="h-40 bg-red-600 w-full relative">
              {/* Close & Export Buttons on top of banner */}
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md"
                  onClick={() => onOpenChange(false)}
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportProfile}
                  className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-md rounded-full px-4"
                >
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>

                {/* Edit & Delete Actions */}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(alumni.id)}
                    className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-md rounded-full px-4"
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this alumni profile? This action cannot be undone.')) {
                        onDelete(alumni.id);
                        onOpenChange(false);
                      }
                    }}
                    className="bg-red-500/20 hover:bg-red-500/40 text-white backdrop-blur-md rounded-full px-4 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Info Overlay */}
            <div className="px-8 pb-4 relative flex flex-col md:flex-row items-end gap-6 -mt-16 mb-2">
              <div className="relative shrink-0">
                <Avatar className="h-32 w-32 ring-4 ring-white shadow-xl bg-white">
                  <AvatarImage src={alumni.photoURL} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-blue-100 text-blue-600">
                    {alumni.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-4 right-4 h-5 w-5 bg-green-500 border-3 border-white rounded-full" title="Active" />
              </div>

              {/* Name & Title - Positioned to ensure visibility */}
              <div className="flex-1 text-center md:text-left pt-16 md:pt-0 md:mb-2">
                <h2 className="text-2xl font-bold text-black capitalize">{alumni.fullName}</h2>
                <p className="text-lg font-medium text-black capitalize">{alumni.currentJobTitle || 'Alumni'}</p>
                <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
                  <Badge variant="secondary" className="px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm">
                    Batch {alumni.yearOfGraduation}
                  </Badge>
                  {alumni.companyName && (
                    <Badge variant="outline" className="px-3 border-gray-200 text-gray-600 capitalize text-sm">
                      <Building2 className="h-3 w-3 mr-1" /> {alumni.companyName}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Contact Actions (Desktop) */}
              <div className="hidden md:flex gap-3 mb-4">
                {alumni.linkedinLink && (
                  <a href={formatSocialLink(alumni.linkedinLink)} target="_blank" rel="noreferrer">
                    <Button size="icon" variant="outline" className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Cards Container */}
          <div className="px-6 md:px-8 pb-8">
            {/* Horizontal Scrolling Container for Cards */}
            <div className="flex flex-row gap-6 pb-4 overflow-x-auto scrollbar-hide">

              {/* 1. Contact Details Card */}
              <Card className="min-w-[280px] max-w-[320px] shadow-sm border-gray-100 flex-shrink-0">
                <CardHeader className="pb-3 border-b border-gray-50 bg-white rounded-t-xl">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                    <Users className="h-4 w-4 text-blue-500" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Mobile</p>
                      <p className="font-medium text-gray-900 truncate">{alumni.mobileNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                      <MessageCircleIcon className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 font-semibold uppercase">WhatsApp</p>
                      <p className="font-medium text-gray-900 truncate">{alumni.whatsappNumber || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden w-full">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                      <p className="font-medium text-gray-900 truncate" title={alumni.email}>{alumni.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-100 mt-2">
                    <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0 mt-1">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="mt-1 overflow-hidden">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Current Address</p>
                      <p className="font-medium text-gray-900 text-sm leading-relaxed break-words">
                        {[alumni.address, alumni.district, alumni.state, alumni.pinCode].filter(Boolean).join(', ') || 'Address not available'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Education Card */}
              <Card className="min-w-[280px] max-w-[320px] shadow-sm border-gray-100 flex-shrink-0">
                <CardHeader className="pb-3 border-b border-gray-50 bg-white rounded-t-xl">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                    <GraduationCap className="h-4 w-4 text-orange-500" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">School Attended</p>
                    <p className="font-bold text-gray-900 leading-tight">{alumni.schoolAttended || 'YES INDIA School'}</p>
                    <p className="text-sm text-gray-600 mt-1">Batch of {alumni.yearOfGraduation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Highest Qualification</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-sm">
                        {alumni.qualification || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  {alumni.university && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">University / College</p>
                      <p className="font-medium text-gray-900 leading-tight text-sm">{alumni.university}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 3. Professional Card */}
              <Card className="min-w-[280px] max-w-[320px] shadow-sm border-gray-100 flex-shrink-0">
                <CardHeader className="pb-3 border-b border-gray-50 bg-white rounded-t-xl">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                    <Briefcase className="h-4 w-4 text-black" />
                    Professional
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Current Role</p>
                    <p className="font-bold text-gray-900 text-base leading-tight capitalize">{alumni.currentJobTitle || 'Not specified'}</p>
                    <p className="text-blue-600 font-medium capitalize mt-1 text-sm">{alumni.companyName}</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Industry</p>
                      <p className="font-medium text-gray-900 capitalize text-sm">{alumni.industry || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Experience</p>
                      <p className="font-medium text-gray-900 text-sm">{alumni.yearsOfExperience ? `${alumni.yearsOfExperience} Years` : 'N/A'}</p>
                    </div>
                  </div>
                  {alumni.areasOfExpertise && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {alumni.areasOfExpertise.split(',').map((skill, i) => (
                          <Badge key={i} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-100 text-xs px-2 py-1">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 4. Message Card (only if exists) */}
              {alumni.messageToTeacher && (
                <Card className="min-w-[280px] max-w-[320px] shadow-sm border-gray-100 flex-shrink-0 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader className="pb-3 border-b border-gray-50 rounded-t-xl">
                    <CardTitle className="text-base flex items-center gap-2 text-indigo-800">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                      Message to Teachers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="p-3 bg-white/70 rounded-lg border border-indigo-100">
                      <p className="text-sm italic leading-relaxed text-gray-700">
                        "{alumni.messageToTeacher}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 5. Willing to Contribute Card (only if exists) */}
              {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                <Card className="min-w-[280px] max-w-[320px] shadow-sm border-gray-100 flex-shrink-0">
                  <CardHeader className="pb-3 border-b border-gray-50 bg-white rounded-t-xl">
                    <CardTitle className="text-base flex items-center gap-2 text-gray-800">
                      <Users className="h-4 w-4 text-emerald-500" />
                      Willing to Contribute
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {alumni.stayInvolved.map((item, i) => (
                        <Badge
                          key={i}
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 py-2 px-3 text-xs rounded-md"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Registration Date */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              Registered on {formatDate(alumni.registrationDate)}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniDetailsDialog;