// proxy.ts (rename from middleware.ts OR keep as middleware.ts with proxy export)

// Option 1: If you want to keep the file as middleware.ts, export as proxy
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const path = request.nextUrl.pathname;

  console.log("📍 Proxy:", { hostname, path }); // For debugging

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
  const parts = hostname.split(".");
  if (hostname.includes("vercel.app") && parts.length >= 3) {
    const subdomain = parts[0];
    // Don't rewrite the main domain
    if (subdomain !== "xrow-app" && subdomain !== "www") {
      console.log(`✅ REWRITING: ${hostname}${path} → /${subdomain}${path}`);

      // Create new URL for rewrite
      const newUrl = new URL(
        `/${subdomain}${path}`,
        `https://xrow-app.vercel.app`,
      );
      return NextResponse.rewrite(newUrl);
    }
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
