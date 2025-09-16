import { clerkMiddleware } from "@clerk/nextjs/server";


export default clerkMiddleware();


export const config = {
// Covers all pages + API routes; excludes _next/static and file assets
matcher: [
"/((?!.+\\.[\\w]+$|_next).*)",
"/(api|trpc)(.*)",
],
};
