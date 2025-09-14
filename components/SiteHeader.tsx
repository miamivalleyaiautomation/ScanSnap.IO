"use client";
import Link from "next/link";
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const html = document.documentElement;
    dark ? html.setAttribute("data-theme", "dark") : html.setAttribute("data-theme", "light");
  }, [dark]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link className="brand" href="/" aria-label="ScanSnap home">
          <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" width={24} height={24} />
          <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" width={24} height={24} />
          <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
          <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
        </Link>

        <nav className="nav-links" aria-label="Global">
          <Link className="link" href="/pricing">Pricing</Link>
          <Link className="link" href="/billing">Billing</Link>
          <Link className="link" href="/account">Account</Link>
          <Link className="link" href="/org">Team</Link>
          <a className="btn" href="https://app.scansnap.io/app">Go to App</a>

          <button className="icon-btn" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
            {dark ? "🌙" : "🌞"}
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn primary">Login</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <OrganizationSwitcher appearance={{ elements: { organizationSwitcherTrigger: { borderRadius: 10 } } }} />
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 32, height: 32 } } }} />
            </div>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
