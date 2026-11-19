import PublicLayout from '@/components/layout/PublicLayout';
import JobApplicationFlow from '@/components/jobs/JobApplicationFlow';

export const metadata = {
  title: 'Job Application - YES INDIA Alumni',
  description: 'Apply for career opportunities through the YES INDIA Alumni Portal',
};

export default function JobApplicationPage() {
  return (
    <PublicLayout>
      <JobApplicationFlow />
    </PublicLayout>
  );
}
