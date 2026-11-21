'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import AuthLayout from '@/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send reset link. Please try again.');
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const leftCard = (
    <div className="bg-[#a5874c] rounded-[24px] p-8 text-white">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
        Account Recovery
      </h2>
      <p className="text-sm sm:text-base text-white/95 leading-relaxed">
        Enter your registered email address and we&apos;ll send you a secure link to reset your
        password. The link remains valid for 24 hours.
      </p>
    </div>
  );

  const topLinks = (
    <>
      <Link
        href="/login"
        className="font-medium text-gray-500 hover:text-[#2a1b63] transition-colors"
      >
        Back to Sign In
      </Link>
      <Link href="/" className="font-medium text-gray-500 hover:text-[#2a1b63]">
        Home
      </Link>
    </>
  );

  return (
    <AuthLayout leftContent={leftCard} topLinks={topLinks}>
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1b63] tracking-tight mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600">
          Enter your email address to receive a password reset link.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-lg">
          <p className="text-sm font-bold text-emerald-900 mb-1">Reset Link Sent</p>
          <p className="text-sm text-emerald-800">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your
            inbox and spam folder.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
      )}

      {!success ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#212529] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-[#212529] placeholder-gray-400 transition-colors focus:outline-none focus:border-[#2a1b63] focus:ring-2 focus:ring-[#2a1b63]/15"
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#2a1b63] hover:bg-[#1f134c] text-white py-3.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Icon name="progress_activity" className="text-[18px] animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 pt-1">
            Remember your password?{' '}
            <Link href="/login" className="font-semibold text-[#2a1b63] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-[#f7f4ed] rounded-xl p-5 border-l-4 border-[#a5874c]">
            <h3 className="font-display text-sm font-bold text-[#2a1b63] mb-3">Next Steps</h3>
            <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
              <li>Check your email inbox for the password reset link.</li>
              <li>Open the link in the email (valid for 24 hours).</li>
              <li>Create a new password and sign in to your account.</li>
            </ol>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="w-full px-6 py-3 bg-white border border-gray-300 text-[#212529] rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Send to Different Email
            </button>
            <Link
              href="/login"
              className="block w-full px-6 py-3 bg-[#2a1b63] hover:bg-[#1f134c] text-white rounded-lg text-sm font-semibold text-center transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
