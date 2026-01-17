// utils/exportData.ts
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';

  // 1. Convert to string
  let stringValue = String(value);

  // 2. Handle arrays (like stayInvolved) by joining them
  if (Array.isArray(value)) {
    stringValue = value.join('; ');
  }

  // 3. Replace actual newlines with spaces to ensure single line per record
  stringValue = stringValue.replace(/(\r\n|\n|\r)/g, ' ');

  // 4. Escape quotes (replace " with "")
  // 5. Wrap in quotes if it contains commas or quotes
  if (stringValue.includes(',') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const exportAlumniToCSV = (alumniList: AlumniWithId[], filename: string) => {
  const headers = [
    'Full Name',
    'Mobile Number',
    'WhatsApp Number',
    'Address',
    'Place',
    'State',
    'District',
    'Pin Code',
    'School Attended',
    'Year of Graduation',
    'Last Class Attended',
    'Current Job Title',
    'Company Name',
    'Industry',
    'Qualification',
    'Expertise',
    'Years of Exp',
    'Willing to Contribute As',
    'Message to Teacher',
    'LinkedIn',
    'Registration Date',
    'ID'
  ];

  const csvContent = alumniList.map((alumni) => {
    return [
      alumni.fullName,
      alumni.mobileNumber,
      alumni.whatsappNumber,
      alumni.address,
      alumni.place,
      alumni.state,
      alumni.district,
      alumni.pinCode,
      alumni.schoolAttended,
      alumni.yearOfGraduation,
      alumni.lastClassAttended === 'Other' ? alumni.otherClass : alumni.lastClassAttended,
      alumni.currentJobTitle,
      alumni.companyName,
      alumni.industry,
      alumni.qualification,
      alumni.areasOfExpertise,
      alumni.yearsOfExperience,
      alumni.stayInvolved, // processed by escapeCSV if array
      alumni.messageToTeacher,
      alumni.linkedinLink || alumni.socialMediaLink,
      alumni.registrationDate ? new Date(alumni.registrationDate).toLocaleDateString() : '',
      alumni.id
    ].map(escapeCSV).join(',');
  });

  const csv = [headers.join(','), ...csvContent].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
