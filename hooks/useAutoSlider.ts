'use client';

import { useState, useEffect, useCallback } from 'react';

export function useAutoSlider(length: number, intervalMs = 4500) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((prev) => (length > 0 ? (prev + 1) % length : 0));
  }, [length]);

  const prev = useCallback(() => {
    setIndex((prev) => (length > 0 ? (prev - 1 + length) % length : 0));
  }, [length]);

  useEffect(() => {
    if (paused || length <= 1) return;
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [paused, length, intervalMs, next]);

  return {
    index,
    setIndex,
    next,
    prev,
    paused,
    setPaused,
  };
}
