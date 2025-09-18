// components/SiteHeader.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import LoginButton from "@/components/LoginButton";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/subscription') return 'Manage Subscription';
    if (pathname === '/purchases') return 'Purchase History';
    if (pathname === '/') return '';
    return '';
  };

  const pageTitle = getPageTitle();

  return (
    <header className="site-header glass">
      <div className="container">
        <div className="nav-rail">
          {/* Brand: icon + wordmark */}
          <Link href="/" className="brand-inline" aria-label="ScanSnap Home">
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
            <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
            <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
          </Link>

          {/* Mobile page title in center */}
          {pageTitle && (
            <div className="mobile-page-title" style={{
              display: 'none',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--fg)'
            }}>
              {pageTitle}
            </div>
          )}

          {/* Desktop inline nav chips */}
          <nav className="chip-nav" aria-label="Primary">
            {pathname === '/' ? (
              <>
                <Link className="chip" href="#features">Features</Link>
                <Link className="chip" href="#pricing">Pricing</Link>
                <Link className="chip" href="#contact">Contact</Link>
              </>
            ) : (
              <Link className="chip" href="/">← Back Home</Link>
            )}
            
            <a className="chip" href={appUrl}>Go to App</a>
            
            {/* Signed out: show login button */}
            <SignedOut>
              <LoginButton />
            </SignedOut>
            
            {/* Signed in: show dashboard link and clickable user name */}
            <SignedIn>
              <Link className="chip" href="/dashboard">Dashboard</Link>
              
              {/* Desktop: Clickable user name that opens user menu */}
              <div className="desktop-user-menu">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonTrigger: "hidden", // Hide the default trigger
                      userButtonPopoverCard: "fixed left-1/2 top-20 transform -translate-x-1/2 z-[9999]",
                    }
                  }}
                />
                <button 
                  className="chip user-name-trigger"
                  onClick={() => {
                    // Programmatically trigger the UserButton
                    const userButton = document.querySelector('.cl-userButtonTrigger') as HTMLElement;
                    if (userButton) {
                      userButton.click();
                    }
                  }}
                  style={{
                    background: 'rgba(148,163,184,.08)',
                    border: '1px solid var(--line)',
                  }}
                >
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'Account'}
                </button>
              </div>
            </SignedIn>
            
            <ThemeToggle />
          </nav>

          {/* Right controls / mobile */}
          <div className="right-controls">
            {/* Mobile: Show UserButton icon only when signed in */}
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 flex items-center justify-center",
                    userButtonPopoverCard: "fixed left-1/2 top-20 transform -translate-x-1/2 z-[9999]",
                  }
                }}
              />
            </SignedIn>
            <button 
              className="hamburger" 
              aria-label="Open menu" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div 
        className={`menu-backdrop ${mobileMenuOpen ? 'show' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside className={`menu-sheet ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="menu-head">
          <Link href="/" className="brand-inline mini" aria-label="ScanSnap Home">
            <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
            <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
          </Link>
          <button 
            className="hamburger" 
            aria-label="Close menu" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="menu-body">
          {pathname === '/' ? (
            <>
              <Link className="menu-link" href="#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link className="menu-link" href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link className="menu-link" href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </>
          ) : (
            <Link className="menu-link" href="/" onClick={() => setMobileMenuOpen(false)}>
              ← Back Home
            </Link>
          )}
          
          <a className="menu-link" href={appUrl} onClick={() => setMobileMenuOpen(false)}>
            Go to App
          </a>
          
          <SignedIn>
            <Link className="menu-link" href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link className="menu-link" href="/subscription" onClick={() => setMobileMenuOpen(false)}>
              Manage Subscription
            </Link>
            <Link className="menu-link" href="/purchases" onClick={() => setMobileMenuOpen(false)}>
              Purchase History
            </Link>
          </SignedIn>
          
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <SignedOut>
              <LoginButton isMobile={true} />
            </SignedOut>
            
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 1023px) {
          .mobile-page-title {
            display: block !important;
          }
          .desktop-user-menu {
            display: none !important;
          }
        }
        
        @media (min-width: 1024px) {
          .desktop-user-menu {
            display: flex !important;
            align-items: center;
            position: relative;
          }
          
          .user-name-trigger:hover {
            background: rgba(148,163,184,.15) !important;
          }
        }
      `}</style>
    </header>
  );
}