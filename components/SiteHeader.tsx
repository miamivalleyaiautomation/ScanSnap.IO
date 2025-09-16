// components/SiteHeader.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import LoginButton from "@/components/LoginButton";

export default function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.scansnap.io";

  return (
    <header className="site-header glass">
      <div className="container">
        <div className="nav-rail">
          {/* Brand: NO inner pill — just icon + wordmark, perfectly centered */}
          <Link href="/" className="brand-inline" aria-label="ScanSnap Home">
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
            <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
            <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
          </Link>

          {/* Desktop inline nav chips */}
          <nav className="chip-nav" aria-label="Primary">
            <Link className="chip" href="#features">Features</Link>
            <Link className="chip" href="#pricing">Pricing</Link>
            <Link className="chip" href="#contact">Contact</Link>
            <a className="chip" href={appUrl}>Go to App</a>
            
            {/* Signed out: show login */}
            <SignedOut>
              <LoginButton />
            </SignedOut>
            
            {/* Signed in: show user button */}
            <SignedIn>
              <Link className="chip" href="/dashboard">Dashboard</Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
            
            <ThemeToggle />
          </nav>

          {/* Right controls / mobile - only hamburger */}
          <div className="right-controls">
            <SignedOut>
              <LoginButton />
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
            <ThemeToggle />
            <button className="hamburger" aria-label="Open menu" data-open-menu>
              <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer - everything goes here */}
      <div className="menu-backdrop" data-menu-backdrop />
      <aside className="menu-sheet" data-menu-sheet>
        <div className="menu-head">
          <Link href="/" className="brand-inline mini" aria-label="ScanSnap Home">
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
          </Link>
          <button className="hamburger" aria-label="Close menu" data-close-menu>
            <svg width="18" height="18" viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="menu-body">
          <Link className="menu-link" href="#features">Features</Link>
          <Link className="menu-link" href="#pricing">Pricing</Link>
          <Link className="menu-link" href="#contact">Contact</Link>
          <a className="menu-link" href={appUrl}>Go to App</a>
          
          <SignedOut>
            <div className="menu-inline">
              <LoginButton />
            </div>
          </SignedOut>
          
          <SignedIn>
            <Link className="menu-link" href="/dashboard">Dashboard</Link>
          </SignedIn>
          
          <ThemeToggle />
        </div>
      </aside>

      {/* Simple menu wiring */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              var open = document.querySelector('[data-open-menu]');
              var closeBtn = document.querySelector('[data-close-menu]');
              var sheet = document.querySelector('[data-menu-sheet]');
              var backdrop = document.querySelector('[data-menu-backdrop]');
              function openMenu(){ sheet && sheet.classList.add('open'); backdrop && backdrop.classList.add('show'); }
              function closeMenu(){ sheet && sheet.classList.remove('open'); backdrop && backdrop.classList.remove('show'); }
              open && open.addEventListener('click', openMenu);
              closeBtn && closeBtn.addEventListener('click', closeMenu);
              backdrop && backdrop.addEventListener('click', closeMenu);
            }());
          `,
        }}
      />
    </header>
  );
}