"use client";

import Link from "next/link";
import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Theme toggle
  useEffect(() => {
    const html = document.documentElement;
    dark ? html.setAttribute("data-theme", "dark") : html.setAttribute("data-theme", "light");
  }, [dark]);

  // Close on ESC + click outside + prevent body scroll when open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!open) return;
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
    <header className="site-header">
      {/* 3-column header: [spacer] [center brand] [hamburger] */}
      <div className="container header-row header-3col">
        {/* Left spacer (keeps brand centered even with right menu) */}
        <div aria-hidden />

        {/* Center brand (SCANSNAP wordmark only) */}
        <Link className="brand center-brand" href="/" aria-label="ScanSnap home">
          <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
          <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
        </Link>

        {/* Right controls: theme + hamburger */}
        <div className="right-controls">
          <button
            className="icon-btn"
            onClick={() => setDark((v) => !v)}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {dark ? "🌙" : "🌞"}
          </button>

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

      {/* Backdrop */}
      <div className={`menu-backdrop${open ? " show" : ""}`} />

      {/* Slide-over menu */}
      <aside
        id="site-menu"
        role="dialog"
        aria-modal="true"
        className={`menu-sheet${open ? " open" : ""}`}
        ref={sheetRef}
      >
        <div className="menu-head">
          <span className="brand mini">
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" width={22} height={22} />
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" width={22} height={22} />
            <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
            <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
          </span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="menu-body">
          {/* Marketing / product */}
          <a className="menu-link" href="/app/">Free Scanner</a>
          <a className="menu-link" href="/app/pro/">Pro Workspace</a>
          <Link className="menu-link" href="/pricing">Pricing</Link>

          {/* Account / team / billing */}
          <Link className="menu-link" href="/billing">Billing</Link>
          <Link className="menu-link" href="/account">Account</Link>
          <Link className="menu-link" href="/org">Team</Link>

          {/* App */}
          <a className="menu-link" href="https://app.scansnap.io/app">Go to App</a>

          {/* Auth / user */}
          <div className="menu-inline">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn primary" onClick={() => setOpen(false)}>Login</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <OrganizationSwitcher
                  appearance={{ elements: { organizationSwitcherTrigger: { borderRadius: 10 } } }}
                />
                <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 32, height: 32 } } }} />
              </div>
            </SignedIn>
          </div>

          {/* Theme toggle inside menu too */}
          <button className="btn" onClick={() => setDark((v) => !v)}>
            Switch to {dark ? "Light" : "Dark"} theme
          </button>
        </nav>
      </aside>
    </header>
  );
}
