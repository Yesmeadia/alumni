'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/ui/icon';
import { toast } from 'sonner';
import {
  JOB_TYPE_OPTIONS,
  JobTypeOption,
  NOTICE_PERIOD_OPTIONS,
} from '@/lib/types';
import { validateResumeMagicBytes } from '@/lib/security';

export interface RegistrationJobFormData {
  positionApplied: string;
  jobType: JobTypeOption;
  preferredLocation: string;
  willingForAbroad: 'Yes' | 'No';
  experienceYears: string;
  expectedSalary: string;
  noticePeriod: string;
  skills: string;
  coverNote: string;
}

interface JobApplicationStepProps {
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  jobData: RegistrationJobFormData;
  onJobDataChange: (data: Partial<RegistrationJobFormData>) => void;
  resumeFile: File | null;
  onResumeChange: (file: File | null) => void;
}

const ALLOWED_RESUME_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const inputClass =
  'bg-white border-gray-300 rounded-lg focus:border-[#2a1b63] focus:ring-[#2a1b63]/15';

const JobApplicationStep: React.FC<JobApplicationStepProps> = ({
  enabled,
  onToggleEnabled,
  jobData,
  onJobDataChange,
  resumeFile,
  onResumeChange,
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      onResumeChange(null);
      return;
    }
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      toast.error('Resume file must be 5MB or smaller.');
      onResumeChange(null);
      e.target.value = '';
      return;
    }
    if (!ALLOWED_RESUME_MIMES.has(file.type)) {
      toast.error('Only PDF, DOC, and DOCX resume files are allowed.');
      onResumeChange(null);
      e.target.value = '';
      return;
    }
    const validBytes = await validateResumeMagicBytes(file);
    if (!validBytes) {
      toast.error('Invalid resume file content. Please upload a valid PDF, DOC, or DOCX file.');
      onResumeChange(null);
      e.target.value = '';
      return;
    }
    onResumeChange(file);
  };

  return (
    <div className="space-y-8">
      {/* On/Off Toggle Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-gray-200 bg-[#faf9f6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="min-w-0">
            <p className="text-base font-semibold text-[#212529]">
              Apply for a Job Through Alumni Portal?
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Turn ON to include a job application with your registration, or leave OFF to skip.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 shrink-0 pl-14 sm:pl-0">
          <span
            className={`text-xs font-semibold tracking-wide uppercase ${enabled ? 'text-[#2a1b63]' : 'text-gray-400'
              }`}
          >
            {enabled ? 'ON' : 'OFF'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Apply for a job"
            onClick={() => onToggleEnabled(!enabled)}
            className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2a1b63]/30 focus:ring-offset-2 ${enabled ? 'bg-[#2a1b63]' : 'bg-gray-300'
              }`}
          >
            <span
              className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-7' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>

      {enabled && (
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="reg-positionApplied" className="text-sm font-semibold text-[#212529]">
                Position / Role Applying For <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reg-positionApplied"
                value={jobData.positionApplied}
                onChange={(e) => onJobDataChange({ positionApplied: e.target.value })}
                className={`h-11 ${inputClass}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#212529]">
                Job Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={jobData.jobType}
                onValueChange={(val) => onJobDataChange({ jobType: val as JobTypeOption })}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue />
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
              <Label
                htmlFor="reg-preferredLocation"
                className="text-sm font-semibold text-[#212529]"
              >
                Preferred Work Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="reg-preferredLocation"
                value={jobData.preferredLocation}
                onChange={(e) => onJobDataChange({ preferredLocation: e.target.value })}
                className={`h-11 ${inputClass}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-experienceYears" className="text-sm font-semibold text-[#212529]">
                Total Experience
              </Label>
              <Input
                id="reg-experienceYears"
                value={jobData.experienceYears}
                onChange={(e) => onJobDataChange({ experienceYears: e.target.value })}
                className={`h-11 ${inputClass}`}
              />
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-3.5">
              <span className="text-sm font-semibold text-[#212529] leading-snug">
                Would you be interested in exploring job opportunities abroad facilitated by the YES India Foundation?
              </span>
              <div className="inline-flex items-center gap-2 shrink-0 self-start sm:self-center">
                {(['Yes', 'No'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onJobDataChange({ willingForAbroad: option })}
                    className={`px-4 py-1.5 rounded-lg text-sm border transition-colors cursor-pointer ${
                      jobData.willingForAbroad === option
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
              <Label htmlFor="reg-expectedSalary" className="text-sm font-semibold text-[#212529]">
                Expected Salary / CTC (Optional)
              </Label>
              <Input
                id="reg-expectedSalary"
                value={jobData.expectedSalary}
                onChange={(e) => onJobDataChange({ expectedSalary: e.target.value })}
                className={`h-11 ${inputClass}`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#212529]">
                Notice Period / Availability
              </Label>
              <Select
                value={jobData.noticePeriod}
                onValueChange={(val) => onJobDataChange({ noticePeriod: val })}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue />
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
            <Label htmlFor="reg-skills" className="text-sm font-semibold text-[#212529]">
              Key Skills <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reg-skills"
              value={jobData.skills}
              onChange={(e) => onJobDataChange({ skills: e.target.value })}
              className={`h-11 ${inputClass}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-resumeUpload" className="text-sm font-semibold text-[#212529]">
              Upload Resume / CV (Optional — PDF, DOC, DOCX, max 5MB)
            </Label>
            <Input
              id="reg-resumeUpload"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className={`h-11 ${inputClass} file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#F3F0FA] file:text-[#2a1b63]`}
            />
            {resumeFile && (
              <div className="flex items-center justify-between gap-2 text-xs text-[#2a1b63]">
                <span className="flex items-center gap-1.5 truncate">
                  <Icon name="description" className="text-[15px]" />
                  <span className="truncate">{resumeFile.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onResumeChange(null)}
                  className="text-red-600 hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-coverNote" className="text-sm font-semibold text-[#212529]">
              Brief Cover Note (Optional)
            </Label>
            <Textarea
              id="reg-coverNote"
              value={jobData.coverNote}
              onChange={(e) => onJobDataChange({ coverNote: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationStep;
