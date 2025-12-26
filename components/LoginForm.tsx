'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle } from 'lucide-react';

// Alumni data
const alumniData = [
  {
    name: "Akeel Shah KAS",
    position: "DYSP",
    department: "J & K Police",
    image: "/images/alumni/akeel_shah.jpeg"
  },
  {
    name: "Dr. Mohammad Shabaz",
    position: "Scientist, Senior Asst. Professor",
    department: "Model Institute of Engineering and Technology, Jammu",
    image: "/images/alumni/mohammad_shabaz.jpg"
  },
  {
    name: "Ishrat Sultana KAS",
    position: "DYSP",
    department: "J & K Police",
    image: "/images/alumni/Israt_sultana.jpg"
  },
  {
    name: "Dr. Mohammad Owais",
    position: "General Physician",
    department: "BUMS (KU) MD",
    image: "/images/alumni/mohammad-owais.jpg"
  },
];

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad?: () => void;
  }
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [currentAlumniIndex, setCurrentAlumniIndex] = useState(0);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  // Auto-rotate alumni every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlumniIndex((prev) => (prev + 1) % alumniData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load reCAPTCHA script
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.error('reCAPTCHA site key is not configured');
      setError('Security verification is not configured. Please contact support.');
      return;
    }

    window.onRecaptchaLoad = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        try {
          window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            theme: 'light',
          });
          setRecaptchaReady(true);
        } catch (err) {
          console.error('Error rendering reCAPTCHA:', err);
          setError('Failed to initialize security verification. Please check your site configuration.');
        }
      }
    };

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script');
      setError('Failed to load security verification. Please refresh the page.');
    };

    document.head.appendChild(script);

    return () => {
      delete window.onRecaptchaLoad;
    };
  }, []);

  const handleSubmit = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setError('');

    if (!recaptchaReady || !window.grecaptcha) {
      setError('Security verification is not ready. Please refresh the page.');
      return;
    }

    const recaptchaToken = window.grecaptcha.getResponse();
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification.');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to login. Please check your credentials.');
        if (window.grecaptcha) window.grecaptcha.reset();
        setLoading(false);
        return;
      }

      // Use Next.js router for client-side navigation instead of window.location
      // This prevents page refresh and works properly with Next.js
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      if (window.grecaptcha) window.grecaptcha.reset();
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const currentAlumni = alumniData[currentAlumniIndex];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Left Side - Alumni Showcase & Branding */}
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

          {/* Alumni Spotlight */}
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center text-center justify-center mb-6">
                <h2 className="text-xl font-semibold text-white">Featured Alumni</h2>
              </div>

              {/* Alumni Card with Smooth Transition */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Image */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl opacity-50"></div>
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 p-1 shadow-xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img
                          src={currentAlumni.image}
                          alt={currentAlumni.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-bold">${currentAlumni.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-bold text-white mb-2">{currentAlumni.name}</h3>
                  <p className="text-blue-100 font-medium mb-1">{currentAlumni.position}</p>
                  {currentAlumni.department && (
                    <p className="text-sm text-blue-200/80">{currentAlumni.department}</p>
                  )}
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {alumniData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAlumniIndex(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentAlumniIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/40 w-1.5 hover:bg-white/60'
                      }`}
                      aria-label={`Go to alumni ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="hidden lg:grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-sm text-white">Secure Login</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
              <span className="text-sm text-white">Protected Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your alumni dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5">⚠</div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Alert */}
          {!recaptchaReady && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <p className="text-sm text-blue-800">Loading security verification...</p>
              </div>
            </div>
          )}

          {/* Login Form */}
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

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className={`relative transition-all duration-200 ${passwordFocused ? 'scale-[1.01]' : ''}`}>
                <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                  passwordFocused ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none ${
                    passwordFocused 
                      ? 'border-blue-500 shadow-lg shadow-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center py-2">
              <div ref={recaptchaRef}></div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !recaptchaReady}
              className="group w-full bg-blue-900 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} YES INDIA Foundation. All rights reserved.
              </p>
              <a
                href="https://yesindiafoundation.com"
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