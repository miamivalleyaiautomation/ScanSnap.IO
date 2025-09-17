"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

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

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user])

  const fetchUserProfile = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: allProfiles, error: listError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("clerk_user_id", user?.id)

      if (listError) {
        setError(`Query error: ${listError.message}`)
        return
      }

      if (!allProfiles || allProfiles.length === 0) {
        setError("User profile not found. Please wait a moment and refresh.")
        return
      }

      setUserProfile(allProfiles[0])
    } catch (err) {
      setError(`Failed to load profile: ${err}`)
    } finally {
      setLoading(false)
    }
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

  if (!isLoaded || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--fg)'
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
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--fg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Please sign in</h1>
          <Link href="/" className="btn primary">Go Home</Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--fg)'
      }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <div className="card">
            <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Dashboard</h1>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => window.location.reload()} className="btn primary">
                Retry
              </button>
              <Link href="/" className="btn">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Header */}
      <header style={{ 
        background: 'var(--card)', 
        borderBottom: '1px solid var(--line)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          height: '64px'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              ScanSnap Dashboard
            </span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
              {user.firstName || user.emailAddresses[0].emailAddress}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
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
        {userProfile && (
          <div className="grid cols-3" style={{ marginBottom: '2rem' }}>
            
            {/* Current Plan */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%',
                  background: userProfile.subscription_status === 'basic' ? 'var(--muted)' : 'var(--brand0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: userProfile.subscription_status === 'basic' ? 'var(--bg)' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {userProfile.subscription_status === 'basic' ? '○' : '✓'}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Current Plan</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                    {getSubscriptionDisplayName(userProfile.subscription_status)}
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
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
              💎 Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Upgrade Prompt for Basic Users */}
        {userProfile?.subscription_status === 'basic' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
            border: '1px solid var(--brand0)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                color: 'var(--brand0)',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                💡
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--brand0)' }}>
                  Unlock More Features
                </h3>
                <p className="muted" style={{ marginBottom: '1rem' }}>
                  You're on the Basic plan. Upgrade to Plus or Pro to unlock catalog import, verify mode, order builder, and advanced scanning features.
                </p>
                <Link href="/#pricing" className="btn primary">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        )}
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