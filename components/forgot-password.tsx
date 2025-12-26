'use client';

import { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    // Validate email
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
      // Call your Firebase password reset API
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
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Left Side - Branding */}
      <div className="lg:w-1/2 relative overflow-hidden bg-blue-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-8 lg:p-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/footer_logo.png"
              alt="YES INDIA Logo"
              className="w-32 h-32 mx-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=Logo';
              }}
            />
          </div>

          {/* Info Card */}
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Password Reset</h2>
                <p className="text-blue-100 leading-relaxed">
                  Enter your email address and we&apos;ll send you a link to reset your password. The link will be valid for 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <a 
            href="/login" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Login</span>
          </a>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter your email to receive a password reset link</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800 mb-1">Email Sent Successfully!</p>
                  <p className="text-sm text-green-700">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!success ? (
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className={`relative transition-all duration-200 ${emailFocused ? 'scale-[1.01]' : ''}`}>
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    emailFocused ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onKeyPress={handleKeyPress}
                    className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none ${
                      emailFocused 
                        ? 'border-blue-500 shadow-lg shadow-blue-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group w-full bg-blue-900 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Help Text */}
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Remember your password?{' '}
                  <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Next Steps */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">1.</span>
                    <span>Check your email inbox for the password reset link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">2.</span>
                    <span>Click on the link in the email (valid for 24 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">3.</span>
                    <span>Create a new secure password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600">4.</span>
                    <span>Sign in with your new password</span>
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                  Send to Different Email
                </button>
                <a
                  href="/login"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all"
                >
                  Return to Login
                </a>
              </div>

              {/* Help */}
              <div className="text-center text-sm text-gray-500">
                Didn&apos;t receive the email?{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} YES INDIA Foundation. All rights reserved.
              </p>
              <a
                href="https://yourcompany.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span>Powered by</span>
                <img
                  src="/cyber-logo.png"
                  alt="Cyberduce"
                  className="h-4 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x16?text=Cyberduce';
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}