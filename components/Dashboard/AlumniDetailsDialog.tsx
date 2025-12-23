// components/dashboard/AlumniDetailsDialog.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Calendar,
  Users,
  X,
  Download,
  Mail,
  Globe,
} from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: (AlumniData & { id: string }) | null; // Now id is guaranteed to be there
}

const AlumniDetailsDialog: React.FC<AlumniDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  alumni,
}) => {
  if (!alumni) return null;

  const safeAlumniId = alumni.id || 'N/A';
  
  const formatSocialLink = (link?: string) => {
    if (!link) return '';
    if (link.startsWith('http')) return link;
    return `https://${link}`;
  };

  // Handle print/export
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

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] p-0 overflow-hidden sm:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw]">
        {/* Close Button */}
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute left-4 top-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white/80 backdrop-blur-sm"
            onClick={handleExportProfile}
          >
            <Download className="h-3 w-3 mr-1" />
            Print
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Left Sidebar - Profile Summary (Desktop only) */}
          <div className="hidden lg:block w-80 border-r border-gray-200 overflow-y-auto bg-gradient-to-b from-blue-50/50 to-white p-6">
            <div className="sticky top-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-40 w-40 ring-4 ring-white shadow-xl mb-6">
                  <AvatarImage src={alumni.photoURL || ''} alt={alumni.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold">
                    {alumni.fullName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {alumni.fullName || 'No Name'}
                </h3>
                <p className="text-gray-600 mb-1">
                  {alumni.currentJobTitle || 'Not specified'}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {alumni.companyName || 'Not specified'}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    Batch {alumni.yearOfGraduation || 'N/A'}
                  </Badge>
                  {alumni.qualification && (
                    <Badge variant="outline" className="px-3 py-1">
                      {alumni.qualification}
                    </Badge>
                  )}
                </div>

                {/* Quick Contact */}
                <div className="w-full space-y-3 mb-6">
                  {alumni.mobileNumber && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Mobile</p>
                        <p className="font-semibold text-sm">{alumni.mobileNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {alumni.whatsappNumber && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-500">WhatsApp</p>
                        <p className="font-semibold text-sm">{alumni.whatsappNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {alumni.socialMediaLink && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Email/Social</p>
                        <p className="font-semibold text-sm truncate">{alumni.socialMediaLink}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alumni Info */}
                <div className="w-full space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Alumni ID:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {safeAlumniId.substring(0, 8).toUpperCase()}
                    </Badge>
                  </div>
                  
                  {alumni.schoolAttended && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500">School:</span>
                      <span className="font-semibold text-sm text-right">{alumni.schoolAttended}</span>
                    </div>
                  )}
                  
                  {alumni.registrationDate && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500">Registered:</span>
                      <span className="font-semibold text-sm">
                        {formatDate(alumni.registrationDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" id="alumni-profile-content">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={alumni.photoURL || ''} alt={alumni.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold">
                    {alumni.fullName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {alumni.fullName || 'No Name'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {alumni.currentJobTitle || 'Not specified'} {alumni.companyName && `at ${alumni.companyName}`}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      Batch {alumni.yearOfGraduation || 'N/A'}
                    </Badge>
                    {alumni.qualification && (
                      <Badge variant="outline" className="px-3 py-1">
                        {alumni.qualification}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Header Title */}
            <div className="hidden lg:block mb-8">
              <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                Alumni Profile
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                Detailed information about {alumni.fullName || 'the alumni member'}
              </DialogDescription>
            </div>

            {/* Grid Layout for Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Mobile Numbers */}
                    {(alumni.mobileNumber || alumni.whatsappNumber) && (
                      <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-1">
                        <div className="space-y-3">
                          {alumni.mobileNumber && (
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Phone className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Mobile</p>
                                <p className="font-semibold">{alumni.mobileNumber}</p>
                              </div>
                            </div>
                          )}
                          {alumni.whatsappNumber && (
                            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Phone className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">WhatsApp</p>
                                <p className="font-semibold">{alumni.whatsappNumber}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Social Media Links */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {alumni.facebookLink && (
                          <a
                            href={formatSocialLink(alumni.facebookLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-blue-50 transition-colors"
                          >
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Facebook className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Facebook</p>
                              <p className="font-semibold truncate text-sm">
                                {alumni.facebookLink.replace(/(^\w+:|^)\/\//, '')}
                              </p>
                            </div>
                          </a>
                        )}
                        {alumni.instagramLink && (
                          <a
                            href={formatSocialLink(alumni.instagramLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-pink-50 transition-colors"
                          >
                            <div className="p-2 bg-pink-100 rounded-lg">
                              <Instagram className="h-4 w-4 text-pink-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Instagram</p>
                              <p className="font-semibold truncate text-sm">
                                {alumni.instagramLink.replace(/(^\w+:|^)\/\//, '')}
                              </p>
                            </div>
                          </a>
                        )}
                        {alumni.twitterLink && (
                          <a
                            href={formatSocialLink(alumni.twitterLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-blue-50 transition-colors"
                          >
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Twitter className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Twitter/X</p>
                              <p className="font-semibold truncate text-sm">
                                {alumni.twitterLink.replace(/(^\w+:|^)\/\//, '')}
                              </p>
                            </div>
                          </a>
                        )}
                        {alumni.linkedinLink && (
                          <a
                            href={formatSocialLink(alumni.linkedinLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-blue-50 transition-colors"
                          >
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Linkedin className="h-4 w-4 text-blue-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">LinkedIn</p>
                              <p className="font-semibold truncate text-sm">
                                {alumni.linkedinLink.replace(/(^\w+:|^)\/\//, '')}
                              </p>
                            </div>
                          </a>
                        )}
                        {alumni.otherSocialLink && (
                          <a
                            href={formatSocialLink(alumni.otherSocialLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Globe className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Other</p>
                              <p className="font-semibold truncate text-sm">
                                {alumni.otherSocialLink.replace(/(^\w+:|^)\/\//, '')}
                              </p>
                            </div>
                          </a>
                        )}
                        {alumni.socialMediaLink && !alumni.socialMediaLink.includes('@') && (
                          <a
                            href={formatSocialLink(alumni.socialMediaLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Globe className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Website</p>
                              <p className="font-semibold truncate text-sm">
                                {alumni.socialMediaLink.replace(/(^\w+:|^)\/\//, '')}
                              </p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              {(alumni.address || alumni.place || alumni.state || alumni.pinCode) && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white rounded-lg border">
                      {alumni.address && (
                        <p className="text-gray-700 leading-relaxed">
                          {alumni.address}
                        </p>
                      )}
                      {(alumni.place || alumni.state) && (
                        <p className="text-gray-700 mt-2">
                          {alumni.place}{alumni.place && alumni.state ? ', ' : ''}{alumni.state}
                        </p>
                      )}
                      {alumni.pinCode && (
                        <p className="text-gray-700 font-semibold mt-1">
                          PIN: {alumni.pinCode}
                        </p>
                      )}
                      {alumni.district && (
                        <p className="text-gray-600 text-sm mt-1">
                          District: {alumni.district}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Educational Background */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    Educational Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {alumni.schoolAttended && (
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">School</p>
                        <p className="font-semibold text-gray-900">{alumni.schoolAttended}</p>
                      </div>
                    )}
                    {alumni.yearOfGraduation && (
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">Graduation Year</p>
                        <p className="font-semibold text-gray-900">{alumni.yearOfGraduation}</p>
                      </div>
                    )}
                    {alumni.lastClassAttended && (
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">Last Class Attended</p>
                        <p className="font-semibold text-gray-900">
                          {alumni.lastClassAttended === 'Other'
                            ? alumni.otherClass || alumni.lastClassAttended
                            : alumni.lastClassAttended}
                        </p>
                      </div>
                    )}
                    {alumni.qualification && (
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                        <p className="text-xs text-gray-500 mb-1">Highest Qualification</p>
                        <p className="font-semibold text-gray-900">{alumni.qualification}</p>
                      </div>
                    )}
                    {alumni.additionalQualification && (
                      <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500 sm:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Additional Qualifications</p>
                        <p className="font-semibold text-gray-900">{alumni.additionalQualification}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              {(alumni.currentJobTitle || alumni.companyName || alumni.yearsOfExperience || alumni.industry) && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="h-5 w-5 text-orange-600" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {alumni.currentJobTitle && (
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Briefcase className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-500">Current Position</p>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {alumni.currentJobTitle}
                          </p>
                        </div>
                      )}
                      {alumni.companyName && (
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Building2 className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-500">Company</p>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {alumni.companyName}
                          </p>
                        </div>
                      )}
                      {alumni.yearsOfExperience && (
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Calendar className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-500">Experience</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {alumni.yearsOfExperience} years
                          </p>
                        </div>
                      )}
                      {alumni.industry && (
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Building2 className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-500">Industry</p>
                          </div>
                          <p className="font-semibold text-gray-900">{alumni.industry}</p>
                        </div>
                      )}
                      {alumni.professionalInterests && (
                        <div className="p-4 bg-white rounded-lg border sm:col-span-2">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Briefcase className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-500">Professional Interests</p>
                          </div>
                          <p className="font-semibold text-gray-900">{alumni.professionalInterests}</p>
                        </div>
                      )}
                      {alumni.areasOfExpertise && (
                        <div className="p-4 bg-white rounded-lg border sm:col-span-2">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Briefcase className="h-4 w-4 text-orange-600" />
                            </div>
                            <p className="text-xs text-gray-500">Areas of Expertise</p>
                          </div>
                          <p className="font-semibold text-gray-900">{alumni.areasOfExpertise}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Involvement */}
              {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-5 w-5 text-teal-600" />
                      Ways to Stay Involved
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {alumni.stayInvolved.map((involvement, index) => (
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
              {alumni.messageToTeacher && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50 lg:col-span-2">
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
                        {alumni.messageToTeacher}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Registration Info */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registration Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(alumni.registrationDate)}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="px-4 py-2 font-mono">
                Alumni ID: {safeAlumniId.substring(0, 8).toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniDetailsDialog;