// components/SiteHeader.tsx
'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import ThemeToggle from '@/components/ThemeToggle';
import LoginButton from '@/components/LoginButton';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.scansnap.io';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();

  // Don't show header on sign-in/sign-up pages
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return null;
  }

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
            <img className="mark mark-dark" src="/assets/favicon_1024_dark.png" alt="" />
            <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
            <img className="word word-dark" src="/assets/text_1024_dark.png" alt="ScanSnap" />
          </Link>

          {/* Desktop inline nav chips - This shows on desktop only due to CSS media queries */}
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
            <ThemeToggle />
            
            {/* Signed out: show login button */}
            <SignedOut>
              <LoginButton />
            </SignedOut>
            
            {/* Signed in: show dashboard link and user button */}
            <SignedIn>
              <Link className="chip" href="/dashboard">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>

          {/* Mobile controls - This shows on mobile only due to CSS media queries */}
          <div className="right-controls">
            <SignedOut>
              <Link href="/sign-in" className="btn primary mobile-login">
                Sign In
              </Link>
            </SignedOut>
            
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Hamburger menu button */}
            <button 
              className="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile slide-out menu */}
          <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
            <div className="mobile-menu-content">
              {/* Mobile page title */}
              {pageTitle && (
                <div className="mobile-page-title-menu">{pageTitle}</div>
              )}
              
              {/* Mobile nav links */}
              {pathname === '/' ? (
                <>
                  <Link 
                    className="mobile-menu-item" 
                    href="#features"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    className="mobile-menu-item" 
                    href="#pricing"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    className="mobile-menu-item" 
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              ) : (
                <Link 
                  className="mobile-menu-item" 
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ← Back Home
                </Link>
              )}
              
              <a 
                className="mobile-menu-item" 
                href={appUrl}
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to App
              </a>

              <SignedIn>
                <Link 
                  className="mobile-menu-item" 
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </SignedIn>
              
              {/* Theme toggle in mobile menu */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <ThemeToggle />
              </div>
            </div>
          </nav>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div 
              className="mobile-menu-overlay"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}