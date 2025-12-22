import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",

      // ✅ Next.js + Firebase compatible
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://*.firebaseio.com",

      // Styles
      "style-src 'self' 'unsafe-inline'",

      // Images
      "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://www.gstatic.com",

      // Fonts
      "font-src 'self' https://fonts.gstatic.com",

      // Firebase + ipify
      "connect-src 'self' \
        https://*.googleapis.com \
        https://*.firebaseio.com \
        https://securetoken.googleapis.com \
        https://identitytoolkit.googleapis.com \
        https://api.ipify.org",

      // Workers
      "worker-src 'self' blob:",

      // Security
      "frame-src 'none'",
      "media-src 'self'",
    ].join("; "),
  },

  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
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
