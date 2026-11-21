'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/ui/icon';
import { FEATURED_ALUMNI } from '@/data/alumni';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { getFirebaseAuthErrorMessage } from '@/lib/authErrors';

export default function LoginForm() {
  const { login } = useAuth();
  const {
    containerRef: recaptchaRef,
    ready: recaptchaReady,
    error: recaptchaError,
    getToken,
    reset: resetRecaptcha,
  } = useRecaptcha();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const error = formError || recaptchaError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!recaptchaReady) {
      setFormError('Security verification is not ready. Please refresh the page.');
      return;
    }

    const recaptchaToken = getToken();
    if (!recaptchaToken) {
      setFormError('Please complete the reCAPTCHA verification.');
      return;
    }

    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Enforce server-side reCAPTCHA & credential verification before establishing client session
      const verifyRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json().catch(() => ({}));
        setFormError(data.message || 'Invalid email or password.');
        resetRecaptcha();
        return;
      }

      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setFormError(getFirebaseAuthErrorMessage(err));
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side — Deep Indigo Panel with Compact Static Alumni Photo Grid */}
      <div className="bg-[#2a1b63] text-white p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6be8a]">
              YES INDIA Alumni Network
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">
              A Community of Leaders &amp; Changemakers
            </h2>
            <p className="text-xs sm:text-sm text-white/75 mt-2.5 leading-relaxed">
              Connecting YES INDIA graduates across public service, healthcare, academia, and
              industry.
            </p>
          </div>

          {/* Compact 2x2 Alumni Photo Collage */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURED_ALUMNI.map((person) => (
              <div
                key={person.name}
                className="relative h-36 sm:h-40 rounded-xl overflow-hidden bg-[#1e124a] border border-white/15"
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140b36]/90 via-[#140b36]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#d6be8a] truncate">
                    {person.position}
                  </p>
                  <p className="font-display text-xs font-bold text-white leading-tight mt-0.5 truncate">
                    {person.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Clean White Sign-In Form */}
      <div className="bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1b63] tracking-tight mt-1.5">
              Sign In
            </h1>
            <p className="text-sm text-gray-600 mt-1.5">
              Sign in with your registered credentials to access the alumni dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-lg">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {!recaptchaReady && !recaptchaError && (
            <div className="mb-5 p-4 bg-[#f7f4ed] border-l-4 border-[#a5874c] rounded-r-lg">
              <p className="text-sm text-[#2a1b63] font-medium">
                Loading security verification...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#212529] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-[#212529] placeholder-gray-400 transition-colors focus:outline-none focus:border-[#2a1b63] focus:ring-2 focus:ring-[#2a1b63]/15"
                placeholder="your.email@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#212529]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#2a1b63] hover:text-[#a5874c] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-white border border-gray-300 rounded-lg text-sm text-[#212529] placeholder-gray-400 transition-colors focus:outline-none focus:border-[#2a1b63] focus:ring-2 focus:ring-[#2a1b63]/15"
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2a1b63] focus:outline-none transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  <Icon
                    name={showPassword ? 'visibility_off' : 'visibility'}
                    className="text-[20px]"
                  />
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-[#2a1b63] focus:ring-[#2a1b63]"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">Keep me signed in</span>
            </label>

            <div className="pt-1">
              <div ref={recaptchaRef} />
            </div>

            <button
              type="submit"
              disabled={loading || !recaptchaReady}
              className="w-full bg-[#2a1b63] hover:bg-[#1f134c] text-white py-3.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Icon name="progress_activity" className="text-[18px] animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            Not registered yet?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#2a1b63] hover:text-[#a5874c] transition-colors"
            >
              Register as Alumni
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
