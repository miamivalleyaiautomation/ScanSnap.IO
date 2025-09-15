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
  // Light icon on dark theme; dark icon on light theme
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

  // Apply theme + favicon
  useEffect(() => {
    const html = document.documentElement;
    dark ? html.setAttribute("data-theme", "dark") : html.setAttribute("data-theme", "light");
    applyFavicon(dark);
  }, [dark]);

  // Drawer behavior
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
    <>
      {/* DESKTOP NAV (centered area is the wordmark; this nav sits on the right cluster) */}
      <nav className="nav-inline" aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
        <a href="https://app.scansnap.io/app">Go to App</a>
      </nav>

      {/* RIGHT CONTROLS */}
      <div className="right-controls">
        {/* Mobile hamburger (hidden on desktop by CSS) */}
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

        {/* Theme toggle */}
        <button className="icon-btn" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
          {dark ? "🌙" : "🌞"}
        </button>

        {/* Desktop auth (hidden on mobile via CSS if you want; we leave it visible) */}
        <ClerkLoaded>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn primary">Login</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <OrganizationSwitcher
              appearance={{ elements: { organizationSwitcherTrigger: { borderRadius: 10 } } }}
            />
            <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 32, height: 32 } } }} />
          </SignedIn>
        </ClerkLoaded>
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
            <img className="mark mark-light" src="/assets/favicon_1024_light.png"  alt="" width={22} height={22}/>
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"   alt="" width={22} height={22}/>
            <img className="word word-light" src="/assets/text_1024_light.png"     alt="ScanSnap" />
            <img className="word word-dark"  src="/assets/text_1024_dark.png"      alt="ScanSnap" />
          </span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
        </div>

        <nav className="menu-body">
          <a className="menu-link" href="#features" onClick={()=>setOpen(false)}>Features</a>
          <a className="menu-link" href="#pricing"  onClick={()=>setOpen(false)}>Pricing</a>
          <a className="menu-link" href="#contact"  onClick={()=>setOpen(false)}>Contact</a>
          <a className="menu-link" href="https://app.scansnap.io/app" onClick={()=>setOpen(false)}>Go to App</a>

          <ClerkLoaded>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
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

          <button className="btn" onClick={() => setDark(d => !d)}>
            Switch to {dark ? "Light" : "Dark"} theme
          </button>
        </nav>
      </aside>
    </>
  );
}
