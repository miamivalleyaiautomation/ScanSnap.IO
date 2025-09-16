import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/webhooks/(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/pricing",
    "/about",
    "/contact"
  ],
  // Routes that require authentication
  ignoredRoutes: [
    "/((?!api|trpc))(_next|.+\\.[\\w]+$)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};