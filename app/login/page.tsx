// app/login/page.tsx
"use client"

import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard'
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
      {/* Simple header with logo */}
      <header style={{
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--line)'
      }}>
        <div className="container">
          <Link href="/" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <img 
              className="mark mark-light" 
              src="/assets/favicon_1024_light.png" 
              alt="" 
              style={{ height: '40px' }}
            />
            <img 
              className="mark mark-dark" 
              src="/assets/favicon_1024_dark.png" 
              alt="" 
              style={{ height: '40px' }}
            />
            <img 
              className="word word-light" 
              src="/assets/text_1024_light.png" 
              alt="ScanSnap" 
              style={{ height: '32px' }}
            />
            <img 
              className="word word-dark" 
              src="/assets/text_1024_dark.png" 
              alt="ScanSnap" 
              style={{ height: '32px' }}
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px'
        }}>
          {mounted ? (
            <SignIn 
              routing="path"
              path="/login"
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorPrimary: '#00d1ff',
                  colorBackground: 'var(--card)',
                  colorText: 'var(--fg)',
                  colorTextSecondary: 'var(--muted)',
                  colorInputBackground: 'var(--bg)',
                  colorInputText: 'var(--fg)',
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
                    padding: '2rem',
                  },
                  headerTitle: {
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--fg)',
                  },
                  headerSubtitle: {
                    color: 'var(--muted)',
                    marginBottom: '1.5rem',
                  },
                  socialButtons: {
                    marginBottom: '1.5rem',
                  },
                  socialButtonsBlockButton: {
                    background: 'var(--bg)',
                    border: '2px solid var(--brand0)',
                    borderRadius: '12px',
                    color: 'var(--fg)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    padding: '0.875rem',
                    transition: 'all 0.2s ease',
                    marginBottom: '1rem',
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
                    marginTop: '1.5rem',
                    marginBottom: '1.5rem',
                  },
                  formButtonPrimary: {
                    background: 'linear-gradient(135deg, #00d1ff, #4a90e2)',
                    border: 'none',
                    borderRadius: '999px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    padding: '0.75rem 1.5rem',
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                  },
                  formButtonPrimary__hover: {
                    transform: 'translateY(-1px)',
                    filter: 'brightness(1.1)',
                  },
                  formFieldInput: {
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    color: 'var(--fg)',
                    padding: '0.75rem',
                    fontSize: '1rem',
                  },
                  formFieldInput__focus: {
                    borderColor: 'var(--brand0)',
                    boxShadow: '0 0 0 3px rgba(0, 209, 255, 0.1)',
                  },
                  footerActionLink: {
                    color: 'var(--brand0)',
                    textDecoration: 'none',
                    fontWeight: '500',
                  },
                  footerActionLink__hover: {
                    textDecoration: 'underline',
                  },
                  identityPreviewText: {
                    color: 'var(--fg)',
                  },
                  identityPreviewEditButton: {
                    color: 'var(--brand0)',
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
                  },
                  formFieldAction: {
                    color: 'var(--brand0)',
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
                }
              }}
              redirectUrl={redirectUrl}
              signUpUrl="/signup"
              afterSignInUrl={redirectUrl}
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

          {/* Additional links below the sign-in form */}
          <div style={{
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: 'var(--muted)', 
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                style={{ 
                  color: 'var(--brand0)', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign up
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

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}