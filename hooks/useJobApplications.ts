'use client';

import { useState, useEffect, useMemo } from 'react';
import { ref, onValue, off, update, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { JobApplicationData, JobApplicationStatus } from '@/lib/types';

export interface JobApplicationRecord {
  id: string;
  data: JobApplicationData;
}

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appsRef = ref(database, 'jobApplications');

    const unsubscribe = onValue(appsRef, (snapshot) => {
      const raw = snapshot.val();
      if (raw && typeof raw === 'object') {
        const list: JobApplicationRecord[] = [];
        Object.entries(raw).forEach(([id, entry]) => {
          if (entry && typeof entry === 'object') {
            list.push({ id, data: entry as JobApplicationData });
          }
        });

        list.sort((a, b) => {
          const ta = a.data.createdAt || (a.data.appliedAt ? new Date(a.data.appliedAt).getTime() : 0);
          const tb = b.data.createdAt || (b.data.appliedAt ? new Date(b.data.appliedAt).getTime() : 0);
          return tb - ta;
        });

        setApplications(list);
      } else {
        setApplications([]);
      }
      setLoading(false);
    });

    return () => off(appsRef, 'value', unsubscribe);
  }, []);

  const counts = useMemo(() => {
    let pending = 0;
    let reviewed = 0;
    let shortlisted = 0;
    let rejected = 0;

    applications.forEach(({ data }) => {
      if (data.status === 'shortlisted') shortlisted += 1;
      else if (data.status === 'reviewed') reviewed += 1;
      else if (data.status === 'rejected') rejected += 1;
      else pending += 1;
    });

    return {
      total: applications.length,
      pending,
      reviewed,
      shortlisted,
      rejected,
    };
  }, [applications]);

  const updateApplicationStatus = async (id: string, status: JobApplicationStatus) => {
    await update(ref(database, `jobApplications/${id}`), {
      status,
      updatedAt: Date.now(),
    });
  };

  const deleteApplication = async (id: string) => {
    await remove(ref(database, `jobApplications/${id}`));
  };

  return {
    applications,
    loading,
    counts,
    updateApplicationStatus,
    deleteApplication,
  };
}
