// components/SiteHeader.tsx - Updated with mobile menu fixes
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import LoginButton from "@/components/LoginButton";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  // Check if we're on mobile and handle window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Force close mobile menu if we switch to desktop
      if (!mobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/subscription') return 'Manage Subscription';
    if (pathname === '/purchases') return 'Purchase History';
    if (pathname === '/') return '';
    return '';
  };

  const pageTitle = getPageTitle();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
          {pageTitle && isMobile && (
            <div className="mobile-page-title" style={{
              display: 'block',
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

          {/* Desktop inline nav chips - Only show on desktop */}
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
              
              {/* Desktop: Custom dropdown menu */}
              <div className="desktop-user-menu" style={{ position: 'relative' }}>
                <button 
                  className="chip user-name-trigger"
                  onClick={() => setDesktopUserMenuOpen(!desktopUserMenuOpen)}
                  style={{
                    background: desktopUserMenuOpen ? 'rgba(148,163,184,.15)' : 'rgba(148,163,184,.08)',
                    border: '1px solid var(--line)',
                  }}
                >
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0] || 'Account'}
                </button>
                
                {/* Custom dropdown menu */}
                {desktopUserMenuOpen && (
                  <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div 
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 998
                      }}
                      onClick={() => setDesktopUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown menu */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        background: 'var(--card)',
                        border: '1px solid var(--line)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow)',
                        minWidth: '200px',
                        zIndex: 999,
                        padding: '8px 0'
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          {user?.emailAddresses[0]?.emailAddress}
                        </div>
                      </div>
                      
                      <Link 
                        href="/dashboard" 
                        style={{ 
                          display: 'block', 
                          padding: '8px 16px', 
                          color: 'var(--fg)', 
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148,163,184,.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => setDesktopUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      
                      <Link 
                        href="/subscription" 
                        style={{ 
                          display: 'block', 
                          padding: '8px 16px', 
                          color: 'var(--fg)', 
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148,163,184,.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => setDesktopUserMenuOpen(false)}
                      >
                        Manage Subscription
                      </Link>
                      
                      <Link 
                        href="/purchases" 
                        style={{ 
                          display: 'block', 
                          padding: '8px 16px', 
                          color: 'var(--fg)', 
                          textDecoration: 'none',
                          fontSize: '0.875rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148,163,184,.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => setDesktopUserMenuOpen(false)}
                      >
                        Purchase History
                      </Link>
                      
                      <div style={{ height: '1px', background: 'var(--line)', margin: '8px 0' }} />
                      
                      <button
                        onClick={() => {
                          setDesktopUserMenuOpen(false);
                          signOut();
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 16px',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--fg)',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(148,163,184,.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </SignedIn>
            
            <ThemeToggle />
          </nav>

          {/* Right controls / mobile ONLY - Only render on mobile */}
          {isMobile && (
            <div className="right-controls mobile-only">
              {/* Mobile: Show UserButton icon only when signed in */}
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 flex items-center justify-center",
                      userButtonPopoverCard: {
                        position: 'fixed',
                        top: '70px',
                        right: '20px',
                        left: 'auto',
                        transform: 'none',
                        zIndex: '9999',
                        maxWidth: '90vw'
                      }
                    }
                  }}
                />
              </SignedIn>
              <button 
                className="hamburger" 
                aria-label="Open menu" 
                onClick={() => setMobileMenuOpen(true)}
                style={{
                  display: isMobile ? 'inline-flex' : 'none'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer - Only render and show on mobile */}
      {isMobile && (
        <>
          <div 
            className={`menu-backdrop ${mobileMenuOpen ? 'show' : ''}`} 
            onClick={closeMobileMenu}
            style={{
              display: mobileMenuOpen ? 'block' : 'none'
            }}
          />
          <aside 
            className={`menu-sheet ${mobileMenuOpen ? 'open' : ''}`}
            style={{
              display: isMobile ? 'flex' : 'none'
            }}
          >
            <div className="menu-head">
              <Link href="/" className="brand-inline mini" aria-label="ScanSnap Home">
                <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
                <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
              </Link>
              <button 
                className="hamburger" 
                aria-label="Close menu" 
                onClick={closeMobileMenu}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="menu-body">
              {pathname === '/' ? (
                <>
                  <Link className="menu-link" href="#features" onClick={closeMobileMenu}>
                    Features
                  </Link>
                  <Link className="menu-link" href="#pricing" onClick={closeMobileMenu}>
                    Pricing
                  </Link>
                  <Link className="menu-link" href="#contact" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                </>
              ) : (
                <Link className="menu-link" href="/" onClick={closeMobileMenu}>
                  ← Back Home
                </Link>
              )}
              
              <a className="menu-link" href={appUrl} onClick={closeMobileMenu}>
                Go to App
              </a>
              
              <SignedIn>
                <Link className="menu-link" href="/dashboard" onClick={closeMobileMenu}>
                  Dashboard
                </Link>
                <Link className="menu-link" href="/subscription" onClick={closeMobileMenu}>
                  Manage Subscription
                </Link>
                <Link className="menu-link" href="/purchases" onClick={closeMobileMenu}>
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
        </>
      )}
    </header>
  );
}