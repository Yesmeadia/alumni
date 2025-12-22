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
} from 'lucide-react';
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

interface AlumniDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alumni: AlumniWithId | null;
}

const AlumniDetailsDialog: React.FC<AlumniDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  alumni,
}) => {
  if (!alumni) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <AvatarImage src={alumni.photoURL} alt={alumni.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold">
                {alumni.fullName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {alumni.fullName}
              </h3>
              <p className="text-lg text-gray-600 mb-3">
                {alumni.currentJobTitle}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  Batch {alumni.yearOfGraduation}
                </Badge>
                <Badge variant="outline" className="px-4 py-1">
                  {alumni.qualification}
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
                    <p className="font-semibold">{alumni.mobileNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="font-semibold">{alumni.whatsappNumber}</p>
                  </div>
                </div>
                {alumni.facebookLink && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Facebook className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Facebook</p>
                      <p className="font-semibold truncate text-sm">
                        {alumni.facebookLink}
                      </p>
                    </div>
                  </div>
                )}
                {alumni.instagramLink && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Instagram className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Instagram</p>
                      <p className="font-semibold truncate text-sm">
                        {alumni.instagramLink}
                      </p>
                    </div>
                  </div>
                )}
                {alumni.twitterLink && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Twitter className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Twitter/X</p>
                      <p className="font-semibold truncate text-sm">
                        {alumni.twitterLink}
                      </p>
                    </div>
                  </div>
                )}
                {alumni.linkedinLink && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">LinkedIn</p>
                      <p className="font-semibold truncate text-sm">
                        {alumni.linkedinLink}
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
                  {alumni.address}, {alumni.place}, {alumni.state} - {alumni.pinCode}
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
                  <p className="font-semibold text-gray-900">{alumni.schoolAttended}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                  <p className="text-xs text-gray-500 mb-1">Graduation Year</p>
                  <p className="font-semibold text-gray-900">{alumni.yearOfGraduation}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                  <p className="text-xs text-gray-500 mb-1">Last Class Attended</p>
                  <p className="font-semibold text-gray-900">
                    {alumni.lastClassAttended === 'Other'
                      ? alumni.otherClass
                      : alumni.lastClassAttended}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border-l-4 border-purple-500">
                  <p className="text-xs text-gray-500 mb-1">Highest Qualification</p>
                  <p className="font-semibold text-gray-900">{alumni.qualification}</p>
                </div>
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
                    {alumni.currentJobTitle}
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
                    {alumni.companyName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Involvement */}
          {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-teal-50">
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
                    {alumni.messageToTeacher}
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
                  {alumni.registrationDate 
                    ? new Date(alumni.registrationDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-4 py-2">
              Alumni ID: {alumni.id.substring(0, 8)}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniDetailsDialog;