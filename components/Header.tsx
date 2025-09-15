"use client";
import { useMemo, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    return saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = next === "dark" ? "/assets/favicon_1024_dark.png" : "/assets/favicon_1024_light.png";
  }

  return (
    <button className="chip" onClick={toggle} aria-label="Toggle theme">
      <span aria-hidden="true">{theme === "dark" ? "🌞" : "🌙"}</span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const portalUrl = useMemo(() => process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.scansnap.io", []);
  const appUrl = useMemo(() => process.env.NEXT_PUBLIC_APP_URL || "https://app.scansnap.io", []);

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="nav-rail">
            <a className="brand-badge" href="/" aria-label="ScanSnap home">
              <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
              <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
              <span className="brand-text">
                <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
                <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
              </span>
            </a>

            <nav className="chip-nav" aria-label="Primary">
              <a className="chip" href="#pricing">Pricing</a>
              <a className="chip" href="#features">Features</a>
              <a className="chip" href="#contact">Contact</a>
              <a className="chip" href={appUrl}>Go to App</a>
              <a className="chip primary" href={`${portalUrl}/login`}>Login</a>
              <ThemeToggle />
            </nav>

            <div className="right-controls">
              <a className="chip" href={appUrl}>Go to App</a>
              <a className="chip primary" href={`${portalUrl}/login`}>Login</a>
              <ThemeToggle />
              <button className="hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`menu-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`menu-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="menu-head">
          <div className="brand mini" style={{ display:"flex", gap:8, alignItems:"center" }}>
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
            <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
            <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
          </div>
          <button className="hamburger" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <div className="menu-body">
          <a className="menu-link" href="#pricing"  onClick={() => setOpen(false)}>Pricing</a>
          <a className="menu-link" href="#features" onClick={() => setOpen(false)}>Features</a>
          <a className="menu-link" href="#contact"  onClick={() => setOpen(false)}>Contact</a>
          <div className="menu-inline">
            <a className="chip" href={appUrl}>Go to App</a>
            <a className="chip primary" href={`${portalUrl}/login`}>Login</a>
          </div>
        </div>
      </aside>
    </>
  );
}
