// utils/exportData.ts
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

export const exportAlumniToCSV = (alumniList: AlumniWithId[], p0: string) => {
  const headers = [
    'Full Name',
    'Mobile',
    'WhatsApp',
    'Place',
    'State',
    'School',
    'Batch',
    'Last Class',
    'Current Job',
    'Company',
    'Qualification',
  ];

  const csvData = alumniList.map((alumni) => [
    alumni.fullName,
    alumni.mobileNumber,
    alumni.whatsappNumber,
    alumni.address,
    alumni.place,
    alumni.state,
    alumni.schoolAttended,
    alumni.yearOfGraduation,
    alumni.lastClassAttended === 'Other' ? alumni.otherClass : alumni.lastClassAttended,
    alumni.currentJobTitle,
    alumni.companyName,
    alumni.qualification,
    alumni.stayInvolved,
    alumni.messageToTeacher,
    alumni.photoURL,
  ]);

  const csv = [headers, ...csvData].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yes-india-alumni-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
