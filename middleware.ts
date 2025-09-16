import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/subscription(.*)',
  '/purchases(.*)',
])

export default clerkMiddleware((auth, req: NextRequest) => {
  // Handle portal subdomain rewriting first
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // Serve portal.scansnap.io/* from /portal/*
  if (host.startsWith("portal.") && !url.pathname.startsWith("/portal")) {
    url.pathname = `/portal${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth().protect()
  }

  return NextResponse.next();
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};