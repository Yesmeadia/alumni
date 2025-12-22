// hooks/useAlumniSearch.ts
import { useState, useEffect, useMemo } from 'react';
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

export const useAlumniSearch = (alumniList: AlumniWithId[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlumni = useMemo(() => {
    if (searchTerm.trim() === '') {
      return alumniList;
    }

    return alumniList.filter(
      (alumni) =>
        alumni.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.schoolAttended?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.currentJobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumni.place?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, alumniList]);

  return { searchTerm, setSearchTerm, filteredAlumni };
};