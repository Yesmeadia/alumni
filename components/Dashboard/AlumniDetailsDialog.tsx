'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { safeSocialUrl } from '@/lib/security';
import { AlumniData } from '@/lib/types';
import AlumniProfilePrintView from './AlumniProfilePrintView';

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
  const [copied, setCopied] = useState(false);
  const [photoExpanded, setPhotoExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) setPhotoExpanded(false);
  }, [isOpen, alumni?.id]);

  if (!alumni) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPhoto = () => {
    if (!alumni.photoURL) return;
    const filename = `${(alumni.fullName || 'alumni').replace(/\s+/g, '_')}_Photo.jpg`;
    const downloadUrl = `/api/download-photo?url=${encodeURIComponent(
      alumni.photoURL
    )}&filename=${encodeURIComponent(filename)}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/alumni/${alumni.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

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

  const socialLinks = [
    { id: 'linkedin', label: 'LinkedIn', value: alumni.linkedinLink, icon: 'work_outline' },
    { id: 'facebook', label: 'Facebook', value: alumni.facebookLink, icon: 'public' },
    { id: 'instagram', label: 'Instagram', value: alumni.instagramLink, icon: 'photo_camera' },
    { id: 'twitter', label: 'X / Twitter', value: alumni.twitterLink, icon: 'alternate_email' },
    {
      id: 'website',
      label: 'Website',
      value: alumni.socialMediaLink || alumni.otherSocialLink,
      icon: 'language',
    },
  ].filter((l) => Boolean(l.value));

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[900px] w-[95vw] p-0 overflow-hidden border border-[#E5E7EB] shadow-2xl bg-[#FAFBFF] rounded-[20px] max-h-[92vh] flex flex-col print:absolute print:inset-0 print:m-0 print:border-0 print:bg-white print:max-h-none print:shadow-none print:w-full"
      >
        {/* Reliable print overrides */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @media print {
              @page { size: A4 portrait; margin: 0; }
              body > * { display: none !important; }
              body > [data-radix-portal] {
                display: block !important;
                visibility: visible !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                overflow: visible !important;
              }
              [role="dialog"], [data-state="open"] {
                display: block !important;
                visibility: visible !important;
                background: white !important;
                transform: none !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-height: none !important;
                box-shadow: none !important;
                border: 0 !important;
                overflow: visible !important;
              }
              .print-only-container {
                display: block !important;
                visibility: visible !important;
                width: 210mm !important;
                min-height: 297mm !important;
                background: white !important;
                padding: 10mm !important;
              }
              .print-only-container * {
                visibility: visible !important;
                opacity: 1 !important;
              }
              .no-print, .bg-black\\/80, [data-radix-collection] {
                display: none !important;
              }
              html, body, [data-lenis-prevent], .overflow-y-auto {
                overflow: visible !important;
                height: auto !important;
              }
            }
          `,
          }}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <DialogTitle className="sr-only">Alumni Profile — {alumni.fullName}</DialogTitle>
          <DialogDescription className="sr-only">
            Registration details for {alumni.fullName}
          </DialogDescription>

          {/* Standalone Print View (hidden on screen) */}
          <AlumniProfilePrintView alumni={alumni} />

          {/* Top Brand Accent Bar */}
          <div className="h-1.5 w-full bg-[#2a1b63] shrink-0 no-print" />

          {/* Modal Header */}
          <div className="bg-white border-b border-[#E5E7EB] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 no-print">
            <div className="flex items-center gap-5 min-w-0">
              {alumni.photoURL ? (
                <button
                  type="button"
                  onClick={() => setPhotoExpanded(true)}
                  title="Click to expand photo"
                  className="group relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-[#E5E7EB] shadow-xs shrink-0 overflow-hidden bg-[#F3F0FA] focus:outline-none focus:ring-2 focus:ring-[#2a1b63]/40"
                >
                  <Avatar className="h-full w-full rounded-2xl">
                    <AvatarImage
                      src={alumni.photoURL}
                      alt={alumni.fullName}
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <AvatarFallback className="rounded-2xl bg-[#F3F0FA] text-[#2a1b63] text-2xl uppercase">
                      {alumni.fullName?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute inset-0 bg-[#1D1E20]/0 group-hover:bg-[#1D1E20]/35 transition-colors flex items-center justify-center">
                    <Icon
                      name="zoom_in"
                      className="text-[24px] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </span>
                </button>
              ) : (
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border border-[#E5E7EB] shadow-xs shrink-0 bg-[#F3F0FA]">
                  <AvatarFallback className="rounded-2xl bg-[#F3F0FA] text-[#2a1b63] text-2xl uppercase">
                    {alumni.fullName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl text-[#1D1E20] leading-tight truncate">
                    {alumni.fullName}
                  </h2>
                  {alumni.yearOfGraduation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[#F3F0FA] text-[#2a1b63] border border-[#DDD6F3]">
                      Batch {alumni.yearOfGraduation}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5F6368] flex items-center gap-1.5 truncate">
                  <Icon name="school" className="text-[15px] text-[#2a1b63] shrink-0" />
                  <span className="truncate">{alumni.schoolAttended || 'YES INDIA Institution'}</span>
                </p>
                {alumni.photoURL && (
                  <button
                    type="button"
                    onClick={() => setPhotoExpanded(true)}
                    className="inline-flex items-center gap-1 text-xs text-[#2a1b63] hover:underline pt-0.5"
                  >
                    <Icon name="open_in_full" className="text-[14px]" />
                    <span>Expand Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {alumni.photoURL && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPhoto}
                  title="Download Photo"
                  className="h-9 w-9 p-0 rounded-xl border-[#E5E7EB] bg-white text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#2a1b63]"
                >
                  <Icon name="download" className="text-[18px]" />
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-9 px-3.5 rounded-xl border-[#E5E7EB] bg-white text-xs text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] inline-flex items-center gap-1.5"
              >
                <Icon name="print" className="text-[17px]" />
                <span>Print / PDF</span>
              </Button>

              {onEdit && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onEdit(alumni.id)}
                  className="h-9 px-3.5 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-xs text-white inline-flex items-center gap-1.5"
                >
                  <Icon name="edit" className="text-[17px]" />
                  <span>Edit</span>
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                aria-label="Close dialog"
                className="h-9 w-9 p-0 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#1D1E20]"
              >
                <Icon name="close" className="text-[20px]" />
              </Button>
            </div>
          </div>

          {/* Scrollable Modal Body */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7 space-y-5 no-print"
          >
            {/* Contact & Personal Details */}
            <section className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#1D1E20]">
                  <Icon name="contact_phone" className="text-[19px] text-[#2a1b63]" />
                  <span>Personal &amp; Contact Information</span>
                </div>
                <span className="text-xs text-[#8A8F98]">
                  Registered {formatDate(alumni.registrationDate)}
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center shrink-0">
                    <Icon name="call" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8A8F98]">Mobile Number</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.mobileNumber || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center shrink-0">
                    <Icon name="chat" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8A8F98]">WhatsApp</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.whatsappNumber || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Icon name="mail" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8A8F98]">Email Address</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5 truncate" title={alumni.email}>
                      {alumni.email || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
                    <Icon name="person" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8A8F98]">Gender</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.gender || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 flex items-start gap-3 pt-3 border-t border-[#E5E7EB]/70">
                  <div className="h-9 w-9 rounded-xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center shrink-0">
                    <Icon name="location_on" className="text-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#8A8F98]">Location &amp; Address</p>
                    {alumni.address && (
                      <p className="text-sm text-[#1D1E20] mt-0.5">{alumni.address}</p>
                    )}
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      {locationLine || '—'}
                      {alumni.pinCode ? ` — ${alumni.pinCode}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Education & Career */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 text-sm text-[#1D1E20]">
                  <Icon name="school" className="text-[19px] text-[#2a1b63]" />
                  <span>Academic Background</span>
                </div>
                <div className="p-5 space-y-3.5">
                  <div>
                    <p className="text-xs text-[#8A8F98]">Institution</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.schoolAttended || '—'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#8A8F98]">Last Class</p>
                      <p className="text-sm text-[#1D1E20] mt-0.5">{lastClass}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8A8F98]">Batch</p>
                      <p className="text-sm text-[#1D1E20] mt-0.5">
                        {alumni.yearOfGraduation || '—'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A8F98]">Qualification</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.qualification || '—'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 text-sm text-[#1D1E20]">
                  <Icon name="business_center" className="text-[19px] text-[#2a1b63]" />
                  <span>Career &amp; Profession</span>
                </div>
                <div className="p-5 space-y-3.5">
                  <div>
                    <p className="text-xs text-[#8A8F98]">Job Title</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.currentJobTitle || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#8A8F98]">Organization</p>
                    <p className="text-sm text-[#1D1E20] mt-0.5">
                      {alumni.companyName || '—'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#8A8F98]">Industry</p>
                      <p className="text-sm text-[#1D1E20] mt-0.5">
                        {alumni.industry || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#8A8F98]">Experience</p>
                      <p className="text-sm text-[#1D1E20] mt-0.5">
                        {alumni.yearsOfExperience ? `${alumni.yearsOfExperience} yrs` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Expertise, Involvement, Social Links & Reflection */}
            {(expertiseTags.length > 0 ||
              (alumni.stayInvolved && alumni.stayInvolved.length > 0) ||
              socialLinks.length > 0 ||
              alumni.messageToTeacher) && (
              <section className="bg-white border border-[#E5E7EB] rounded-[18px] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 text-sm text-[#1D1E20]">
                  <Icon name="volunteer_activism" className="text-[19px] text-[#2a1b63]" />
                  <span>Expertise, Contribution &amp; Links</span>
                </div>
                <div className="p-5 space-y-4">
                  {expertiseTags.length > 0 && (
                    <div>
                      <p className="text-xs text-[#8A8F98] mb-2">Areas of Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {expertiseTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-xl bg-[#FAFBFF] border border-[#E5E7EB] text-xs text-[#1D1E20]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {alumni.stayInvolved && alumni.stayInvolved.length > 0 && (
                    <div>
                      <p className="text-xs text-[#8A8F98] mb-2">Willing to Contribute As</p>
                      <div className="flex flex-wrap gap-2">
                        {alumni.stayInvolved.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F3F0FA] border border-[#DDD6F3] text-xs text-[#2a1b63]"
                          >
                            <Icon name="check_circle" className="text-[15px]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {socialLinks.length > 0 && (
                    <div>
                      <p className="text-xs text-[#8A8F98] mb-2">Social &amp; Links</p>
                      <div className="flex flex-wrap gap-2">
                        {socialLinks.map((link) => (
                          <a
                            key={link.id}
                            href={safeSocialUrl(link.value as string, link.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#FAFBFF] text-xs text-[#1D1E20] hover:bg-[#F3F0FA] hover:border-[#DDD6F3] hover:text-[#2a1b63] transition-colors"
                          >
                            <Icon name={link.icon} className="text-[16px]" />
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {alumni.messageToTeacher && (
                    <div className="p-4 rounded-2xl bg-[#FAFBFF] border border-[#E5E7EB]">
                      <div className="flex items-center gap-1.5 text-xs text-[#8A8F98] mb-1.5">
                        <Icon name="format_quote" className="text-[17px] text-[#2a1b63]" />
                        <span>Message to Teacher</span>
                      </div>
                      <p className="text-sm text-[#1D1E20] leading-relaxed">
                        &ldquo;{alumni.messageToTeacher}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            <Link
              href={`/alumni/${alumni.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-[#2a1b63] hover:underline"
            >
              <Icon name="open_in_new" className="text-[16px]" />
              <span>Open Full Profile Page</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs text-[#5F6368] hover:text-[#2a1b63] transition-colors"
              >
                <Icon name={copied ? 'check' : 'link'} className="text-[16px]" />
                <span>{copied ? 'Link Copied' : 'Copy Direct Link'}</span>
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(alumni.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-red-700 transition-colors"
                >
                  <Icon name="delete" className="text-[16px]" />
                  <span>Delete Record</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Expanded Photo Lightbox */}
      {alumni.photoURL && (
        <Dialog open={photoExpanded} onOpenChange={setPhotoExpanded}>
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-[680px] w-[94vw] p-0 overflow-hidden border border-[#E5E7EB] bg-white rounded-[20px] shadow-2xl"
          >
            <DialogTitle className="sr-only">
              Expanded Photo — {alumni.fullName}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full size profile photo for {alumni.fullName}
            </DialogDescription>

            <div className="px-5 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[#1D1E20] truncate">{alumni.fullName}</p>
                {alumni.yearOfGraduation && (
                  <p className="text-xs text-[#8A8F98]">Batch {alumni.yearOfGraduation}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPhoto}
                  className="h-9 px-3 rounded-xl border-[#E5E7EB] bg-white text-xs text-[#1D1E20] hover:bg-[#F3F0FA] hover:text-[#2a1b63] inline-flex items-center gap-1.5"
                >
                  <Icon name="download" className="text-[17px]" />
                  <span>Download</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPhotoExpanded(false)}
                  aria-label="Close expanded photo"
                  className="h-9 w-9 p-0 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA] hover:text-[#1D1E20]"
                >
                  <Icon name="close" className="text-[20px]" />
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-[#FAFBFF] flex items-center justify-center">
              <img
                src={alumni.photoURL}
                alt={alumni.fullName}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-[#E5E7EB] bg-white shadow-xs"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default AlumniDetailsDialog;
