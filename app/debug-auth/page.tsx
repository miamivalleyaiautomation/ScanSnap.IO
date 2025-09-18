// app/debug-auth/page.tsx
"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import { useState } from "react"

export default function DebugAuthPage() {
  const { isLoaded, userId, sessionId } = useAuth()
  const clerk = useClerk()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleManualSignIn = async () => {
    if (!clerk) return
    
    setLoading(true)
    setError("")
    
    try {
      const result = await clerk.client.signIn.create({
        identifier: email,
        password: password,
      })
      
      if (result.status === "complete") {
        await clerk.setActive({ session: result.createdSessionId })
        window.location.href = "/dashboard"
      } else {
        setError(`Sign in incomplete: ${result.status}`)
      }
    } catch (err: any) {
      setError(err.message || "Sign in failed")
      console.error("Sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)', 
      color: 'var(--fg)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Authentication Debug Page</h1>
        
        <div style={{ 
          background: 'var(--card)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid var(--line)'
        }}>
          <h2>Current Auth Status</h2>
          <p>Loaded: {isLoaded ? "Yes" : "No"}</p>
          <p>User ID: {userId || "Not signed in"}</p>
          <p>Session ID: {sessionId || "No session"}</p>
        </div>

        <div style={{ 
          background: 'var(--card)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid var(--line)'
        }}>
          <h2>Manual Email Sign In Test</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                color: 'var(--fg)',
                marginBottom: '0.5rem'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: '4px',
                color: 'var(--fg)'
              }}
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#ef4444', 
              marginBottom: '1rem',
              padding: '0.5rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <button
            onClick={handleManualSignIn}
            disabled={loading || !email || !password}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? 'var(--muted)' : 'var(--brand0)',
              color: loading ? 'var(--bg)' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? "Signing in..." : "Test Sign In"}
          </button>
        </div>

        <div style={{ 
          background: 'var(--card)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          border: '1px solid var(--line)'
        }}>
          <h2>Environment Check</h2>
          <p style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
            Sign In URL: {process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "Not set"}
          </p>
          <p style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
            Sign Up URL: {process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "Not set"}
          </p>
          <p style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
            After Sign In: {process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "Not set"}
          </p>
          <p style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
            Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✓ Set" : "✗ Not set"}
          </p>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a href="/login" style={{ color: 'var(--brand0)', marginRight: '1rem' }}>Go to Login</a>
          <a href="/" style={{ color: 'var(--brand0)' }}>Go Home</a>
        </div>
      </div>
    </div>
  )
}