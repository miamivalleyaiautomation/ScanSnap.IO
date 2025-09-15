"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";

function applyFavicon(isDark: boolean) {
  const light = "/assets/favicon_1024_light.png";
  const dark  = "/assets/favicon_1024_dark.png";
  let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = isDark ? light : dark;
}

export default function SiteHeader() {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // theme + favicon
  useEffect(() => {
    const html = document.documentElement;
    dark ? html.setAttribute("data-theme", "dark") : html.setAttribute("data-theme", "light");
    applyFavicon(dark);
  }, [dark]);

  // drawer close
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header glass">
      <div className="container">
        <div className="nav-rail">

          {/* LEFT: brand badge (icon + word) */}
          <a href="/" className="brand-badge" aria-label="ScanSnap Home">
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" width={20} height={20}/>
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" width={20} height={20}/>
            <span className="brand-text">
              <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
              <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
            </span>
          </a>

          {/* RIGHT: nav chips (desktop) */}
          <nav className="chip-nav" aria-label="Primary">
            <a className="chip" href="#pricing">Pricing</a>
            <a className="chip" href="#features">Features</a>
            <a className="chip" href="#contact">Contact</a>
            <a className="chip" href="https://app.scansnap.io/app">Go to App</a>

            <ClerkLoaded>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="chip primary">Login</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <OrganizationSwitcher
                  appearance={{ elements: { organizationSwitcherTrigger: { borderRadius: 999 } } }}
                />
                <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 28, height: 28 } } }} />
              </SignedIn>
            </ClerkLoaded>
          </nav>

          {/* RIGHT: hamburger (mobile) */}
          <div className="right-controls">
            <button
              className="hamburger"
              aria-label="Open menu"
              aria-controls="site-menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`menu-backdrop${open ? " show" : ""}`} />
      <aside
        id="site-menu"
        role="dialog"
        aria-modal="true"
        className={`menu-sheet${open ? " open" : ""}`}
        ref={sheetRef}
      >
        <div className="menu-head">
          <span className="brand mini" aria-hidden>
            <img className="mark mark-light" src="/assets/favicon_1024_light.png"  alt="" width={18} height={18}/>
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"   alt="" width={18} height={18}/>
            <img className="word word-light" src="/assets/text_1024_light.png"     alt="ScanSnap" />
            <img className="word word-dark"  src="/assets/text_1024_dark.png"      alt="ScanSnap" />
          </span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className="menu-body">
          <a className="menu-link" href="#pricing"  onClick={()=>setOpen(false)}>Pricing</a>
          <a className="menu-link" href="#features" onClick={()=>setOpen(false)}>Features</a>
          <a className="menu-link" href="#contact"  onClick={()=>setOpen(false)}>Contact</a>
          <a className="menu-link" href="https://app.scansnap.io/app" onClick={()=>setOpen(false)}>Go to App</a>

          <div className="menu-inline">
            <button className="btn" onClick={() => setDark(d => !d)}>
              Switch to {dark ? "Light" : "Dark"} theme
            </button>
          </div>

          <ClerkLoaded>
            <div className="menu-inline">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn primary" onClick={()=>setOpen(false)}>Login</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <OrganizationSwitcher
                  appearance={{ elements: { organizationSwitcherTrigger: { borderRadius: 10 } } }}
                />
                <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 32, height: 32 } } }} />
              </SignedIn>
            </div>
          </ClerkLoaded>
        </nav>
      </aside>
    </header>
  );
}
