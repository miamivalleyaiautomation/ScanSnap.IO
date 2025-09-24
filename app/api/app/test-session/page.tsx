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
          <button onClick={createSession} class