import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",

      // ✅ Next.js + Firebase + reCAPTCHA compatible
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://*.firebaseio.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",

      // Styles
      "style-src 'self' 'unsafe-inline' https://www.gstatic.com/recaptcha/ https://fonts.googleapis.com",

      // Images
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",

      // Fonts
      "font-src 'self' https://fonts.gstatic.com",

      // Firebase + ipify + reCAPTCHA
      "connect-src 'self' \
        https://*.googleapis.com \
        https://*.firebaseio.com \
        https://securetoken.googleapis.com \
        https://identitytoolkit.googleapis.com \
        https://api.ipify.org \
        https://www.google.com/recaptcha/ \
        https://www.gstatic.com/recaptcha/",

      // Frames - allow reCAPTCHA iframe
      "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/",

      // Workers
      "worker-src 'self' blob:",

      // Media
      "media-src 'self'",
    ].join("; "),
  },

  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
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
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;