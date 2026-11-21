'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SITE_CONFIG } from '@/data/site';

interface SuccessMessageProps {
  alumniId: string;
  fullName: string;
  schoolAttended?: string;
  yearOfGraduation?: string;
  onGoHome?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  alumniId,
  fullName,
  schoolAttended,
  yearOfGraduation,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleCopyId = async () => {
    if (!alumniId) return;
    try {
      await navigator.clipboard.writeText(alumniId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="w-full bg-white pb-16 sm:pb-24">
      {/* Compact Indigo Page Banner (matches Register & Job pages) */}
      <section className="bg-[#2a1b63] text-white py-10 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#d6be8a] mb-2">
            Registration Complete
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome to YES INDIA Alumni
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-2 max-w-xl">
            Thank you{fullName ? `, ${fullName}` : ''}. Your alumni registration has been
            submitted successfully.
          </p>
        </div>
      </section>

      {/* Open Unboxed Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 space-y-10">
        {/* Status Banner */}
        <div className="bg-[#ECFDF5] border-l-4 border-[#16A34A] p-4 sm:p-5 rounded-xl flex items-start gap-3">
          <Icon name="check_circle" className="text-[22px] text-[#16A34A] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#14532D]">
              Registration received and recorded
            </p>
            <p className="text-xs sm:text-sm text-[#166534] mt-0.5">
              Keep your Alumni Reference ID below for future inquiries and career portal access.
            </p>
          </div>
        </div>

        {/* Unboxed Registration Summary */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[#2a1b63]">
            Registration Summary
          </h2>

          <div className="border-t border-gray-200 divide-y divide-gray-200">
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs sm:text-sm text-gray-500">Full Name</span>
              <span className="text-sm sm:text-base font-medium text-[#212529]">
                {fullName || '—'}
              </span>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-gray-500">Alumni Reference ID</span>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm sm:text-base font-semibold text-[#2a1b63] break-all">
                  {alumniId || '—'}
                </span>
                {alumniId && (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-[#F3F0FA] hover:text-[#2a1b63] transition-colors cursor-pointer shrink-0"
                  >
                    <Icon name={copied ? 'check' : 'content_copy'} className="text-[14px]" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            {schoolAttended && (
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs sm:text-sm text-gray-500">School Attended</span>
                <span className="text-sm sm:text-base font-medium text-[#212529] sm:text-right">
                  {schoolAttended}
                </span>
              </div>
            )}

            {yearOfGraduation && (
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs sm:text-sm text-gray-500">Pass-out Year</span>
                <span className="text-sm sm:text-base font-medium text-[#212529]">
                  Class of {yearOfGraduation}
                </span>
              </div>
            )}

            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs sm:text-sm text-gray-500">Registration Date</span>
              <span className="text-sm sm:text-base font-medium text-[#212529]">
                {formattedDate}
              </span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {onGoHome ? (
            <Button
              type="button"
              onClick={onGoHome}
              className="h-11 px-7 rounded-lg bg-[#2a1b63] hover:bg-[#1f134c] text-white text-sm font-medium"
            >
              Return to Home
            </Button>
          ) : (
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-11 px-7 rounded-lg bg-[#2a1b63] hover:bg-[#1f134c] text-white text-sm font-medium">
                Return to Home
              </Button>
            </Link>
          )}

          <Link href="/jobs" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 rounded-lg border-gray-300 text-[#2a1b63] hover:bg-[#F3F0FA] text-sm font-medium"
            >
              Go to Job Application
            </Button>
          </Link>
        </div>

        {/* Support Footer Note */}
        <div className="pt-6 border-t border-gray-200 text-xs sm:text-sm text-gray-500">
          Need assistance with your registration? Contact{' '}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="text-[#2a1b63] font-medium hover:underline"
          >
            {SITE_CONFIG.email}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
