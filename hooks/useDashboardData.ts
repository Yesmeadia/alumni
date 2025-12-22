// hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AlumniData } from '@/lib/types';

interface AlumniWithId extends AlumniData {
  id: string;
}

interface DashboardStats {
  totalAlumni: number;
  totalSchools: number;
  totalCompanies: number;
  recentRegistrations: number;
}

export const useDashboardData = () => {
  const [alumniList, setAlumniList] = useState<AlumniWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAlumni: 0,
    totalSchools: 0,
    totalCompanies: 0,
    recentRegistrations: 0,
  });

  useEffect(() => {
    const alumniRef = ref(database, 'alumni');

    const unsubscribe = onValue(alumniRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alumniArray: AlumniWithId[] = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as AlumniData),
        }));

        setAlumniList(alumniArray);

        const uniqueSchools = new Set(alumniArray.map((a) => a.schoolAttended)).size;
        const uniqueCompanies = new Set(alumniArray.map((a) => a.companyName)).size;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recentCount = alumniArray.filter((a) => {
          const createdAt = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
          return createdAt > thirtyDaysAgo;
        }).length;

        setStats({
          totalAlumni: alumniArray.length,
          totalSchools: uniqueSchools,
          totalCompanies: uniqueCompanies,
          recentRegistrations: recentCount,
        });
      }
      setLoading(false);
    });

    return () => off(alumniRef, 'value', unsubscribe);
  }, []);

  return { alumniList, loading, stats };
};