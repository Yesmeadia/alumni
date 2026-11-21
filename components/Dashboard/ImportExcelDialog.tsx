'use client';

import React, { useState } from 'react';
import { readSheet } from 'read-excel-file/browser';
import { ref, push, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/ui/icon';
import { sanitizeText, sanitizeMultilineText, isSafeFirebaseStorageUrl } from '@/lib/security';
import { AlumniData } from '@/lib/types';

interface ImportExcelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedAlumniRow {
  existingId?: string;
  data: Omit<AlumniData, 'id'>;
}

const cleanCell = (val: unknown): string => {
  if (val === null || val === undefined) return '';
  if (val instanceof Date) return val.toISOString().split('T')[0];
  let str = String(val).trim();
  if (str.startsWith("'") && /^'[=+\-@\t]/.test(str)) {
    str = str.slice(1);
  }
  return str;
};

const parseRegistrationDate = (raw: string): string => {
  if (!raw) return new Date().toISOString();
  // Support D/M/YYYY or DD/MM/YYYY format (e.g. 13/1/2026)
  const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = Number(dmy[3]);
    const dt = new Date(Date.UTC(year, month - 1, day));
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }
  return new Date().toISOString();
};

const isValidFirebaseKey = (key: string): boolean => {
  if (!key || key.length > 128) return false;
  if (key.toLowerCase() === 'full name') return false;
  return !/[.#$\[\]/]/.test(key);
};

// RFC-4180 compliant CSV parser supporting quoted commas and escaped quotes
function parseCSVText(text: string): string[][] {
  // Split accidentally concatenated header lines (e.g., ",Full Name,Mobile Number,")
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/,(Full Name,Mobile Number,)/g, '\n$1');

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    const next = normalized[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\n') {
        row.push(field);
        if (row.some((c) => c.trim() !== '')) {
          rows.push(row);
        }
        row = [];
        field = '';
      } else {
        field += ch;
      }
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((c) => c.trim() !== '')) {
      rows.push(row);
    }
  }

  return rows;
}

