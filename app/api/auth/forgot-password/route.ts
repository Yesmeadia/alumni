// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkRateLimit } from '@/lib/security';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_SUCCESS_MESSAGE =
  'If an account exists with this email address, a password reset link has been sent.';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const limit = checkRateLimit(`forgot-password:${ip}`, 5, 15 * 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const actionCodeSettings =
      appUrl && /^https?:\/\//i.test(appUrl)
        ? { url: `${appUrl.replace(/\/+$/, '')}/login`, handleCodeInApp: false }
        : undefined;

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error: any) {
      // Prevent user enumeration by returning the same generic success response
      if (error?.code === 'auth/user-not-found') {
        return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ message: GENERIC_SUCCESS_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Failed to process password reset request. Please try again.' },
      { status: 500 }
    );
  }
}
