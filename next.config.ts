import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const isDev = process.env.NODE_ENV === "development";
const supabaseWss = supabaseUrl.replace("https://", "wss://");

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' ${supabaseUrl} ${supabaseWss} https://cloudflareinsights.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\n/g, "");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGIN?.split(",") ?? ["localhost:3000"]
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { 
            key: "X-Frame-Options", 
            value: "DENY" 
          },
          { 
            key: "X-Content-Type-Options", 
            value: "nosniff" 
          },
          { 
            key: "Referrer-Policy", 
            value: "strict-origin-when-cross-origin" 
          },
          { 
            key: "Permissions-Policy", 
            value: "camera=(), microphone=(), geolocation=()" 
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          { 
            key: "Content-Security-Policy", 
            value: cspHeader 
          }
        ]
      }
    ]
  },
};

export default nextConfig;