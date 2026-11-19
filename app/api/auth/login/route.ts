// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security';

interface LoginRequest {
  email: string;
  password: string;
  recaptchaToken: string;
}

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

interface FirebaseUser {
  idToken: string;
  localId: string;
  email: string;
  displayName?: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const limit = checkRateLimit(`login:${ip}`, 10, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { message: 'Too many login attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    const body: LoginRequest = await req.json();
    const { email, password, recaptchaToken } = body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof recaptchaToken !== 'string' ||
      !email.trim() ||
      !password ||
      !recaptchaToken.trim()
    ) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const recaptchaResponse = await verifyRecaptcha(recaptchaToken.trim());

    if (!recaptchaResponse.success) {
      return NextResponse.json(
        { message: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const firebaseUser = await verifyUserWithFirebase(email.trim(), password);

    if (!firebaseUser) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          uid: firebaseUser.localId,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

async function verifyRecaptcha(token: string): Promise<RecaptchaResponse> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      throw new Error('RECAPTCHA_SECRET_KEY is not set');
    }

    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data: RecaptchaResponse = await response.json();
    return data;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false };
  }
}

async function verifyUserWithFirebase(
  email: string,
  password: string
): Promise<FirebaseUser | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!apiKey) {
      throw new Error('FIREBASE_API_KEY is not set');
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.idToken) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Firebase authentication error:', error);
    return null;
  }
}
