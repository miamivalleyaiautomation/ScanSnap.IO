// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/api/webhooks/clerk",
    "/api/webhooks/lemonsqueezy",
  ],
  
  // Ignore routes for static files and Next.js internals
  ignoredRoutes: [
    "/((?!api|trpc))(_next.*|.+\\.[\\w]+$)",
    "/assets/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};