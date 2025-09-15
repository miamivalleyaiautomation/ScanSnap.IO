// app/layout.tsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "ScanSnap",
  description: "Fast document scanning and AI workspace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" data-theme="dark">
        <head>
          {/* Browser UI theme colors */}
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#0b0d10" />

          {/* Favicon that swaps with OS theme; we also swap at runtime on manual toggle */}
          <link rel="icon" href="/assets/favicon_1024_dark.png" media="(prefers-color-scheme: light)" />
          <link rel="icon" href="/assets/favicon_1024_light.png" media="(prefers-color-scheme: dark)" />
          <link rel="icon" href="/assets/favicon_1024_light.png" />
        </head>
        <body>
          <SiteHeader />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
