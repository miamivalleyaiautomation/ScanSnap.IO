// components/LoginButton.tsx
'use client'

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { useState, useEffect, useRef } from "react"

export default function LoginButton({ className = "", isMobile = false }: { className?: string, isMobile?: boolean }) {
  const { isSignedIn } = useUser()
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Don't show login if user is already signed in
  if (isSignedIn) {
    return null
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false)
      }
    }

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModal])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  return (
    <>
      <button 
        className={isMobile ? `menu-link ${className}` : `chip primary ${className}`}
        onClick={() => setShowModal(true)}
        style={isMobile ? { 
          background: 'var(--brand-grad)', 
          color: '#fff',
          fontWeight: '600',
          textAlign: 'center'
        } : {}}
      >
        Login
      </button>

      {showModal && (
        <>
          {/* Backdrop */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
              animation: 'fadeIn 0.2s ease'
            }}
          />
          
          {/* Modal */}
          <div 
            ref={modalRef}
            style={{
              position: 'fixed',
              top: '120px',  // Fixed distance from top instead of centering
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              padding: '2rem',
              minWidth: '320px',
              maxWidth: '400px',
              width: '90vw',
              zIndex: 9999,
              animation: 'slideIn 0.3s ease',
              maxHeight: 'calc(100vh - 140px)',  // Ensure it doesn't go off screen
              overflowY: 'auto'  // Add scroll if needed on small screens
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem',
                lineHeight: 1,
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fg)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted)'}
              aria-label="Close"
            >
              ×
            </button>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: 'var(--fg)'
              }}>
                Welcome to ScanSnap
              </h2>
              <p style={{ 
                color: 'var(--muted)', 
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                Sign in to access your account or create a new one
              </p>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                marginBottom: '1.5rem'
              }}>
                <SignInButton mode="modal">
                  <button style={{
                    width: '100%',
                    background: 'var(--brand-grad)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, filter 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.filter = 'brightness(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.filter = 'brightness(1)'
                  }}>
                    Sign In to Your Account
                  </button>
                </SignInButton>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  margin: '0.5rem 0'
                }}>
                  <div style={{ 
                    flex: 1, 
                    height: '1px', 
                    background: 'var(--line)' 
                  }} />
                  <span style={{ 
                    color: 'var(--muted)', 
                    fontSize: '0.875rem' 
                  }}>or</span>
                  <div style={{ 
                    flex: 1, 
                    height: '1px', 
                    background: 'var(--line)' 
                  }} />
                </div>

                <SignUpButton mode="modal">
                  <button style={{
                    width: '100%',
                    background: 'transparent',
                    color: 'var(--fg)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--brand0)'
                    e.currentTarget.style.background = 'rgba(0, 209, 255, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--line)'
                    e.currentTarget.style.background = 'transparent'
                  }}>
                    Create New Account
                  </button>
                </SignUpButton>
              </div>
              
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--muted)',
                lineHeight: '1.5'
              }}>
                By continuing, you agree to our{' '}
                <a href="#" style={{ 
                  color: 'var(--brand0)', 
                  textDecoration: 'none' 
                }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" style={{ 
                  color: 'var(--brand0)', 
                  textDecoration: 'none' 
                }}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  )
}