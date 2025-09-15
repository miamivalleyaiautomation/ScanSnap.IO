"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-rail">
          {/* Brand badge (left) */}
          <Link href="/" className="brand-badge" aria-label="ScanSnap home">
            {/* Icon (theme swap handled in CSS) */}
            <Image
              src="/assets/favicon_1024_dark.png"  /* dark icon for dark theme */
              alt=""
              width={20}
              height={20}
              className="mark mark-dark"
              priority
            />
            <Image
              src="/assets/favicon_1024_light.png" /* light icon for light theme */
              alt=""
              width={20}
              height={20}
              className="mark mark-light"
              priority
            />

            {/* Wordmark (never stretch) */}
            <span className="brand-text">
              <Image
                src="/assets/text_1024_dark.png"   /* dark wordmark for dark theme */
                alt="ScanSnap"
                width={200}
                height={40}
                className="word word-dark"
                priority
                style={{ height: 26, width: "auto" }}
              />
              <Image
                src="/assets/text_1024_light.png"  /* light wordmark for light theme */
                alt="ScanSnap"
                width={200}
                height={40}
                className="word word-light"
                priority
                style={{ height: 26, width: "auto" }}
              />
            </span>
          </Link>

          {/* Desktop chips */}
          <nav className="chip-nav" aria-label="Primary">
            <Link href="/#pricing" className="chip">Pricing</Link>
            <Link href="/#features" className="chip">Features</Link>
            <Link href="/#contact" className="chip">Contact</Link>
            <Link href="https://app.scansnap.io" className="chip">Go to App</Link>
            <Link href="/login" className="chip primary">Login</Link>
            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="right-controls">
            <button
              className="hamburger"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`menu-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`menu-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="menu-head">
          <span className="brand-badge" aria-hidden>
            <Image src="/assets/favicon_1024_dark.png" alt="" width={18} height={18} className="mark mark-dark" />
            <Image src="/assets/favicon_1024_light.png" alt="" width={18} height={18} className="mark mark-light" />
            <span className="brand-text">
              <Image src="/assets/text_1024_dark.png"  alt="ScanSnap" width={160} height={30} className="word word-dark"  style={{ height: 22, width: "auto" }}/>
              <Image src="/assets/text_1024_light.png" alt="ScanSnap" width={160} height={30} className="word word-light" style={{ height: 22, width: "auto" }}/>
            </span>
          </span>
          <div style={{display:"flex", gap:8}}>
            <ThemeToggle />
            <button className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <nav className="menu-body" onClick={() => setOpen(false)}>
          <Link href="/#pricing"  className="menu-link">Pricing</Link>
          <Link href="/#features" className="menu-link">Features</Link>
          <Link href="/#contact"  className="menu-link">Contact</Link>
          <div className="menu-inline">
            <Link href="https://app.scansnap.io" className="btn">Go to App</Link>
            <Link href="/login" className="btn primary">Login</Link>
          </div>
        </nav>
      </aside>
    </header>
  );
}
