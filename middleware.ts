import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl;

  // Serve portal.scansnap.io/* from /portal/*
  if (host.startsWith("portal.") && !url.pathname.startsWith("/portal")) {
    url.pathname = `/portal${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };
