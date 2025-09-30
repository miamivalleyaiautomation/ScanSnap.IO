// app/signup/[[...signup]]/page.tsx
"use client"

import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)', 
      color: 'var(--fg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <header style={{
        padding: '1rem 0',
        borderBottom: '1px solid var(--line)'
      }}>
        <div className="container">
          <Link href="/" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <img 
              className="mark mark-light" 
              src="/assets/favicon_1024_light.png" 
              alt="" 
              style={{ height: '32px' }}
            />
            <img 
              className="mark mark-dark" 
              src="/assets/favicon_1024_dark.png" 
              alt="" 
              style={{ height: '32px' }}
            />
            <img 
              className="word word-light" 
              src="/assets/text_1024_light.png" 
              alt="ScanSnap" 
              style={{ height: '24px' }}
            />
            <img 
              className="word word-dark" 
              src="/assets/text_1024_dark.png" 
              alt="ScanSnap" 
              style={{ height: '24px' }}
            />
          </Link>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0.5rem',
        paddingTop: '1rem',
        minHeight: 'auto',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px'
        }}>
          {mounted ? (
            <SignUp
              path="/signup"
              routing="path"
              signInUrl="/login"
              afterSignUpUrl="/dashboard"
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: '#00d1ff',
                  colorBackground: 'var(--card)',
                  colorText: 'var(--fg)',
                  colorTextSecondary: 'var(--muted)',
                  colorTextOnPrimaryBackground: '#ffffff',
                  colorInputBackground: 'var(--bg)',
                  colorInputText: 'var(--fg)',
                  colorNeutral: 'var(--fg)',
                  borderRadius: '12px',
                },
                elements: {
                  rootBox: {
                    width: '100%',
                  },
                  card: {
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow)',
                    padding: '1.25rem',
                    maxHeight: 'calc(100vh - 100px)',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    margin: '0 auto',
                    width: '100%'
                  },
                  headerTitle: {
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--fg)',
                    marginBottom: '0.25rem'
                  },
                  headerSubtitle: {
                    color: 'var(--muted)',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                  },
                  socialButtons: {
                    marginBottom: '1rem',
                  },
                  socialButtonsBlockButton: {
                    background: 'var(--bg)',
                    border: '2px solid var(--brand0)',
                    borderRadius: '12px',
                    color: 'var(--fg)',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    padding: '0.75rem',
                    transition: 'all 0.2s ease',
                    marginBottom: '0.75rem',
                  },
                  socialButtonsBlockButton__google: {
                    background: 'linear-gradient(135deg, #00d1ff, #4a90e2)',
                    border: 'none',
                    color: '#fff',
                  },
                  socialButtonsBlockButtonText__google: {
                    color: '#fff',
                  },
                  dividerRow: {
                    marginTop: '1rem',
                    marginBottom: '1rem',
                  },
                  formButtonPrimary: {
                    background: 'linear-gradient(135deg, #00d1ff, #4a90e2)',
                    border: 'none',
                    borderRadius: '999px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    padding: '0.75rem 1.5rem',
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                    color: '#fff',
                  },
                  formFieldInput: {
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    color: 'var(--fg)',
                    padding: '0.75rem',
                    fontSize: '16px',
                  },
                  formFieldLabel: {
                    color: 'var(--fg)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  },
                  dividerLine: {
                    background: 'var(--line)',
                  },
                  dividerText: {
                    color: 'var(--muted)',
                    fontSize: '0.875rem',
                  },
                  otpCodeFieldInput: {
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    color: 'var(--fg)',
                    width: '3rem',
                    height: '3rem',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                  },
                  footerActionLink: {
                    color: 'var(--brand0)',
                    textDecoration: 'none',
                    fontWeight: '500',
                  },
                  formFieldError: {
                    color: '#ef4444',
                  },
                  alert: {
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                  },
                  alertText: {
                    color: '#ef4444',
                  },
                  // CRITICAL: Add these styles for the "Use another method" screen
                  alternativeMethodsBlockButton: {
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '12px',
                    color: 'var(--fg)',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  },
                  alternativeMethodsBlockButtonText: {
                    color: 'var(--fg)',
                  },
                  alternativeMethodsBlockButtonArrow: {
                    color: 'var(--muted)',
                  },
                  alternativeMethodsBlockButtonContent: {
                    color: 'var(--fg)',
                  },
                  alternativeMethods: {
                    background: 'var(--card)',
                    color: 'var(--fg)',
                  },
                  backRow: {
                    marginBottom: '1rem',
                  },
                  backLink: {
                    color: 'var(--brand0)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  },
                  identityPreview: {
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    color: 'var(--fg)',
                  },
                  identityPreviewText: {
                    color: 'var(--fg)',
                    fontSize: '0.875rem',
                  },
                  identityPreviewEditButton: {
                    color: 'var(--brand0)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                  },
                  // Additional styles for other screens
                  formHeaderTitle: {
                    color: 'var(--fg)',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                  },
                  formHeaderSubtitle: {
                    color: 'var(--muted)',
                    fontSize: '0.875rem',
                  },
                  footerAction: {
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--line)',
                  },
                  footerActionText: {
                    color: 'var(--muted)',
                    fontSize: '0.875rem',
                  },
                  // Ensure all text elements are visible
                  text: {
                    color: 'var(--fg)',
                  },
                  providerIcon: {
                    filter: 'brightness(1)',
                  },
                  providerIcon__google: {
                    filter: 'none',
                  },
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                }
              }}
            />
          ) : (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                border: '3px solid var(--brand0)', 
                borderTop: '3px solid transparent', 
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p>Loading...</p>
            </div>
          )}

          <div style={{
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: 'var(--muted)', 
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              Already have an account?{' '}
              <Link 
                href="/login" 
                style={{ 
                  color: 'var(--brand0)', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign in
              </Link>
            </p>
            
            <Link 
              href="/" 
              style={{ 
                color: 'var(--muted)', 
                fontSize: '0.875rem',
                textDecoration: 'none'
              }}
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}