export default function ImportExcelDialog({
  isOpen,
  onOpenChange,
}: ImportExcelDialogProps) {
  const [mode, setMode] = useState<'file' | 'paste'>('file');
  const [fileName, setFileName] = useState('');
  const [pastedCsv, setPastedCsv] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedAlumniRow[]>([]);
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    failed: number;
  } | null>(null);

  const resetState = () => {
    setFileName('');
    setPastedCsv('');
    setParsedRows([]);
    setParseError('');
    setImporting(false);
    setImportResult(null);
  };

  const handleClose = (open: boolean) => {
    if (!open && !importing) {
      resetState();
    }
    if (!importing) {
      onOpenChange(open);
    }
  };

  const mapRowsToAlumni = (rows: unknown[][]) => {
    if (!rows || rows.length < 2) {
      setParseError('No data rows found to import.');
      return;
    }

    const headers = rows[0].map((h) => cleanCell(h).toLowerCase());
    const colIndex = (aliases: string[]): number =>
      headers.findIndex((h) => aliases.includes(h));

    const idxName = colIndex(['full name', 'name']);
    const idxGender = colIndex(['gender']);
    const idxMobile = colIndex(['mobile number', 'mobile', 'phone']);
    const idxWhatsapp = colIndex(['whatsapp number', 'whatsapp']);
    const idxEmail = colIndex(['email', 'email address']);
    const idxSchool = colIndex(['school attended', 'school', 'institution']);
    const idxBatch = colIndex(['batch / year', 'batch', 'year of graduation', 'pass-out year']);
    const idxLastClass = colIndex(['last class attended', 'last class']);
    const idxQualification = colIndex(['qualification', 'highest qualification']);
    const idxJobTitle = colIndex(['job title', 'current job title', 'designation']);
    const idxCompany = colIndex(['company / organization', 'company', 'company name', 'organization']);
    const idxIndustry = colIndex(['industry']);
    const idxExperience = colIndex(['experience', 'years of experience', 'years of exp']);
    const idxExpertise = colIndex(['expertise', 'areas of expertise']);
    const idxAddress = colIndex(['address']);
    const idxPlace = colIndex(['city / place', 'city', 'place']);
    const idxDistrict = colIndex(['district']);
    const idxState = colIndex(['state']);
    const idxPinCode = colIndex(['pin code', 'pincode', 'zip']);
    const idxInvolved = colIndex(['willing to contribute as', 'stay involved', 'involvement']);
    const idxLinkedin = colIndex(['linkedin', 'linkedin link']);
    const idxMessage = colIndex(['message to teacher', 'message']);
    const idxRegDate = colIndex(['registration date', 'registered on']);
    const idxPhoto = colIndex(['photo url', 'photourl', 'photo']);
    const idxId = colIndex(['id', 'record id', 'alumni id']);

    if (idxName === -1) {
      setParseError('Could not find a "Full Name" column in the header row.');
      return;
    }

    const getVal = (row: unknown[], idx: number) =>
      idx >= 0 && idx < row.length ? cleanCell(row[idx]) : '';

    const mapped: ParsedAlumniRow[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const fullName = sanitizeText(getVal(row, idxName), 120);
      if (!fullName || fullName.toLowerCase() === 'full name') continue;

      const mobileNumber = sanitizeText(getVal(row, idxMobile), 20);
      const whatsappNumber = sanitizeText(getVal(row, idxWhatsapp), 20) || mobileNumber;
      const rawInvolved = getVal(row, idxInvolved);
      const stayInvolved = rawInvolved
        ? rawInvolved
            .split(';')
            .map((s) => sanitizeText(s, 80))
            .filter(Boolean)
        : [];

      const rawId = getVal(row, idxId);
      const existingId = isValidFirebaseKey(rawId) ? rawId : undefined;
      const regDateIso = parseRegistrationDate(getVal(row, idxRegDate));

      mapped.push({
        existingId,
        data: {
          fullName,
          gender: sanitizeText(getVal(row, idxGender), 20),
          mobileNumber,
          whatsappNumber,
          email: sanitizeText(getVal(row, idxEmail), 160),
          schoolAttended: sanitizeText(getVal(row, idxSchool), 180) || 'YES INDIA School',
          yearOfGraduation: sanitizeText(getVal(row, idxBatch), 10),
          lastClassAttended: sanitizeText(getVal(row, idxLastClass), 40),
          qualification: sanitizeText(getVal(row, idxQualification), 120),
          currentJobTitle: sanitizeText(getVal(row, idxJobTitle), 120),
          companyName: sanitizeText(getVal(row, idxCompany), 140),
          industry: sanitizeText(getVal(row, idxIndustry), 100),
          yearsOfExperience: sanitizeText(getVal(row, idxExperience), 30),
          areasOfExpertise: sanitizeText(getVal(row, idxExpertise), 300),
          professionalInterests: '',
          address: sanitizeMultilineText(getVal(row, idxAddress), 400),
          place: sanitizeText(getVal(row, idxPlace), 100),
          district: sanitizeText(getVal(row, idxDistrict), 80),
          state: sanitizeText(getVal(row, idxState), 80),
          pinCode: sanitizeText(getVal(row, idxPinCode), 12),
          stayInvolved,
          linkedinLink: sanitizeText(getVal(row, idxLinkedin), 250),
          socialMediaLink: '',
          messageToTeacher: sanitizeMultilineText(getVal(row, idxMessage), 1500),
          photoURL: (() => {
            const candidate = sanitizeText(getVal(row, idxPhoto), 1000);
            return isSafeFirebaseStorageUrl(candidate) ? candidate : '';
          })(),
          status: 'approved',
          registrationDate: regDateIso,
          createdAt: new Date(regDateIso).getTime() || Date.now(),
        },
      });
    }

    if (mapped.length === 0) {
      setParseError('No valid alumni rows with a Full Name were found.');
      return;
    }

    setParsedRows(mapped);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setParseError('');
    setImportResult(null);
    setParsedRows([]);

    if (!file) {
      setFileName('');
      return;
    }

    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.xlsx') && !lower.endsWith('.csv')) {
      setParseError('Please select a valid .xlsx or .csv file.');
      return;
    }

    setFileName(file.name);

    try {
      if (lower.endsWith('.csv')) {
        const text = await file.text();
        const rows = parseCSVText(text);
        mapRowsToAlumni(rows);
      } else {
        const rows = await readSheet(file);
        mapRowsToAlumni(rows);
      }
    } catch (err) {
      console.error('File parse error:', err);
      setParseError('Unable to read this file. Make sure it is a valid .xlsx or .csv file.');
    }
  };

  const handleParsePasted = () => {
    setParseError('');
    setImportResult(null);
    setParsedRows([]);
    if (!pastedCsv.trim()) {
      setParseError('Please paste CSV content first.');
      return;
    }
    const rows = parseCSVText(pastedCsv);
    mapRowsToAlumni(rows);
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    setParseError('');

    let imported = 0;
    let failed = 0;

    for (const row of parsedRows) {
      try {
        const targetRef = row.existingId
          ? ref(database, `alumni/${row.existingId}`)
          : push(ref(database, 'alumni'));
        await set(targetRef, row.data);
        imported += 1;
      } catch (err) {
        console.error('Failed to import row:', row.data.fullName, err);
        failed += 1;
      }
    }

    setImporting(false);
    setImportResult({ imported, failed });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        className="sm:max-w-[660px] w-[95vw] p-0 gap-0 overflow-hidden border border-[#E5E7EB] bg-[#FAFBFF] rounded-[20px] shadow-2xl max-h-[90vh] flex flex-col"
      >
        <DialogTitle className="sr-only">Import Alumni from Excel or CSV</DialogTitle>
        <DialogDescription className="sr-only">
          Restore alumni records from an exported .xlsx or .csv file
        </DialogDescription>

        <div className="h-1.5 w-full bg-[#2a1b63] shrink-0" />

        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center shrink-0">
              <Icon name="upload_file" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-base text-[#1D1E20]">Import / Restore Excel &amp; CSV</h2>
              <p className="text-xs text-[#8A8F98]">
                Upload a .xlsx / .csv file or paste CSV data to restore records safely
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={importing}
            onClick={() => handleClose(false)}
            className="h-9 w-9 p-0 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA]"
          >
            <Icon name="close" className="text-[20px]" />
          </Button>
        </div>

        {/* Body */}
        <div
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-5"
        >
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => {
                setMode('file');
                setParseError('');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                mode === 'file'
                  ? 'bg-[#2a1b63] text-white'
                  : 'text-[#5F6368] hover:text-[#2a1b63]'
              }`}
            >
              Upload .xlsx / .csv
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('paste');
                setParseError('');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                mode === 'paste'
                  ? 'bg-[#2a1b63] text-white'
                  : 'text-[#5F6368] hover:text-[#2a1b63]'
              }`}
            >
              Paste CSV Text
            </button>
          </div>

          {mode === 'file' ? (
            <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#DDD6F3] bg-white hover:bg-[#F3F0FA]/40 transition-colors cursor-pointer text-center">
              <Icon name="table_view" className="text-[32px] text-[#2a1b63] mb-2" />
              <p className="text-sm text-[#1D1E20]">
                {fileName ? fileName : 'Click to select your .xlsx or .csv file'}
              </p>
              <p className="text-xs text-[#8A8F98] mt-1">
                Supports exported YES INDIA Alumni Excel (.xlsx) and CSV (.csv) files
              </p>
              <input
                type="file"
                accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                disabled={importing}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={pastedCsv}
                onChange={(e) => setPastedCsv(e.target.value)}
                rows={6}
                placeholder="Paste your CSV rows starting with the header line (Full Name,Mobile Number,...)"
                className="rounded-xl border-[#E5E7EB] bg-white text-xs font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleParsePasted}
                className="h-9 px-4 rounded-xl border-[#DDD6F3] text-xs text-[#2a1b63] hover:bg-[#F3F0FA]"
              >
                Preview Pasted CSV
              </Button>
            </div>
          )}

          {parseError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <Icon name="error" className="text-[18px] shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {importResult && (
            <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-sm text-[#14532D] space-y-1">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" className="text-[20px] text-[#16A34A]" />
                <span>
                  Restored <strong>{importResult.imported}</strong> alumni records into Firebase.
                </span>
              </div>
              {importResult.failed > 0 && (
                <p className="text-xs text-[#DC2626] pl-7">
                  {importResult.failed} row(s) could not be saved (check Firebase rules or console).
                </p>
              )}
            </div>
          )}

          {/* Preview */}
          {parsedRows.length > 0 && !importResult && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
                <span className="text-xs text-[#1D1E20]">
                  Ready to restore <strong>{parsedRows.length}</strong> records
                </span>
                <span className="text-[11px] text-[#8A8F98]">Preview (first 5 rows)</span>
              </div>
              <div className="divide-y divide-[#E5E7EB]/70 text-xs">
                {parsedRows.slice(0, 5).map((r, i) => (
                  <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[#1D1E20] truncate">{r.data.fullName}</p>
                      <p className="text-[#8A8F98] truncate">
                        {r.data.schoolAttended}
                        {r.data.yearOfGraduation ? ` · Batch ${r.data.yearOfGraduation}` : ''}
                      </p>
                    </div>
                    <span className="text-[#5F6368] shrink-0">{r.data.mobileNumber || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E5E7EB] flex items-center justify-end gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            disabled={importing}
            onClick={() => handleClose(false)}
            className="h-10 px-4 rounded-xl border-[#E5E7EB] text-xs text-[#1D1E20]"
          >
            {importResult ? 'Done' : 'Cancel'}
          </Button>
          {!importResult && (
            <Button
              type="button"
              disabled={parsedRows.length === 0 || importing}
              onClick={handleImport}
              className="h-10 px-5 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-xs text-white inline-flex items-center gap-1.5"
            >
              <Icon name="cloud_upload" className="text-[17px]" />
              <span>
                {importing
                  ? 'Restoring...'
                  : `Restore ${parsedRows.length || ''} Records`}
              </span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
