import { NextRequest, NextResponse } from "next/server";

// Generate nonce using Web Crypto API (Edge Runtime compatible)
async function generateNonce(): Promise<string> {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const nonce = await generateNonce();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-Nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.gstatic.com https://*.firebaseio.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com https://cdn.jsdelivr.net`,
    "style-src 'self' 'unsafe-inline' https://www.gstatic.com/recaptcha/ https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: https://firebasestorage.googleapis.com https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebasestorage.googleapis.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://api.ipify.org wss://*.firebaseio.com",
    "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/",
    "worker-src 'self' blob:",
    "child-src blob:",
    "media-src 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};