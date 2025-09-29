// components/SiteHeader.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import LoginButton from "@/components/LoginButton";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopUserMenuOpen, setDesktopUserMenuOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

const handleSignOut = async () => {
  // Clear all app-related localStorage
  if (typeof window !== 'undefined') {
    // Clear session data
    localStorage.removeItem('scansnap_session');
    localStorage.removeItem('scansnap_session_token');
    localStorage.removeItem('scansnap_session_timestamp');
    
    // Clear any cached user data
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('ui.') || 
      key.startsWith('data.') || 
      key.startsWith('catalog.') || 
      key.startsWith('setup.')
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
  
  await signOut();
  
  // Redirect to app with no-session parameter
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io';
  window.location.href = `${appUrl}?no-session=true`;
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

          {/* Desktop inline nav chips */}
          <nav className="chip-nav" aria-label="Primary">
            {pathname === '/' ? (
              <>
                <Link className="chip" href="#features">Features</Link>
                <Link className="chip" href="#pricing">Pricing</Link>
                <Link className="chip" href="#contact">Contact</Link>
              </>
            ) : pathname === '/login' || pathname === '/signup' ? (
              <Link className="chip" href="/">← Back Home</Link>
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
                          handleSignOut();
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

          {/* Right controls / mobile ONLY */}
          <div className="right-controls mobile-only">
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
          ) : pathname === '/login' || pathname === '/signup' ? (
            <Link className="menu-link" href="/" onClick={() => setMobileMenuOpen(false)}>
              ← Back Home
            </Link>
          ) : (
            <Link className="menu-link" href="/" onClick={() => setMobileMenuOpen(false)}>
              ← Back Home
            </Link>
          )}
          
          <a className="menu-link" href={appUrl} onClick={() => setMobileMenuOpen(false)}>
            Go to App
          </a>
          
          {/* Account Management Section */}
          <SignedOut>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
              <LoginButton isMobile={true} />
            </div>
          </SignedOut>
          
          <SignedIn>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
              {user && (
                <div style={{ 
                  padding: '12px', 
                  background: 'rgba(148,163,184,.08)', 
                  borderRadius: '10px', 
                  marginBottom: '12px' 
                }}>
                  <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '4px' }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {user.emailAddresses[0]?.emailAddress}
                  </div>
                </div>
              )}
              
              <Link className="menu-link" href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
              <Link className="menu-link" href="/subscription" onClick={() => setMobileMenuOpen(false)}>
                Manage Subscription
              </Link>
              <Link className="menu-link" href="/purchases" onClick={() => setMobileMenuOpen(false)}>
                Purchase History
              </Link>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="menu-link"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  color: 'var(--fg)',
                  textAlign: 'center',
                  marginTop: '8px'
                }}
              >
                Sign Out
              </button>
            </div>
          </SignedIn>
          
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </header>
  );
}