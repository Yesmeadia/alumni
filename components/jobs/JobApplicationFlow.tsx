'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/ui/icon';
import {
  AlumniData,
  JOB_TYPE_OPTIONS,
  JobTypeOption,
  NOTICE_PERIOD_OPTIONS,
} from '@/lib/types';
import { lookupRegisteredAlumni, submitJobApplication } from '@/lib/firebaseService';
import { validateResumeMagicBytes } from '@/lib/security';

const ALLOWED_RESUME_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

interface VerifiedAlumni {
  id: string;
  data: AlumniData;
}

export default function JobApplicationFlow() {
  const [isRegistered, setIsRegistered] = useState<'yes' | 'no' | null>(null);

  // Lookup state
  const [searchMobile, setSearchMobile] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [matches, setMatches] = useState<VerifiedAlumni[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<VerifiedAlumni | null>(null);

  // Application form state
  const [positionApplied, setPositionApplied] = useState('');
  const [jobType, setJobType] = useState<JobTypeOption>('Full-time');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [willingForAbroad, setWillingForAbroad] = useState<'Yes' | 'No'>('No');
  const [experienceYears, setExperienceYears] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediate');
  const [skills, setSkills] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const isFirstRender = useRef(true);
  const lenis = useLenis();

  const scrollToTop = useCallback(() => {
    const run = () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    run();
    requestAnimationFrame(run);
    setTimeout(run, 120);
  }, [lenis]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToTop();
  }, [selectedAlumni, submittedId, scrollToTop]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setMatches([]);
    setSelectedAlumni(null);

    const digits = searchMobile.replace(/\D/g, '');
    if (digits.length < 7 && !searchName.trim()) {
      setSearchError('Please enter your registered mobile number (at least 10 digits) or full name.');
      return;
    }

    setSearching(true);
    try {
      const results = await lookupRegisteredAlumni(searchMobile, searchName);
      setHasSearched(true);
      setMatches(results);

      if (results.length === 1) {
        selectAlumniProfile(results[0]);
      }
    } catch {
      setSearchError('Unable to verify your registration right now. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const selectAlumniProfile = (record: VerifiedAlumni) => {
    setSelectedAlumni(record);
    setExperienceYears('');
    setSkills('');
    setPreferredLocation('');
    setSubmitError('');
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      setSubmitError('Resume file must be 5MB or smaller.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    if (!ALLOWED_RESUME_MIMES.has(file.type)) {
      setSubmitError('Only PDF, DOC, and DOCX resume files are allowed.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    const validBytes = await validateResumeMagicBytes(file);
    if (!validBytes) {
      setSubmitError('Invalid resume file content. Please upload a valid PDF, DOC, or DOCX document.');
      setResumeFile(null);
      e.target.value = '';
      return;
    }
    setSubmitError('');
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumni) return;

    if (!positionApplied.trim() || !preferredLocation.trim() || !skills.trim()) {
      setSubmitError('Please fill in Position Applied For, Preferred Location, and Key Skills.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const result = await submitJobApplication(
      {
        alumniId: selectedAlumni.id,
        fullName: selectedAlumni.data.fullName,
        mobileNumber: selectedAlumni.data.mobileNumber,
        whatsappNumber: selectedAlumni.data.whatsappNumber || '',
        email: selectedAlumni.data.email || '',
        schoolAttended: selectedAlumni.data.schoolAttended || '',
        yearOfGraduation: selectedAlumni.data.yearOfGraduation || '',
        qualification: selectedAlumni.data.qualification || '',
        photoURL: selectedAlumni.data.photoURL || '',
        positionApplied: positionApplied.trim(),
        preferredLocation: preferredLocation.trim(),
        willingForAbroad,
        jobType,
        experienceYears: experienceYears.trim() || 'Fresher',
        expectedSalary: expectedSalary.trim(),
        noticePeriod,
        skills: skills.trim(),
        coverNote: coverNote.trim(),
      },
      resumeFile
    );

    setSubmitting(false);

    if (result.success) {
      setSubmittedId(result.applicationId);
    } else {
      setSubmitError(result.message);
    }
  };

  const resetFlow = () => {
    setIsRegistered(null);
    setSearchMobile('');
    setSearchName('');
    setMatches([]);
    setHasSearched(false);
    setSelectedAlumni(null);
    setPositionApplied('');
    setJobType('Full-time');
    setPreferredLocation('');
    setWillingForAbroad('No');
    setExperienceYears('');
    setExpectedSalary('');
    setNoticePeriod('Immediate');
    setSkills('');
    setCoverNote('');
    setResumeFile(null);
    setSubmitError('');
    setSubmittedId(null);
  };

  if (submittedId && selectedAlumni) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] flex items-center justify-center mx-auto">
          <Icon name="check_circle" className="text-[34px]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1b63]">
            Application Submitted
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Thank you, <span className="font-semibold text-[#1D1E20]">{selectedAlumni.data.fullName}</span>. Your application for{' '}
            <span className="font-semibold text-[#2a1b63]">{positionApplied}</span> has been received by the YES INDIA Alumni Career Desk.
          </p>
          <p className="text-xs text-gray-500 pt-1">
            Application Reference: <span className="font-mono text-[#2a1b63]">{submittedId}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button
              variant="outline"
              className="h-11 px-6 rounded-xl border-gray-300 text-[#2a1b63] hover:bg-[#F3F0FA]"
            >
              Back to Home
            </Button>
          </Link>
          <Button
            type="button"
            onClick={resetFlow}
            className="h-11 px-6 rounded-xl bg-[#2a1b63] hover:bg-[#1f134b] text-white"
          >
            Submit Another Application
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Compact Indigo Page Banner */}
      <section className="bg-[#2a1b63] text-white py-10 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Job Application
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2 max-w-xl">
            Apply for career opportunities through the YES INDIA Alumni Network. Registered alumni can verify their profile using their mobile number and name.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
        {/* Step 1: Portal Registration Check */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a5874c]">
              Step 1
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2a1b63] mt-1">
              Are you already registered on the YES INDIA Alumni Portal?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setIsRegistered('yes');
                setSearchError('');
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer ${isRegistered === 'yes'
                ? 'border-[#2a1b63] bg-[#F3F0FA]/70 ring-2 ring-[#2a1b63]/15'
                : 'border-gray-200 bg-white hover:border-[#2a1b63]/40 hover:bg-[#faf9f6]'
                }`}
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${isRegistered === 'yes'
                  ? 'bg-[#2a1b63] text-white'
                  : 'bg-[#F3F0FA] text-[#2a1b63]'
                  }`}
              >
                <Icon name="verified_user" className="text-[22px]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#1D1E20]">
                  Yes, I am registered
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Search your profile by mobile number and name to continue your job application.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegistered('no');
                setSelectedAlumni(null);
                setMatches([]);
                setHasSearched(false);
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer ${isRegistered === 'no'
                ? 'border-[#a5874c] bg-[#FFFBEB]/70 ring-2 ring-[#a5874c]/15'
                : 'border-gray-200 bg-white hover:border-[#a5874c]/50 hover:bg-[#faf9f6]'
                }`}
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${isRegistered === 'no'
                  ? 'bg-[#a5874c] text-white'
                  : 'bg-[#FFFBEB] text-[#a5874c]'
                  }`}
              >
                <Icon name="person_add" className="text-[22px]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#1D1E20]">
                  No, I haven&apos;t registered yet
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Complete your alumni registration first before submitting a job application.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Branch A: Not Registered Yet */}
        {isRegistered === 'no' && (
          <div className="py-8 border-t border-gray-200 space-y-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#FFFBEB] text-[#a5874c] border border-[#FDE68A] flex items-center justify-center shrink-0">
                <Icon name="info" className="text-[24px]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-[#2a1b63]">
                  Alumni Registration Required First
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  To apply for jobs through the YES INDIA Alumni Career Portal, please register your alumni profile first. Once registered, return here and verify using your mobile number and name.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link href="/register">
                    <Button className="h-11 px-6 rounded-xl bg-[#2a1b63] hover:bg-[#1f134b] text-white inline-flex items-center gap-2">
                      <Icon name="how_to_reg" className="text-[18px]" />
                      Register on Alumni Portal
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRegistered('yes')}
                    className="h-11 px-5 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    I already registered
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branch B: Registered -> Lookup by Mobile & Name */}
        {isRegistered === 'yes' && !selectedAlumni && (
          <div className="pt-8 border-t border-gray-200 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a5874c]">
                Step 2
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2a1b63] mt-1">
                Find Your Registered Alumni Profile
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter your registered mobile number and full name to fetch your details.
              </p>
            </div>

            <form onSubmit={handleLookup} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="lookup-mobile" className="text-sm text-gray-700">
                    Registered Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Icon
                      name="call"
                      className="text-[18px] text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <Input
                      id="lookup-mobile"
                      type="tel"
                      value={searchMobile}
                      onChange={(e) => setSearchMobile(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lookup-name" className="text-sm text-gray-700">
                    Full Name (optional to narrow results)
                  </Label>
                  <div className="relative">
                    <Icon
                      name="person"
                      className="text-[18px] text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                    <Input
                      id="lookup-name"
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {searchError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                  <Icon name="error" className="text-[18px] shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={searching}
                className="h-11 px-6 rounded-xl bg-[#2a1b63] hover:bg-[#1f134b] text-white inline-flex items-center gap-2"
              >
                <Icon name="search" className="text-[18px]" />
                <span>{searching ? 'Searching Registry...' : 'Verify & Fetch Details'}</span>
              </Button>
            </form>

            {/* Multiple Matches Picker */}
            {hasSearched && matches.length > 1 && (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-[#1D1E20]">
                  Multiple profiles matched. Select your profile to continue:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {matches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectAlumniProfile(item)}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-[#2a1b63] hover:bg-[#F3F0FA]/50 text-left flex items-center gap-3.5 transition-all cursor-pointer"
                    >
                      <Avatar className="h-12 w-12 rounded-xl border border-gray-200 shrink-0">
                        <AvatarImage src={item.data.photoURL || undefined} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-[#F3F0FA] text-[#2a1b63]">
                          {item.data.fullName?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1D1E20] truncate">
                          {item.data.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.data.schoolAttended || 'YES INDIA'} · Batch{' '}
                          {item.data.yearOfGraduation || '—'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.data.mobileNumber}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Not Found Notice */}
            {hasSearched && matches.length === 0 && !searching && (
              <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="person_search" className="text-[22px] text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1D1E20]">
                      No matching alumni registration found
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Double-check your registered mobile number or name, or complete your alumni registration first.
                    </p>
                  </div>
                </div>
                <div className="pl-8">
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="h-9 px-4 rounded-xl bg-[#2a1b63] hover:bg-[#1f134b] text-white inline-flex items-center gap-1.5"
                    >
                      <Icon name="person_add" className="text-[16px]" />
                      Register on Alumni Portal
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Job Application Form (Verified Alumni) */}
        {isRegistered === 'yes' && selectedAlumni && (
          <div className="pt-8 border-t border-gray-200 space-y-8">
            {/* Verified Alumni Summary Banner */}
            <div className="p-5 rounded-2xl bg-[#F3F0FA]/60 border border-[#DDD6F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14 rounded-2xl border border-white shadow-xs shrink-0">
                  <AvatarImage
                    src={selectedAlumni.data.photoURL || undefined}
                    alt={selectedAlumni.data.fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-2xl bg-[#2a1b63] text-white text-lg">
                    {selectedAlumni.data.fullName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-[#1D1E20] truncate">
                      {selectedAlumni.data.fullName}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]">
                      <Icon name="verified" className="text-[13px]" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {selectedAlumni.data.schoolAttended || 'YES INDIA'} · Batch{' '}
                    {selectedAlumni.data.yearOfGraduation || '—'} ·{' '}
                    {selectedAlumni.data.mobileNumber}
                  </p>
                  {selectedAlumni.data.qualification && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qualification: {selectedAlumni.data.qualification}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAlumni(null);
                  setHasSearched(false);
                  setMatches([]);
                }}
                className="h-9 px-3.5 rounded-xl border-[#DDD6F3] bg-white text-xs text-[#2a1b63] hover:bg-[#F3F0FA] shrink-0 self-start sm:self-center"
              >
                Change Profile
              </Button>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a5874c]">
                Step 3
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2a1b63] mt-1">
                Job Application Details
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Your alumni profile details are attached automatically. Complete your career preferences below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="positionApplied" className="text-sm text-gray-700">
                    Position / Role Applying For <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="positionApplied"
                    value={positionApplied}
                    onChange={(e) => setPositionApplied(e.target.value)}
                    className="h-11 rounded-xl border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">
                    Job Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={jobType}
                    onValueChange={(val) => setJobType(val as JobTypeOption)}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-300">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredLocation" className="text-sm text-gray-700">
                    Preferred Work Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="preferredLocation"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="h-11 rounded-xl border-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="text-sm text-gray-700">
                    Total Experience
                  </Label>
                  <Input
                    id="experienceYears"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="h-11 rounded-xl border-gray-300"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5">
                  <span className="text-sm text-gray-700 leading-snug">
                    Would you be interested in exploring job opportunities abroad facilitated by the YES India Foundation?
                  </span>
                  <div className="inline-flex items-center gap-2 shrink-0 self-start sm:self-center">
                    {(['Yes', 'No'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setWillingForAbroad(option)}
                        className={`px-4 py-1.5 rounded-lg text-sm border transition-colors cursor-pointer ${
                          willingForAbroad === option
                            ? 'bg-[#2a1b63] text-white border-[#2a1b63]'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-[#F3F0FA] hover:text-[#2a1b63]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedSalary" className="text-sm text-gray-700">
                    Expected Salary / CTC (Optional)
                  </Label>
                  <Input
                    id="expectedSalary"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="h-11 rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-700">Notice Period / Availability</Label>
                  <Select value={noticePeriod} onValueChange={setNoticePeriod}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-300">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTICE_PERIOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm text-gray-700">
                  Key Skills <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="h-11 rounded-xl border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeUpload" className="text-sm text-gray-700">
                  Upload Resume / CV (Optional — PDF, DOC, DOCX, max 5MB)
                </Label>
                <Input
                  id="resumeUpload"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleResumeChange}
                  className="h-11 rounded-xl border-gray-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#F3F0FA] file:text-[#2a1b63]"
                />
                {resumeFile && (
                  <p className="text-xs text-[#2a1b63] flex items-center gap-1.5">
                    <Icon name="description" className="text-[15px]" />
                    <span>{resumeFile.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverNote" className="text-sm text-gray-700">
                  Brief Cover Note / Additional Information (Optional)
                </Label>
                <Textarea
                  id="coverNote"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  rows={4}
                  className="rounded-xl border-gray-300"
                />
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                  <Icon name="error" className="text-[18px] shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFlow}
                  className="h-11 px-5 rounded-xl border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-7 rounded-xl bg-[#2a1b63] hover:bg-[#1f134b] text-white inline-flex items-center gap-2"
                >
                  <Icon name="send" className="text-[18px]" />
                  <span>{submitting ? 'Submitting...' : 'Submit Job Application'}</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
