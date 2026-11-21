'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import SuccessMessage from '@/components/registration/SuccessMessage';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const alumniId = searchParams.get('id') || '';
  const fullName = searchParams.get('name') || '';
  const schoolAttended = searchParams.get('school') || '';
  const yearOfGraduation = searchParams.get('batch') || '';

  return (
    <SuccessMessage
      alumniId={alumniId}
      fullName={fullName}
      schoolAttended={schoolAttended}
      yearOfGraduation={yearOfGraduation}
    />
  );
}

export default function RegistrationSuccessPage() {
  return (
    <PublicLayout>
      <Suspense fallback={null}>
        <RegistrationSuccessContent />
      </Suspense>
    </PublicLayout>
  );
}
