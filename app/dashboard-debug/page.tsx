// app/dashboard-debug/page.tsx
// Create this temporary debug page to check your configuration

"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import SiteHeader from "@/components/SiteHeader"

export default function DashboardDebug() {
  const { user, isLoaded } = useUser()
  const [supabaseStatus, setSupabaseStatus] = useState<any>({})
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    if (isLoaded && user) {
      checkConfiguration()
    }
  }, [isLoaded, user])

  const checkConfiguration = async () => {
    const status: any = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      clerkUser: user ? '✅ Loaded' : '❌ Not loaded',
      userId: user?.id || 'N/A'
    }

    // Test Supabase connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )
        
        // Try to query the profiles table
        const { data, error, count } = await supabase
          .from("user_profiles")
          .select("*", { count: 'exact' })
          .eq("clerk_user_id", user?.id)

        if (error) {
          status.supabaseConnection = `❌ Error: ${error.message}`
          status.errorCode = error.code
          status.errorDetails = error.details
        } else {
          status.supabaseConnection = '✅ Connected'
          status.profilesFound = count || 0
          setProfileData(data)
        }
      } catch (e: any) {
        status.supabaseConnection = `❌ Exception: ${e.message}`
      }
    } else {
      status.supabaseConnection = '❌ Cannot connect - missing config'
    }

    setSupabaseStatus(status)
  }

  const createProfileManually = async () => {
    if (!user) return

    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from("user_profiles")
        .insert({
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
          subscription_status: 'basic',
          subscription_plan: 'basic',
          app_preferences: {},
          onboarding_completed: false,
        })
        .select()

      if (error) {
        alert(`Error creating profile: ${error.message}`)
      } else {
        alert('Profile created successfully!')
        checkConfiguration() // Refresh
      }
    } catch (e: any) {
      alert(`Exception: ${e.message}`)
    }
  }

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
        <SiteHeader />
        <div className="container section">
          <h1>Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <SiteHeader />
      
      <main className="container section">
        <h1 style={{ marginBottom: '2rem' }}>Dashboard Debug Information</h1>
        
        {/* Clerk User Info */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Clerk Authentication</h2>
          <pre style={{ 
            background: 'var(--bg)', 
            padding: '1rem', 
            borderRadius: '8px',
            overflow: 'auto'
          }}>
            {JSON.stringify({
              isSignedIn: !!user,
              userId: user?.id,
              email: user?.emailAddresses[0]?.emailAddress,
              firstName: user?.firstName,
              lastName: user?.lastName,
            }, null, 2)}
          </pre>
        </div>

        {/* Supabase Configuration */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Supabase Configuration</h2>
          <div style={{ marginBottom: '1rem' }}>
            {Object.entries(supabaseStatus).map(([key, value]) => (
              <div key={key} style={{ 
                padding: '0.5rem 0', 
                borderBottom: '1px solid var(--line)' 
              }}>
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}
          </div>
          
          {supabaseStatus.profilesFound === 0 && supabaseStatus.supabaseConnection === '✅ Connected' && (
            <button 
              onClick={createProfileManually}
              className="btn primary"
              style={{ marginTop: '1rem' }}
            >
              Create Profile Manually
            </button>
          )}
        </div>

        {/* Profile Data */}
        {profileData && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Profile Data</h2>
            <pre style={{ 
              background: 'var(--bg)', 
              padding: '1rem', 
              borderRadius: '8px',
              overflow: 'auto'
            }}>
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        )}

        {/* Environment Variables */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Environment Variables</h2>
          <div style={{ fontSize: '0.875rem' }}>
            <p>🔹 NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p>🔹 NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p>🔹 NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
            <p>🔹 NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'Using default'}</p>
            <p>🔹 NEXT_PUBLIC_PORTAL_URL: {process.env.NEXT_PUBLIC_PORTAL_URL || 'Using default'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => checkConfiguration()} className="btn">
              Refresh Status
            </button>
            <button onClick={() => window.location.href = '/dashboard'} className="btn primary">
              Go to Regular Dashboard
            </button>
            <button onClick={() => window.location.href = '/'} className="btn">
              Go Home
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}