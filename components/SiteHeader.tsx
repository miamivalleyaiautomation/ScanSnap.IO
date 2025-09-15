"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <div className="nav-rail">
          {/* left brand badge */}
          <Link href="/" className="brand-badge" aria-label="ScanSnap home">
            {/* Icon (theme swap handled in CSS) */}
            <Image
              src="/assets/favicon_1024_light.png"
              alt=""
              width={20}
              height={20}
              className="mark mark-light"
              priority
            />
            <Image
              src="/assets/favicon_1024_dark.png"
              alt=""
              width={20}
              height={20}
              className="mark mark-dark"
              priority
            />

            {/* Wordmark (explicit size so it never explodes) */}
            <span className="brand-text">
              <Image
                src="/assets/text_1024_light.png"
                alt="ScanSnap"
                width={176}
                height={34}
                className="word word-light"
                priority
              />
              <Image
                src="/assets/text_1024_dark.png"
                alt="ScanSnap"
                width={176}
                height={34}
                className="word word-dark"
                priority
              />
            </span>
          </Link>

          {/* desktop chips */}
          <nav className="chip-nav" aria-label="Primary">
            <Link href="/#pricing" className="chip">Pricing</Link>
            <Link href="/#features" className="chip">Features</Link>
            <Link href="/#contact" className="chip">Contact</Link>
            <Link href="https://app.scansnap.io" className="chip">Go to App</Link>
            <Link href="/login" className="chip primary">Login</Link>
          </nav>

          {/* mobile controls */}
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

      {/* mobile drawer */}
      <div className={`menu-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`menu-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="menu-head">
          <span className="brand-badge">
            <Image src="/assets/favicon_1024_light.png" alt="" width={18} height={18} className="mark mark-light" />
            <Image src="/assets/favicon_1024_dark.png"  alt="" width={18} height={18} className="mark mark-dark" />
            <span className="brand-text">
              <Image src="/assets/text_1024_light.png" alt="ScanSnap" width={136} height={26} className="word word-light" />
              <Image src="/assets/text_1024_dark.png"  alt="ScanSnap" width={136} height={26} className="word word-dark" />
            </span>
          </span>
          <button className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
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
