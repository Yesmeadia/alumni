'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ref as storageRef, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { ref as dbRef, update } from 'firebase/database';
import { storage, database } from '@/lib/firebase';
import { AlumniRecord } from '@/hooks/useAlumniData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/ui/icon';

interface RestoreStoragePhotosDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alumniList: AlumniRecord[];
}

interface StoragePhotoItem {
  name: string;
  url: string;
  dateKey: string; // YYYY-MM-DD
  timestamp: number;
}

const toDateKey = (input?: string | number): string => {
  if (!input) return '';
  const d = new Date(input);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const extractTimestampFromFilename = (name: string): number => {
  const match = name.match(/(1[6789]\d{11})/);
  return match ? Number(match[1]) : 0;
};

const normalizeAlpha = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function RestoreStoragePhotosDialog({
  isOpen,
  onOpenChange,
  alumniList,
}: RestoreStoragePhotosDialogProps) {
  const [photos, setPhotos] = useState<StoragePhotoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [alumniSearch, setAlumniSearch] = useState('');
  const [selectedAlumniByPhoto, setSelectedAlumniByPhoto] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [autoMatching, setAutoMatching] = useState(false);
  const [autoMatchNotice, setAutoMatchNotice] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    const loadPhotos = async () => {
      setLoading(true);
      setError('');
      setAutoMatchNotice('');
      try {
        const folderRef = storageRef(storage, 'alumni-photos');
        const listResult = await listAll(folderRef);

        const loaded: StoragePhotoItem[] = [];
        // Load in batches of 20 to stay fast and responsive
        const batchSize = 20;
        for (let i = 0; i < listResult.items.length; i += batchSize) {
          const chunk = listResult.items.slice(i, i + batchSize);
          const results = await Promise.all(
            chunk.map(async (item) => {
              try {
                const [url, meta] = await Promise.all([
                  getDownloadURL(item),
                  getMetadata(item).catch(() => null),
                ]);
                const ts =
                  extractTimestampFromFilename(item.name) ||
                  (meta?.timeCreated ? new Date(meta.timeCreated).getTime() : 0);
                return {
                  name: item.name,
                  url,
                  timestamp: ts,
                  dateKey: ts ? toDateKey(ts) : '',
                };
              } catch {
                return null;
              }
            })
          );
          results.forEach((r) => {
            if (r) loaded.push(r);
          });
        }

        loaded.sort((a, b) => b.timestamp - a.timestamp);
        if (!cancelled) {
          setPhotos(loaded);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ||
              'Unable to list alumni-photos from Firebase Storage. Check Storage read permissions.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPhotos();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const linkedUrls = useMemo(() => {
    const set = new Set<string>();
    alumniList.forEach(({ data }) => {
      if (data.photoURL) set.add(data.photoURL);
    });
    return set;
  }, [alumniList]);

  const unlinkedPhotos = useMemo(
    () => photos.filter((p) => !linkedUrls.has(p.url)),
    [photos, linkedUrls]
  );

  const alumniWithoutPhoto = useMemo(
    () => alumniList.filter(({ data }) => !data.photoURL),
    [alumniList]
  );

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    unlinkedPhotos.forEach((p) => {
      if (p.dateKey) dates.add(p.dateKey);
    });
    return Array.from(dates).sort().reverse();
  }, [unlinkedPhotos]);

  const filteredPhotos = useMemo(() => {
    if (dateFilter === 'all') return unlinkedPhotos;
    return unlinkedPhotos.filter((p) => p.dateKey === dateFilter);
  }, [unlinkedPhotos, dateFilter]);

  const filteredAlumniOptions = useMemo(() => {
    const q = alumniSearch.trim().toLowerCase();
    if (!q) return alumniWithoutPhoto;
    return alumniWithoutPhoto.filter(
      ({ data }) =>
        (data.fullName || '').toLowerCase().includes(q) ||
        (data.mobileNumber || '').toLowerCase().includes(q)
    );
  }, [alumniWithoutPhoto, alumniSearch]);

  const assignPhotoToAlumni = async (alumniId: string, photoUrl: string) => {
    const safeId = alumniId.trim();
    if (!safeId || safeId.includes('/') || safeId.includes('..')) return;
    await update(dbRef(database, `alumni/${safeId}`), {
      photoURL: photoUrl,
      updatedAt: Date.now(),
    });
  };

  const handleManualAssign = async (photo: StoragePhotoItem) => {
    const targetAlumniId = selectedAlumniByPhoto[photo.name];
    if (!targetAlumniId) return;
    setSavingKey(photo.name);
    try {
      await assignPhotoToAlumni(targetAlumniId, photo.url);
      setSelectedAlumniByPhoto((prev) => {
        const next = { ...prev };
        delete next[photo.name];
        return next;
      });
    } finally {
      setSavingKey(null);
    }
  };

  const handleAutoMatch = async () => {
    setAutoMatching(true);
    setAutoMatchNotice('');

    const matchedPairs: Array<{ alumniId: string; photoUrl: string }> = [];
    const usedAlumni = new Set<string>();
    const usedPhotos = new Set<string>();

    // Pass 1: Filename contains alumnus full name (>= 5 alpha chars) with unique match
    for (const photo of unlinkedPhotos) {
      const normPhoto = normalizeAlpha(photo.name);
      if (normPhoto.length < 5) continue;
      const nameCandidates = alumniWithoutPhoto.filter((a) => {
        if (usedAlumni.has(a.id)) return false;
        const normName = normalizeAlpha(a.data.fullName || '');
        return normName.length >= 5 && normPhoto.includes(normName);
      });
      if (nameCandidates.length === 1) {
        matchedPairs.push({ alumniId: nameCandidates[0].id, photoUrl: photo.url });
        usedAlumni.add(nameCandidates[0].id);
        usedPhotos.add(photo.url);
      }
    }

    // Pass 2: Unique date match (1 unlinked photo on date X & 1 unlinked alumnus registered on date X)
    const photosByDate = new Map<string, StoragePhotoItem[]>();
    unlinkedPhotos.forEach((p) => {
      if (usedPhotos.has(p.url) || !p.dateKey) return;
      const arr = photosByDate.get(p.dateKey) || [];
      arr.push(p);
      photosByDate.set(p.dateKey, arr);
    });

    const alumniByDate = new Map<string, AlumniRecord[]>();
    alumniWithoutPhoto.forEach((a) => {
      if (usedAlumni.has(a.id)) return;
      const dk = toDateKey(a.data.registrationDate || a.data.createdAt);
      if (!dk) return;
      const arr = alumniByDate.get(dk) || [];
      arr.push(a);
      alumniByDate.set(dk, arr);
    });

    photosByDate.forEach((dayPhotos, dk) => {
      const dayAlumni = alumniByDate.get(dk) || [];
      if (dayPhotos.length === 1 && dayAlumni.length === 1) {
        matchedPairs.push({ alumniId: dayAlumni[0].id, photoUrl: dayPhotos[0].url });
        usedAlumni.add(dayAlumni[0].id);
        usedPhotos.add(dayPhotos[0].url);
      }
    });

    let saved = 0;
    for (const pair of matchedPairs) {
      try {
        await assignPhotoToAlumni(pair.alumniId, pair.photoUrl);
        saved += 1;
      } catch {
        // skip failed item
      }
    }

    setAutoMatching(false);
    setAutoMatchNotice(
      saved > 0
        ? `Automatically matched and linked ${saved} photo${saved === 1 ? '' : 's'} by unique date/filename.`
        : 'No unique automatic matches found — assign the remaining photos below by date.'
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        className="sm:max-w-[960px] w-[95vw] p-0 gap-0 overflow-hidden border border-[#E5E7EB] bg-[#FAFBFF] rounded-[20px] shadow-2xl max-h-[90vh] flex flex-col"
      >
        <DialogTitle className="sr-only">Restore Storage Photos</DialogTitle>
        <DialogDescription className="sr-only">
          Auto-match or link existing Firebase Storage alumni photos back to alumni profiles
        </DialogDescription>

        <div className="h-1.5 w-full bg-[#2a1b63] shrink-0" />

        {/* Header */}
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center shrink-0">
              <Icon name="photo_library" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-base text-[#1D1E20]">Restore Storage Photos</h2>
              <p className="text-xs text-[#8A8F98]">
                {unlinkedPhotos.length} unlinked Storage photo(s) · {alumniWithoutPhoto.length} alumni missing a photo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              type="button"
              size="sm"
              disabled={loading || autoMatching || unlinkedPhotos.length === 0 || alumniWithoutPhoto.length === 0}
              onClick={handleAutoMatch}
              className="h-9 px-3.5 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-xs text-white inline-flex items-center gap-1.5"
            >
              <Icon name="auto_fix_high" className="text-[16px]" />
              <span>{autoMatching ? 'Matching...' : 'Auto-Match Confident'}</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 p-0 rounded-xl text-[#5F6368] hover:bg-[#F3F0FA]"
            >
              <Icon name="close" className="text-[20px]" />
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex flex-wrap items-center gap-3 shrink-0">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-9 w-48 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-xs">
              <SelectValue placeholder="All Upload Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates ({unlinkedPhotos.length})</SelectItem>
              {availableDates.map((dk) => (
                <SelectItem key={dk} value={dk}>
                  {dk}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Icon
              name="search"
              className="text-[16px] text-[#8A8F98] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <Input
              value={alumniSearch}
              onChange={(e) => setAlumniSearch(e.target.value)}
              placeholder="Filter alumni dropdown by name or mobile..."
              className="pl-9 h-9 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-xs"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-4"
        >
          {autoMatchNotice && (
            <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#14532D] flex items-center gap-2">
              <Icon name="check_circle" className="text-[18px] text-[#16A34A] shrink-0" />
              <span>{autoMatchNotice}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <Icon name="error" className="text-[18px] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#2a1b63]/20 border-t-[#2a1b63] animate-spin" />
              <p className="text-xs text-[#5F6368]">Scanning Firebase Storage (alumni-photos/)...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-[#F3F0FA] text-[#2a1b63] flex items-center justify-center mx-auto">
                <Icon name="photo_library" className="text-[24px]" />
              </div>
              <p className="text-sm text-[#1D1E20]">No unlinked Storage photos found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPhotos.map((photo) => {
                // Sort alumni options so same-date registrations appear at top
                const sortedOptions = [...filteredAlumniOptions].sort((a, b) => {
                  const aSame = toDateKey(a.data.registrationDate || a.data.createdAt) === photo.dateKey ? 0 : 1;
                  const bSame = toDateKey(b.data.registrationDate || b.data.createdAt) === photo.dateKey ? 0 : 1;
                  if (aSame !== bSame) return aSame - bSame;
                  return (a.data.fullName || '').localeCompare(b.data.fullName || '');
                });

                const selectedId = selectedAlumniByPhoto[photo.name] || '';

                return (
                  <div
                    key={photo.name}
                    className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div className="h-44 bg-[#FAFBFF] border-b border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[11px] text-[#2a1b63]">
                          Uploaded: {photo.dateKey || 'Unknown date'}
                        </p>
                        <p className="text-[11px] text-[#8A8F98] truncate" title={photo.name}>
                          {photo.name}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Select
                          value={selectedId}
                          onValueChange={(val) =>
                            setSelectedAlumniByPhoto((prev) => ({
                              ...prev,
                              [photo.name]: val,
                            }))
                          }
                        >
                          <SelectTrigger className="h-9 rounded-xl border-[#E5E7EB] bg-[#FAFBFF] text-xs">
                            <SelectValue placeholder="Select alumnus..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-56">
                            {sortedOptions.slice(0, 80).map((a) => {
                              const aDate = toDateKey(a.data.registrationDate || a.data.createdAt);
                              const sameDate = photo.dateKey && aDate === photo.dateKey;
                              return (
                                <SelectItem key={a.id} value={a.id} className="text-xs">
                                  {sameDate ? '★ ' : ''}
                                  {a.data.fullName}
                                  {a.data.yearOfGraduation ? ` (${a.data.yearOfGraduation})` : ''}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          size="sm"
                          disabled={!selectedId || savingKey === photo.name}
                          onClick={() => handleManualAssign(photo)}
                          className="w-full h-8 rounded-xl bg-[#2a1b63] hover:bg-[#2a1b63]/90 text-xs text-white"
                        >
                          {savingKey === photo.name ? 'Linking...' : 'Assign Photo'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
