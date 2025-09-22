"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Link from "next/link"
import SiteHeader from "@/components/SiteHeader"

interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  subscription_status: string
  subscription_plan: string
  created_at: string
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user, retryCount])

  const fetchUserProfile = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      if (!supabaseUrl || !supabaseAnonKey) {
        setError("Supabase configuration missing. Please check environment variables.")
        setLoading(false)
        return
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: allProfiles, error: listError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("clerk_user_id", user?.id)

      if (listError) {
        console.error("Supabase query error:", listError)
        
        // If it's a network or configuration error
        if (listError.message.includes('fetch') || listError.message.includes('CORS')) {
          setError("Unable to connect to database. Please check your Supabase configuration.")
        } else {
          setError(`Database error: ${listError.message}`)
        }
        
        // Auto-retry for new users (webhook might be processing)
        if (retryCount < 3 && !allProfiles?.length) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000)
        }
        return
      }

      if (!allProfiles || allProfiles.length === 0) {
        // For new users, the webhook might still be processing
        if (retryCount < 3) {
          setError("Setting up your profile... Please wait.")
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000)
        } else {
          // After retries, create a basic profile locally
          const basicProfile: UserProfile = {
            id: `temp-${user?.id}`,
            clerk_user_id: user?.id || '',
            email: user?.emailAddresses[0]?.emailAddress || '',
            first_name: user?.firstName || undefined,
            last_name: user?.lastName || undefined,
            subscription_status: 'basic',
            subscription_plan: 'basic',
            created_at: new Date().toISOString()
          }
          setUserProfile(basicProfile)
          setError(null)
        }
        return
      }

      setUserProfile(allProfiles[0])
      setError(null)
    } catch (err) {
      console.error("Unexpected error:", err)
      setError(`Failed to load profile: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRetryCount(0)
    fetchUserProfile()
  }

  const handleLaunchApp = () => {
    const userData = {
      clerk_user_id: user?.id,
      subscription_status: userProfile?.subscription_status || "basic",
      subscription_plan: userProfile?.subscription_plan || "basic",
      email: user?.emailAddresses[0]?.emailAddress,
      first_name: user?.firstName,
      last_name: user?.lastName
    };
    
    localStorage.setItem("scansnap_user_data", JSON.stringify(userData));
    window.open("https://app.scansnap.io", "_blank");
  }

  const getSubscriptionDisplayName = (status: string): string => {
    switch (status) {
      case 'basic': return 'Basic (Free)';
      case 'plus': return 'Plus';
      case 'pro': return 'Pro';
      case 'pro_dpms': return 'Pro + DPMS';
      case 'cancelled': return 'Cancelled';
      case 'expired': return 'Expired';
      default: return status;
    }
  }

  if (!isLoaded || (loading && retryCount < 3)) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
        <SiteHeader />
        <div style={{ 
          minHeight: 'calc(100vh - 80px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '3px solid var(--brand0)', 
              borderTop: '3px solid transparent', 
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>{retryCount > 0 ? 'Setting up your profile...' : 'Loading dashboard...'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
        <SiteHeader />
        <div style={{ 
          minHeight: 'calc(100vh - 80px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Please sign in</h1>
            <Link href="/" className="btn primary">Go Home</Link>
          </div>
        </div>
      </div>
    )
  }

  // If we have an error but can still show basic functionality
  if (error && !userProfile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
        <SiteHeader />
        <div style={{ 
          minHeight: 'calc(100vh - 80px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <div className="card">
              <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Dashboard</h1>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                User profile not found. Please wait a moment and refresh.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={handleRetry} className="btn primary">
                  Retry
                </button>
                <button onClick={handleLaunchApp} className="btn">
                  Launch App Anyway
                </button>
                <Link href="/" className="btn">Go Home</Link>
              </div>
              
              {/* Show basic user info even without profile */}
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--card)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                  Signed in as: <strong>{user.emailAddresses[0]?.emailAddress}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal dashboard display
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <SiteHeader />

      <main className="container section">
        
        {/* Welcome Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Welcome back, {user.firstName || 'there'}!
          </h1>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>
            Your ScanSnap account is ready to go. Launch the app to start scanning.
          </p>
          <button onClick={handleLaunchApp} className="btn primary" style={{ fontSize: '1.125rem' }}>
            🚀 Launch ScanSnap App
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid cols-3" style={{ marginBottom: '2rem' }}>
          
          {/* Current Plan */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                background: (userProfile?.subscription_status || 'basic') === 'basic' ? 'var(--muted)' : 'var(--brand0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (userProfile?.subscription_status || 'basic') === 'basic' ? 'var(--bg)' : '#fff',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {(userProfile?.subscription_status || 'basic') === 'basic' ? '○' : '✓'}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Current Plan</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {getSubscriptionDisplayName(userProfile?.subscription_status || 'basic')}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                background: 'var(--brand1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                👤
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Account Status</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>Active</div>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                background: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                📅
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Member Since</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {userProfile ? new Date(userProfile.created_at).toLocaleDateString() : 'Today'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
          <div className="grid cols-2" style={{ gap: '1rem' }}>
            <button onClick={handleLaunchApp} className="btn primary block">
              🚀 Launch App
            </button>
            <Link href="/subscription" className="btn block">
              ⚡ Manage Subscription
            </Link>
            <Link href="/purchases" className="btn block">
              📄 View Purchases
            </Link>
            <Link href="/#pricing" className="btn block">
              💎 View Plans
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