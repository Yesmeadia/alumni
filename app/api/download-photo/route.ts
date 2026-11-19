// app/api/download-photo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeFilename } from '@/lib/security';

const ALLOWED_IMAGE_HOSTS = new Set(['firebasestorage.googleapis.com']);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');
  const rawFileName = searchParams.get('filename') || 'download.jpg';

  if (!rawUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  // Prevent SSRF: enforce HTTPS and strict Firebase Storage host allowlist
  if (
    parsedUrl.protocol !== 'https:' ||
    !ALLOWED_IMAGE_HOSTS.has(parsedUrl.hostname) ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    return new NextResponse('Forbidden image source', { status: 403 });
  }

  const safeFileName = sanitizeFilename(rawFileName, 'download.jpg');

  try {
    const response = await fetch(parsedUrl.toString(), {
      redirect: 'error',
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: 502 });
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    // Reject non-image and SVG responses to prevent stored XSS
    if (!contentType.startsWith('image/') || contentType.includes('svg')) {
      return new NextResponse('Unsupported media type', { status: 415 });
    }

    const contentLength = Number(response.headers.get('content-length') || '0');
    if (contentLength > MAX_IMAGE_BYTES) {
      return new NextResponse('File too large', { status: 413 });
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return new NextResponse('File too large', { status: 413 });
    }

    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${safeFileName}"`);
    headers.set('Content-Type', contentType.split(';')[0]);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Cache-Control', 'private, no-store');

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Download Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
