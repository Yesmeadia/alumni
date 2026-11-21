'use client';

import React from 'react';
import { Icon } from '@/components/ui/icon';
import { AlumniData } from '@/lib/types';
import { RegistrationJobFormData } from './JobApplicationStep';

interface PreviewPDFProps {
  formData: Partial<AlumniData>;
  imagePreview: string;
  applyForJob?: boolean;
  jobData?: RegistrationJobFormData;
  resumeFile?: File | null;
}

const PreviewPDF: React.FC<PreviewPDFProps> = ({
  formData,
  imagePreview,
  applyForJob,
  jobData,
  resumeFile,
}) => {
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const lastClass =
    formData.lastClassAttended === 'Other'
      ? formData.otherClass || 'Other'
      : formData.lastClassAttended || '—';

  const socialItems = [
    { label: 'Facebook', value: formData.facebookLink, icon: 'public' },
    { label: 'Instagram', value: formData.instagramLink, icon: 'photo_camera' },
    { label: 'Twitter / X', value: formData.twitterLink, icon: 'alternate_email' },
    { label: 'LinkedIn', value: formData.linkedinLink, icon: 'work_outline' },
  ].filter((item) => Boolean(item.value));

  const expertiseList = (formData.areasOfExpertise || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Important Notice */}
      <div className="bg-[#f7f4ed] p-4 rounded-xl border-l-4 border-[#a5874c] flex items-start gap-3">
        <p className="text-sm text-[#212529] leading-relaxed">
          <strong className="text-[#2a1b63]">Please verify carefully:</strong> Once submitted,
          changes require administrator assistance. Use the step tabs above or Previous button to
          edit any section before submitting.
        </p>
      </div>

      {/* Unboxed Profile Summary Header */}
      <div className="pb-8 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt={formData.fullName || 'Alumni'}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#a5874c] shrink-0"
          />
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#F3F0FA] border border-[#DDD6F3] text-[#2a1b63] flex items-center justify-center text-3xl font-display font-bold shrink-0 uppercase">
            {formData.fullName?.charAt(0) || 'A'}
          </div>
        )}

        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1b63] leading-tight">
              {formData.fullName || 'Alumni Applicant'}
            </h3>
            {formData.yearOfGraduation && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f7f4ed] text-[#a5874c] border border-[#a5874c]/30">
                Batch {formData.yearOfGraduation}
              </span>
            )}
          </div>
          {formData.schoolAttended && (
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <span>{formData.schoolAttended}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-0.5">
            {formData.mobileNumber && (
              <span className="inline-flex items-center gap-1">
                {formData.mobileNumber}
              </span>
            )}
            {formData.gender && (
              <span className="inline-flex items-center gap-1">
                {formData.gender}
              </span>
            )}
            {(formData.place || formData.state) && (
              <span className="inline-flex items-center gap-1">
                {[formData.place, formData.district, formData.state].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 1: Personal & Address Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            Personal &amp; Contact Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.fullName || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.gender || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Mobile Number</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.mobileNumber || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">WhatsApp Number</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.whatsappNumber || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email Address</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5 break-all">
              {formData.email || '—'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.address || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">City / Place</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.place || '—'}
            </p>
          </div>
          {formData.district && (
            <div>
              <p className="text-xs text-gray-500">District</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">{formData.district}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">State</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.state || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pin Code</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.pinCode || '—'}
            </p>
          </div>
        </div>

        {socialItems.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-2">Social Profiles</p>
            <div className="flex flex-wrap gap-2">
              {socialItems.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faf9f6] border border-gray-200 text-xs text-[#212529] break-all"
                >
                  <span>{item.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Educational Background */}
      <section className="pt-8 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            Educational Background
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-gray-500">School Attended</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.schoolAttended || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pass-out Year</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.yearOfGraduation || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Class Attended</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">{lastClass}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Highest Qualification</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.qualification || '—'}
            </p>
          </div>
          {formData.additionalQualification && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs text-gray-500">Additional Qualifications</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {formData.additionalQualification}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Professional Details */}
      <section className="pt-8 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-[#2a1b63]">
            Professional Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          <div>
            <p className="text-xs text-gray-500">Job Title</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.currentJobTitle || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Company / Organization</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.companyName || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Industry</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.industry || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Experience</p>
            <p className="text-sm font-medium text-[#212529] mt-0.5">
              {formData.yearsOfExperience ? `${formData.yearsOfExperience} years` : '—'}
            </p>
          </div>
        </div>

        {expertiseList.length > 0 && (
          <div className="pt-1">
            <p className="text-xs text-gray-500 mb-2">Areas of Expertise</p>
            <div className="flex flex-wrap gap-2">
              {expertiseList.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#faf9f6] border border-gray-200 text-xs text-[#212529]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Section 4: Job Application (if opted in) */}
      {applyForJob && jobData && (
        <section className="pt-8 border-t border-gray-200 space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="work" className="text-[20px] text-[#2a1b63]" />
            <h3 className="font-display text-lg font-bold text-[#2a1b63]">
              Job Application Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-xs text-gray-500">Position Applying For</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {jobData.positionApplied || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Job Type</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">{jobData.jobType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Preferred Work Location</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {jobData.preferredLocation || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Willing to Work Abroad</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {jobData.willingForAbroad}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Experience</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {jobData.experienceYears || 'Fresher'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Notice Period</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {jobData.noticePeriod || '—'}
              </p>
            </div>
            {jobData.expectedSalary && (
              <div>
                <p className="text-xs text-gray-500">Expected Salary / CTC</p>
                <p className="text-sm font-medium text-[#212529] mt-0.5">
                  {jobData.expectedSalary}
                </p>
              </div>
            )}
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs text-gray-500">Key Skills</p>
              <p className="text-sm font-medium text-[#212529] mt-0.5">
                {jobData.skills || '—'}
              </p>
            </div>
            {resumeFile && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-gray-500">Uploaded Resume</p>
                <p className="text-sm font-medium text-[#2a1b63] mt-0.5 flex items-center gap-1.5">
                  <Icon name="description" className="text-[16px]" />
                  <span>{resumeFile.name}</span>
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 5: Involvement & Message */}
      {((formData.stayInvolved && formData.stayInvolved.length > 0) ||
        formData.messageToTeacher) && (
          <section className="pt-8 border-t border-gray-200 space-y-5">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-[#2a1b63]">
                Community Involvement &amp; Reflection
              </h3>
            </div>

            {formData.stayInvolved && formData.stayInvolved.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2.5">Ways to Stay Involved</p>
                <div className="flex flex-wrap gap-2">
                  {formData.stayInvolved.map((option: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3F0FA] border border-[#DDD6F3] text-xs font-medium text-[#2a1b63]"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.messageToTeacher && (
              <div className="p-4 rounded-xl bg-[#faf9f6] border-l-4 border-[#2a1b63]">
                <p className="text-xs text-gray-500 mb-1">Message to Teacher</p>
                <p className="text-sm text-[#212529] leading-relaxed">
                  &ldquo;{formData.messageToTeacher}&rdquo;
                </p>
              </div>
            )}
          </section>
        )}

      {/* Ready to Submit Confirmation */}
      <div className="bg-[#ECFDF5] border-l-4 border-[#16A34A] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-3">
          <p className="text-sm text-[#14532D] leading-relaxed">
            <strong className="font-semibold">Ready to submit:</strong> Click{' '}
            <strong>Submit Registration</strong> below to complete your registration.
          </p>
        </div>
        <span className="text-xs text-[#166534] shrink-0 pl-8 sm:pl-0">{formattedDate}</span>
      </div>
    </div>
  );
};

export default PreviewPDF;
