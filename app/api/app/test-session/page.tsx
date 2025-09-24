// app/test-session/page.tsx
"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import SiteHeader from "@/components/SiteHeader"

export default function TestSessionPage() {
  const { user, isLoaded } = useUser()
  const [sessionToken, setSessionToken] = useState<string>("")
  const [sessionData, setSessionData] = useState<any>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  
  const createSession = async () => {
    console.log('🧪 TEST: Creating session...')
    
    try {
      const response = await fetch('/api/app/session/create', {
        method: 'POST'
      })
      
      const data = await response.json()
      console.log('🧪 TEST: Session created:', data)
      
      if (data.sessionToken) {
        setSessionToken(data.sessionToken)
        setSessionData(data)
      }
    } catch (error) {
      console.error('🧪 TEST: Error:', error)
    }
  }
  
  const validateSession = async () => {
    console.log('🧪 TEST: Validating session...')
    
    try {
      const response = await fetch('/api/app/session/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionToken })
      })
      
      const data = await response.json()
      console.log('🧪 TEST: Validation result:', data)
      setValidationResult(data)
    } catch (error) {
      console.error('🧪 TEST: Validation error:', error)
    }
  }
  
  const checkActiveSessions = async () => {
    try {
      const response = await fetch('/api/app/session/create')
      const data = await response.json()
      console.log('🧪 TEST: Active sessions:', data)
      alert(`Active sessions: ${data.activeSessionCount}`)
    } catch (error) {
      console.error('🧪 TEST: Error checking sessions:', error)
    }
  }
  
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <SiteHeader />
      
      <main className="container section">
        <h1>Session Integration Test</h1>
        
        {/* User Info */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Current User</h2>
          {user ? (
            <>
              <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
              <p>ID: {user.id}</p>
            </>
          ) : (
            <p>Not signed in</p>
          )}
        </div>
        
        {/* Session Creation */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>1. Create Session</h2>
          <button onClick={createSession} className="btn primary">
            Create New Session
          </button>
          
          {sessionData && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px' }}>
              <pre>{JSON.stringify(sessionData, null, 2)}</pre>
            </div>
          )}
        </div>
        
        {/* Session Validation */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>2. Validate Session</h2>
          <input
            type="text"
            value={sessionToken}
            onChange={(e) => setSessionToken(e.target.value)}
            placeholder="Enter session token"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              color: 'var(--fg)'
            }}
          />
          <button onClick={validateSession} className="btn primary" disabled={!sessionToken}>
            Validate Session
          </button>
          
          {validationResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px' }}>
              <pre>{JSON.stringify(validationResult, null, 2)}</pre>
            </div>
          )}
        </div>
        
        {/* Test Launch */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>3. Test App Launch</h2>
          {sessionToken && (
            <>
              <p>App URL with session:</p>
              <code style={{ display: 'block', padding: '1rem', background: 'var(--bg)', borderRadius: '4px', wordBreak: 'break-all' }}>
                {process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io'}?session={sessionToken}
              </code>
              <button 
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_APP_URL || 'https://app.scansnap.io'}?session=${sessionToken}`, '_blank')}
                className="btn primary"
                style={{ marginTop: '1rem' }}
              >
                Launch App with Session
              </button>
            </>
          )}
        </div>
        
        {/* Debug Actions */}
        <div className="card">
          <h2>Debug Actions</h2>
          <button onClick={checkActiveSessions} className="btn">
            Check Active Sessions
          </button>
          <button onClick={() => window.location.reload()} className="btn" style={{ marginLeft: '1rem' }}>
            Refresh Page
          </button>
        </div>
      </main>
    </div>
  )
}