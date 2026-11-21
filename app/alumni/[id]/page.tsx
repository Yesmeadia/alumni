'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';
import { safeSocialUrl } from '@/lib/security';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';

export default function AlumniDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [alumni, setAlumni] = useState<(AlumniData & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const alumniRef = ref(database, `alumni/${id}`);
    const unsubscribe = onValue(alumniRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAlumni({ ...data, id });
      } else {
        setAlumni(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const formatDate = (dateInput?: string | number) => {
    if (!dateInput) return '—';
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const saasCardClass =
    'bg-white border border-[#E5E7EB] rounded-[18px] shadow-[0_4px_20px_-4px_rgba(29,30,32,0.05)] overflow-hidden';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a1b63]/20 border-t-[#2a1b63] animate-spin" />
          <p className="text-sm text-[#5F6368]">Loading alumni record...</p>
        </div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center">
          <Icon name="person_off" className="text-[28px]" />
        </div>
        <div>
          <h1 className="text-xl text-[#1D1E20]">Alumni Record Not Found</h1>
          <p className="text-sm text-[#5F6368] mt-1">
            This registration may have been removed or the link is invalid.
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/registrations')}
          className="h-10 px-5 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-white"
        >
          Back to Registrations
        </Button>
      </div>
    );
  }

  const lastClass =
    alumni.lastClassAttended === 'Other'
      ? alumni.otherClass || 'Other'
      : alumni.lastClassAttended || '—';

  const locationLine = [alumni.place, alumni.district, alumni.state]
    .filter(Boolean)
    .join(', ');

  const expertiseTags = (alumni.areasOfExpertise || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const socialLinks = [
    { id: 'linkedin', label: 'LinkedIn', value: alumni.linkedinLink, icon: 'work_outline' },
    { id: 'facebook', label: 'Facebook', value: alumni.facebookLink, icon: 'public' },
    { id: 'instagram', label: 'Instagram', value: alumni.instagramLink, icon: 'photo_camera' },
    { id: 'twitter', label: 'X / Twitter', value: alumni.twitterLink, icon: 'alternate_email' },
    { id: 'website', label: 'Website', value: alumni.socialMediaLink || alumni.otherSocialLink, icon: 'language' },
  ].filter((item) => Boolean(item.value));

  const statusConfig =
    alumni.status === 'rejected'
      ? {
          label: 'Rejected',
          pillClass: 'bg-red-50 text-[#DC2626] border-red-200',
          dotClass: 'bg-[#DC2626]',
        }
      : alumni.status === 'pending'
      ? {
          label: 'Pending Review',
          pillClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
          dotClass: 'bg-[#D97706]',
        }
      : {
          label: 'Verified Alumni',
          pillClass: 'bg-[#ECFDF5] text-[#16A34A] border-[#A7F3D0]/80',
          dotClass: 'bg-[#16A34A]',
        };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/registrations">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
            >
              Registrations
            </Button>
          </Link>
          <span className="text-xs text-[#8A8F98] hidden sm:inline">
            ID: {id.slice(0, 12)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href={`/alumni/${id}/edit`}>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
            >
              <Icon name="edit" className="text-[18px] mr-2" />
              Edit Record
            </Button>
          </Link>
          <Link href={`/alumni/${id}/id-card`}>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-[#E5E7EB] bg-white text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
            >
              <Icon name="badge" className="text-[18px] mr-2" />
              ID Card
            </Button>
          </Link>
          <Link href={`/alumni/${id}/pdf`}>
            <Button className="h-10 px-5 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-white">
              <Icon name="picture_as_pdf" className="text-[18px] mr-2" />
              Download PDF
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Hero Card */}
      <Card className={saasCardClass}>
        <div className="h-28 sm:h-32 bg-[#2a1b63] relative px-6 sm:px-8 flex items-end justify-end pb-4">
          {alumni.yearOfGraduation && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/15">
              <Icon name="school" className="text-[15px]" />
              Class of {alumni.yearOfGraduation}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#a5874c]" />
        </div>

        <CardContent className="px-6 sm:px-8 pb-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-12 sm:-mt-14 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 min-w-0">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl ring-4 ring-white shadow-md bg-white shrink-0">
                <AvatarImage
                  src={alumni.photoURL || ''}
                  alt={alumni.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-[#F3F0FA] text-[#2a1b63] text-3xl uppercase">
                  {alumni.fullName?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 sm:pb-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl text-[#1D1E20] tracking-tight truncate">
                    {alumni.fullName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${statusConfig.pillClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5F6368]">
                  {(alumni.currentJobTitle || alumni.companyName) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="work" className="text-[16px] text-[#2a1b63]" />
                      <span>
                        {[alumni.currentJobTitle, alumni.companyName].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                  )}
                  {alumni.schoolAttended && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="account_balance" className="text-[16px] text-[#2a1b63]" />
                      <span className="truncate max-w-[360px]">{alumni.schoolAttended}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 md:pb-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={safeSocialUrl(link.value as string, link.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#E5E7EB] bg-[#FAFBFF] text-xs text-[#1D1E20] hover:bg-[#F3F0FA] hover:border-[#DDD6F3] hover:text-[#2a1b63] transition-colors"
                  >
                    <Icon name={link.icon} className="text-[16px]" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${saasCardClass} p-4 flex items-center gap-3.5`}>
          <div className="h-10 w-10 rounded-xl bg-[#F3F0FA] text-[#2a1b63] border border-[#DDD6F3]/70 flex items-center justify-center shrink-0">
            <Icon name="calendar_month" className="text-[20px]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#8A8F98]">Batch / Year</p>
            <p className="text-sm text-[#1D1E20] truncate">{alumni.yearOfGraduation || '—'}</p>
          </div>
        </div>

        <div className={`${saasCardClass} p-4 flex items-center gap-3.5`}>
          <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/70 flex items-center justify-center shrink-0">
            <Icon name="person" className="text-[20px]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#8A8F98]">Gender</p>
            <p className="text-sm text-[#1D1E20] truncate">{alumni.gender || 'Not specified'}</p>
          </div>
        </div>

        <div className={`${saasCardClass} p-4 flex items-center gap-3.5`}>
          <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]/70 flex items-center justify-center shrink-0">
            <Icon name="workspace_premium" className="text-[20px]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#8A8F98]">Experience</p>
            <p className="text-sm text-[#1D1E20] truncate">
              {alumni.yearsOfExperience ? `${alumni.yearsOfExperience} yrs` : '—'}
            </p>
          </div>
        </div>

        <div className={`${saasCardClass} p-4 flex items-center gap-3.5`}>
          <div className="h-10 w-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]/70 flex items-center justify-center shrink-0">
            <Icon name="event_available" className="text-[20px]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#8A8F98]">Registered On</p>
            <p className="text-sm text-[#1D1E20] truncate">
              {formatDate(alumni.registrationDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contact & Registry Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className={saasCardClass}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Icon name="contact_phone" className="text-[20px] text-[#2a1b63]" />
                <div>
                  <CardTitle className="text-base text-[#1D1E20]">Contact &amp; Address</CardTitle>
                  <CardDescription className="text-xs text-[#8A8F98]">
                    Direct reachability and residential details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#F3F0FA] text-[#2a1b63] border border-[#DDD6F3]/70 flex items-center justify-center shrink-0">
                  <Icon name="call" className="text-[19px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#8A8F98]">Mobile Number</p>
                  {alumni.mobileNumber ? (
                    <a
                      href={`tel:${alumni.mobileNumber}`}
                      className="text-sm text-[#1D1E20] hover:text-[#2a1b63] transition-colors"
                    >
                      {alumni.mobileNumber}
                    </a>
                  ) : (
                    <p className="text-sm text-[#1D1E20]">—</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]/70 flex items-center justify-center shrink-0">
                  <Icon name="chat" className="text-[19px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#8A8F98]">WhatsApp Number</p>
                  <p className="text-sm text-[#1D1E20]">{alumni.whatsappNumber || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/70 flex items-center justify-center shrink-0">
                  <Icon name="mail" className="text-[19px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#8A8F98]">Email Address</p>
                  {alumni.email ? (
                    <a
                      href={`mailto:${alumni.email}`}
                      className="text-sm text-[#1D1E20] hover:text-[#2a1b63] break-all transition-colors"
                    >
                      {alumni.email}
                    </a>
                  ) : (
                    <p className="text-sm text-[#1D1E20]">—</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-2 border-t border-[#E5E7EB]/70">
                <div className="h-10 w-10 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]/70 flex items-center justify-center shrink-0">
                  <Icon name="location_on" className="text-[19px]" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs text-[#8A8F98]">Address</p>
                  {alumni.address && (
                    <p className="text-sm text-[#1D1E20] leading-relaxed">{alumni.address}</p>
                  )}
                  <p className="text-sm text-[#5F6368]">
                    {locationLine || '—'}
                    {alumni.pinCode ? ` — ${alumni.pinCode}` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={saasCardClass}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Icon name="verified_user" className="text-[20px] text-[#2a1b63]" />
                <CardTitle className="text-base text-[#1D1E20]">Registry Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3.5 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]/60">
                <span className="text-[#5F6368]">Record ID</span>
                <span className="text-[#1D1E20] truncate max-w-[200px]" title={id}>
                  {id}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]/60">
                <span className="text-[#5F6368]">Registration Date</span>
                <span className="text-[#1D1E20]">{formatDate(alumni.registrationDate)}</span>
              </div>
              {alumni.updatedAt && (
                <div className="flex items-center justify-between py-1 border-b border-[#E5E7EB]/60">
                  <span className="text-[#5F6368]">Last Updated</span>
                  <span className="text-[#1D1E20]">{formatDate(alumni.updatedAt)}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-1">
                <span className="text-[#5F6368]">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${statusConfig.pillClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
                  {statusConfig.label}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Education, Career & Community */}
        <div className="lg:col-span-7 space-y-6">
          {/* Education Card */}
          <Card className={saasCardClass}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Icon name="school" className="text-[20px] text-[#2a1b63]" />
                <div>
                  <CardTitle className="text-base text-[#1D1E20]">
                    Academic Background
                  </CardTitle>
                  <CardDescription className="text-xs text-[#8A8F98]">
                    YES INDIA institution and higher education qualifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#FAFBFF] border border-[#E5E7EB]">
                  <p className="text-xs text-[#8A8F98]">School / Institution Attended</p>
                  <p className="text-base text-[#1D1E20] mt-1">
                    {alumni.schoolAttended || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">Graduation Batch</p>
                  <p className="text-sm text-[#1D1E20] mt-1">
                    {alumni.yearOfGraduation ? `Class of ${alumni.yearOfGraduation}` : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">Last Class Attended</p>
                  <p className="text-sm text-[#1D1E20] mt-1">{lastClass}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">Highest Qualification</p>
                  <p className="text-sm text-[#1D1E20] mt-1">{alumni.qualification || '—'}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">University / Additional Qualification</p>
                  <p className="text-sm text-[#1D1E20] mt-1">
                    {[alumni.university, alumni.additionalQualification]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional & Expertise Card */}
          <Card className={saasCardClass}>
            <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <Icon name="business_center" className="text-[20px] text-[#2a1b63]" />
                <div>
                  <CardTitle className="text-base text-[#1D1E20]">
                    Career &amp; Expertise
                  </CardTitle>
                  <CardDescription className="text-xs text-[#8A8F98]">
                    Current profession, industry sector, and core skills
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-[#8A8F98]">Current Job Title</p>
                  <p className="text-sm text-[#1D1E20] mt-1">{alumni.currentJobTitle || '—'}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">Company / Organization</p>
                  <p className="text-sm text-[#1D1E20] mt-1">{alumni.companyName || '—'}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">Industry</p>
                  <p className="text-sm text-[#1D1E20] mt-1">{alumni.industry || '—'}</p>
                </div>

                <div>
                  <p className="text-xs text-[#8A8F98]">Years of Experience</p>
                  <p className="text-sm text-[#1D1E20] mt-1">
                    {alumni.yearsOfExperience ? `${alumni.yearsOfExperience} years` : '—'}
                  </p>
                </div>
              </div>

              {expertiseTags.length > 0 && (
                <div className="pt-4 border-t border-[#E5E7EB]/70">
                  <p className="text-xs text-[#8A8F98] mb-2.5">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {expertiseTags.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#FAFBFF] border border-[#E5E7EB] text-xs text-[#1D1E20]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {alumni.professionalInterests && (
                <div className="pt-4 border-t border-[#E5E7EB]/70">
                  <p className="text-xs text-[#8A8F98] mb-1">Professional Interests</p>
                  <p className="text-sm text-[#5F6368] leading-relaxed">
                    {alumni.professionalInterests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Involvement & Message */}
          {((alumni.stayInvolved && alumni.stayInvolved.length > 0) ||
            alumni.messageToTeacher) && (
            <Card className={saasCardClass}>
              <CardHeader className="px-6 py-5 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2.5">
                  <Icon name="volunteer_activism" className="text-[20px] text-[#2a1b63]" />
                  <div>
                    <CardTitle className="text-base text-[#1D1E20]">
                      Community &amp; Reflection
                    </CardTitle>
                    <CardDescription className="text-xs text-[#8A8F98]">
                      Ways to stay involved and message to teachers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                  <div>
                    <p className="text-xs text-[#8A8F98] mb-2.5">Willing to Contribute As</p>
                    <div className="flex flex-wrap gap-2">
                      {alumni.stayInvolved.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F0FA] border border-[#DDD6F3] text-xs text-[#2a1b63]"
                        >
                          <Icon name="check_circle" className="text-[15px]" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {alumni.messageToTeacher && (
                  <div className="p-5 rounded-2xl bg-[#FAFBFF] border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 text-xs text-[#8A8F98] mb-2">
                      <Icon name="format_quote" className="text-[18px] text-[#2a1b63]" />
                      <span>Message to Teacher</span>
                    </div>
                    <p className="text-sm text-[#1D1E20] leading-relaxed">
                      &ldquo;{alumni.messageToTeacher}&rdquo;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
