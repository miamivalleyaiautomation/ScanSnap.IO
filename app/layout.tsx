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

          {/* Favicon that swaps with OS theme (runtime swap handled in SiteHeader too) */}
          <link rel="icon" href="/assets/favicon_1024_dark.png" media="(prefers-color-scheme: light)" />
          <link rel="icon" href="/assets/favicon_1024_light.png" media="(prefers-color-scheme: dark)" />
          <link rel="icon" href="/assets/favicon_1024_light.png" />
        </head>
        <body>
          {/* FULL-WIDTH, 3-COLUMN HEADER */}
          <header className="site-header">
            <div className="header-bar">
              {/* LEFT: ICON */}
              <a className="brand-left" href="/" aria-label="ScanSnap home">
                {/* Light asset = for dark theme; Dark asset = for light theme */}
                <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" width={42} height={42}/>
                <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" width={42} height={42}/>
              </a>

              {/* CENTER: WORDMARK */}
              <a className="brand-center" href="/" aria-label="ScanSnap">
                <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap"/>
                <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap"/>
              </a>

              {/* RIGHT: DESKTOP NAV + AUTH + MOBILE BURGER */}
              <SiteHeader />
            </div>
          </header>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
