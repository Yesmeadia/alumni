'use client';

import { useState, useEffect, useMemo } from 'react';
import { ref, onValue, off, remove, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';

export interface AlumniRecord {
  id: string;
  data: AlumniData;
}

export function useAlumniData() {
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const alumniRef = ref(database, 'alumni');

    const unsubscribe = onValue(alumniRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: AlumniRecord[] = [];
        Object.entries(data).forEach(([firebaseKey, alumniData]) => {
          if (typeof alumniData === 'object' && alumniData !== null) {
            list.push({
              id: firebaseKey,
              data: alumniData as AlumniData,
            });
          }
        });

        list.sort((a, b) => {
          const da = a.data.registrationDate ? new Date(a.data.registrationDate).getTime() : 0;
          const db = b.data.registrationDate ? new Date(b.data.registrationDate).getTime() : 0;
          return db - da;
        });

        setAlumniList(list);
      } else {
        setAlumniList([]);
      }
      setLoading(false);
    });

    return () => off(alumniRef, 'value', unsubscribe);
  }, []);

  const derived = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let recentCount = 0;
    const schoolsMap: Record<string, number> = {};
    const companiesMap: Record<string, number> = {};
    const yearsSet = new Set<string>();
    const statesSet = new Set<string>();
    const jobsSet = new Set<string>();
    const industriesSet = new Set<string>();

    alumniList.forEach(({ data }) => {
      const regTime = data.registrationDate ? new Date(data.registrationDate).getTime() : 0;
      if (regTime > thirtyDaysAgo) recentCount += 1;
      if (data.schoolAttended)
        schoolsMap[data.schoolAttended] = (schoolsMap[data.schoolAttended] || 0) + 1;
      if (data.companyName)
        companiesMap[data.companyName] = (companiesMap[data.companyName] || 0) + 1;
      if (data.yearOfGraduation) yearsSet.add(data.yearOfGraduation);
      if (data.state) statesSet.add(data.state);
      if (data.currentJobTitle) jobsSet.add(data.currentJobTitle.trim());
      if (data.industry) industriesSet.add(data.industry.trim());
    });

    return {
      stats: {
        totalAlumni: alumniList.length,
        totalSchools: Object.keys(schoolsMap).length,
        totalCompanies: Object.keys(companiesMap).length,
        recentRegistrations: recentCount,
      },
      sortedSchools: Object.entries(schoolsMap).sort((a, b) => b[1] - a[1]),
      sortedCompanies: Object.entries(companiesMap).sort((a, b) => b[1] - a[1]),
      graduationYears: Array.from(yearsSet).sort().reverse(),
      statesList: Array.from(statesSet).sort(),
      jobsList: Array.from(jobsSet).sort((a, b) => a.localeCompare(b)),
      industriesList: Array.from(industriesSet).sort((a, b) => a.localeCompare(b)),
    };
  }, [alumniList]);

  const updateAlumni = async (id: string, data: Partial<AlumniData>) => {
    const { id: _, ...cleanData } = data as any;
    await update(ref(database, `alumni/${id}`), {
      ...cleanData,
      updatedAt: Date.now(),
    });
  };

  const deleteAlumni = async (id: string) => {
    await remove(ref(database, `alumni/${id}`));
  };

  return {
    alumniList,
    loading,
    ...derived,
    updateAlumni,
    deleteAlumni,
  };
}
