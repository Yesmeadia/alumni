'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad?: () => void;
  }
}

export function useRecaptcha() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const clearPoll = () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
      setError('Security verification is not configured. Please contact support.');
      return;
    }

    const markReady = () => {
      clearPoll();
      if (!cancelled) {
        setError('');
        setReady(true);
      }
    };

    const isAlreadyRendered = () =>
      widgetIdRef.current !== null ||
      (containerRef.current !== null && containerRef.current.childElementCount > 0);

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.grecaptcha) return;

      const doRender = () => {
        if (cancelled || !containerRef.current) return;
        if (isAlreadyRendered()) {
          markReady();
          return;
        }
        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            theme: 'light',
          });
          markReady();
        } catch (err) {
          if (isAlreadyRendered()) {
            markReady();
            return;
          }
          console.error('Error rendering reCAPTCHA:', err);
          clearPoll();
          if (!cancelled) {
            setError('Failed to initialize security verification. Please refresh the page.');
          }
        }
      };

      if (typeof window.grecaptcha.ready === 'function') {
        window.grecaptcha.ready(doRender);
      } else if (typeof window.grecaptcha.render === 'function') {
        doRender();
      }
    };

    if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
      renderWidget();
      return () => {
        cancelled = true;
        clearPoll();
      };
    }

    window.onRecaptchaLoad = renderWidget;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="google.com/recaptcha/api.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;

      const nonce = document
        .querySelector('meta[property="csp-nonce"]')
        ?.getAttribute('content');
      if (nonce) {
        script.nonce = nonce;
      }

      script.onerror = () => {
        clearPoll();
        if (!cancelled) {
          setError('Failed to load security verification. Please refresh the page.');
        }
      };

      document.head.appendChild(script);
    }

    let attempts = 0;
    pollTimer = setInterval(() => {
      attempts += 1;
      if (isAlreadyRendered()) {
        markReady();
      } else if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        renderWidget();
      } else if (attempts >= 125) {
        clearPoll();
        if (!cancelled && !isAlreadyRendered()) {
          setError('Security verification timed out. Please refresh the page.');
        }
      }
    }, 200);

    return () => {
      cancelled = true;
      clearPoll();
    };
  }, []);

  const getToken = useCallback((): string => {
    if (!window.grecaptcha) return '';
    return window.grecaptcha.getResponse(widgetIdRef.current ?? undefined) || '';
  }, []);

  const reset = useCallback(() => {
    if (window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current ?? undefined);
    }
  }, []);

  return { containerRef, ready, error, getToken, reset };
}
