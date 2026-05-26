// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;

  console.log("📍 Middleware:", { hostname, path }); // For debugging

  // Skip API routes, static files, and auth routes
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.includes(".") ||
    path.startsWith("/auth") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/onboarding")
  ) {
    return NextResponse.next();
  }

  // Handle store subdomains on xrow-app.vercel.app
  if (hostname.includes("vercel.app") && !hostname.startsWith("xrow-app")) {
    // Extract store slug from subdomain
    // "my-store.xrow-app.vercel.app" → "my-store"
    const storeSlug = hostname.split(".")[0];

    console.log(`🏪 Rewriting subdomain: ${hostname} → /${storeSlug}${path}`);

    // Rewrite to the store page with the slug
    return NextResponse.rewrite(new URL(`/${storeSlug}${path}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
