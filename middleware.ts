import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/webhooks/(.*)",
    "/pricing",
    "/features",
    "/contact"
  ],
  // Routes that require authentication
  ignoredRoutes: [
    "/((?!api|trpc))(_next|.+\\.[\\w]+$)",
  ],
  // Custom logic for portal subdomain
  beforeAuth: (req: NextRequest) => {
    const host = req.headers.get("host") || "";
    const url = req.nextUrl;

    // Serve portal.scansnap.io/* from /portal/*
    if (host.startsWith("portal.") && !url.pathname.startsWith("/portal")) {
      url.pathname = `/portal${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};