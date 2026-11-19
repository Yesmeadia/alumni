// utils/exportData.ts
import writeXlsxFile from 'write-excel-file/browser';
import type { Row, SheetData } from 'write-excel-file/browser';
import { AlumniData } from '@/lib/types';

export interface AlumniWithId extends AlumniData {
  id: string;
}

export interface AlumniExportFilters {
  batch?: string;
  school?: string;
  job?: string;
  gender?: string;
  state?: string;
  industry?: string;
}

const sanitizeSpreadsheetCell = (value: any): string => {
  if (value === null || value === undefined) return '';
  let str = Array.isArray(value) ? value.join('; ') : String(value);
  str = str.replace(/(\r\n|\n|\r)/g, ' ').trim();
  // Neutralize Excel/CSV formula injection (OWASP A03)
  if (/^[=+\-@\t]/.test(str)) {
    str = `'${str}`;
  }
  return str;
};

const escapeCSV = (value: any): string => {
  const stringValue = sanitizeSpreadsheetCell(value);
  if (stringValue.includes(',') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const EXPORT_COLUMNS: {
  header: string;
  width: number;
  getValue: (a: AlumniWithId) => any;
}[] = [
  { header: 'Full Name', width: 24, getValue: (a) => a.fullName },
  { header: 'Gender', width: 12, getValue: (a) => a.gender || '' },
  { header: 'Mobile Number', width: 16, getValue: (a) => a.mobileNumber },
  { header: 'WhatsApp Number', width: 16, getValue: (a) => a.whatsappNumber },
  { header: 'Email', width: 24, getValue: (a) => a.email || '' },
  { header: 'School Attended', width: 32, getValue: (a) => a.schoolAttended },
  { header: 'Batch / Year', width: 14, getValue: (a) => a.yearOfGraduation },
  {
    header: 'Last Class Attended',
    width: 18,
    getValue: (a) => (a.lastClassAttended === 'Other' ? a.otherClass : a.lastClassAttended),
  },
  { header: 'Qualification', width: 20, getValue: (a) => a.qualification },
  { header: 'Job Title', width: 22, getValue: (a) => a.currentJobTitle },
  { header: 'Company / Organization', width: 24, getValue: (a) => a.companyName },
  { header: 'Industry', width: 20, getValue: (a) => a.industry },
  { header: 'Experience', width: 14, getValue: (a) => a.yearsOfExperience },
  { header: 'Expertise', width: 22, getValue: (a) => a.areasOfExpertise },
  { header: 'Address', width: 30, getValue: (a) => a.address },
  { header: 'City / Place', width: 16, getValue: (a) => a.place },
  { header: 'District', width: 16, getValue: (a) => a.district || '' },
  { header: 'State', width: 20, getValue: (a) => a.state },
  { header: 'Pin Code', width: 12, getValue: (a) => a.pinCode },
  { header: 'Willing to Contribute As', width: 26, getValue: (a) => a.stayInvolved },
  { header: 'LinkedIn', width: 24, getValue: (a) => a.linkedinLink || a.socialMediaLink },
  { header: 'Message to Teacher', width: 30, getValue: (a) => a.messageToTeacher },
  {
    header: 'Registration Date',
    width: 16,
    getValue: (a) => (a.registrationDate ? new Date(a.registrationDate).toLocaleDateString() : ''),
  },
  { header: 'ID', width: 22, getValue: (a) => a.id },
];

export function buildExportFilename(filters?: AlumniExportFilters): string {
  const parts = ['yes-india-alumni'];
  const slug = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 24);

  if (filters?.batch && filters.batch !== 'all') parts.push(`batch-${slug(filters.batch)}`);
  if (filters?.gender && filters.gender !== 'all') parts.push(slug(filters.gender));
  if (filters?.school && filters.school !== 'all') parts.push(slug(filters.school));
  if (filters?.job && filters.job !== 'all') parts.push(slug(filters.job));
  if (filters?.state && filters.state !== 'all') parts.push(slug(filters.state));
  if (filters?.industry && filters.industry !== 'all') parts.push(slug(filters.industry));

  parts.push(new Date().toISOString().split('T')[0]);
  return parts.join('-');
}

export const exportAlumniToExcel = async (
  alumniList: AlumniWithId[],
  filename: string
): Promise<void> => {
  const headerRow: Row = EXPORT_COLUMNS.map((col) => ({
    value: col.header,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: '#2a1b63',
    alignVertical: 'center',
  }));

  const dataRows: Row[] = alumniList.map((alumni) =>
    EXPORT_COLUMNS.map((col) => ({
      type: String,
      value: sanitizeSpreadsheetCell(col.getValue(alumni)),
    }))
  );

  const sheetData: SheetData = [headerRow, ...dataRows];
  const columns = EXPORT_COLUMNS.map((col) => ({ width: col.width }));
  const finalName = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;

  await writeXlsxFile(sheetData, {
    columns,
    sheet: 'Alumni Registry',
    stickyRowsCount: 1,
  }).toFile(finalName);
};

export const exportAlumniToCSV = (alumniList: AlumniWithId[], filename: string) => {
  const headers = EXPORT_COLUMNS.map((c) => c.header);
  const csvRows = alumniList.map((alumni) =>
    EXPORT_COLUMNS.map((col) => escapeCSV(col.getValue(alumni))).join(',')
  );

  const csv = [headers.join(','), ...csvRows].join('\n');

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
