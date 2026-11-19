'use client';

import { useState, useEffect } from 'react';

export function useClientIp() {
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchIPAddress = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (!res.ok) throw new Error('Failed to fetch IP');
        const data = await res.json();
        if (active) setIpAddress(data.ip);
      } catch {
        if (active) {
          setError('Not available');
          setIpAddress('—');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchIPAddress();
    return () => {
      active = false;
    };
  }, []);

  return { ipAddress, loading, error };
}
