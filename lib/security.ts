// lib/security.ts

export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeFilename(name: string, fallback = 'download.jpg'): string {
  const cleaned = name
    .replace(/[/\\]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 120);
  return cleaned || fallback;
}

export function safeSocialUrl(link?: string, platform?: string): string {
  if (!link) return '#';
  const trimmed = link.trim();
  if (!trimmed) return '#';

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    const handle = trimmed.replace(/^@+/, '').replace(/^\/+/, '');
    switch (platform) {
      case 'facebook':
        candidate = `https://facebook.com/${encodeURIComponent(handle)}`;
        break;
      case 'instagram':
        candidate = `https://instagram.com/${encodeURIComponent(handle)}`;
        break;
      case 'twitter':
        candidate = `https://x.com/${encodeURIComponent(handle)}`;
        break;
      case 'linkedin':
        candidate = `https://linkedin.com/in/${encodeURIComponent(handle)}`;
        break;
      default:
        candidate = `https://${trimmed}`;
    }
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return '#';
  }
  return '#';
}

// Lightweight in-memory rate limiter for API routes (per-instance)
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60_000
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}
