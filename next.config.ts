import type { NextConfig } from "next";
import { randomBytes } from "crypto";

const generateNonce = () => {
  return randomBytes(16).toString("base64");
};

const createCSP = (nonce: string) => {
  return [
    "default-src 'self'",
    // Allow inline scripts with nonce + external Firebase/reCAPTCHA
    `script-src 'self' 'nonce-${nonce}' https://www.gstatic.com https://*.firebaseio.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com`,
    // Styles - keep unsafe-inline for Firebase UI
    "style-src 'self' 'unsafe-inline' https://www.gstatic.com/recaptcha/ https://fonts.googleapis.com",
    // Images
    "img-src 'self' data: blob: https: https://firebasestorage.googleapis.com https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com https://www.google-analytics.com",
    // Fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    // Firebase Realtime DB, Auth, Storage + reCAPTCHA + Analytics
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebasestorage.googleapis.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://api.ipify.org wss://*.firebaseio.com https://www.googletagmanager.com https://www.google-analytics.com https://region1.analytics.google.com https://region1.google-analytics.com",
    // reCAPTCHA iframe
    "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/",
    // Workers and blobs
    "worker-src 'self' blob:",
    "child-src blob:",
    // Media
    "media-src 'self'",
    // Form action
    "form-action 'self'",
  ].join("; ");
};

const securityHeaders = (nonce: string) => [
  {
    key: "Content-Security-Policy",
    value: createCSP(nonce),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const nonce = generateNonce();

    // Store nonce for use in middleware/API routes
    return [
      {
        source: "/(.*)",
        headers: [
          ...securityHeaders(nonce),
          {
            key: "X-Nonce",
            value: nonce,
          },
        ],
      },
    ];
  },
};

export default nextConfig;