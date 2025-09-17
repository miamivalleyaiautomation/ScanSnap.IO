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
  subscription_expires_at?: string
  created_at: string
}

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$0',
    interval: 'forever',
    description: 'Essential barcode scanning',
    features: [
      'Scan standard barcodes',
      'Manual barcode entry', 
      'Export to PDF, CSV, Excel',
      'Single user'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_BASIC'
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$9.99',
    interval: 'month',
    description: 'Verification and order building',
    features: [
      'Everything in Basic',
      'Verify Mode: Import and verify delivery lists',
      'Order Builder: Upload catalogs, build orders',
      'Track quantities and discrepancies'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PLUS',
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro', 
    price: '$14.99',
    interval: 'month',
    description: 'Advanced code support',
    features: [
      'Everything in Plus',
      'QR code scanning',
      'DataMatrix code scanning',
      'Ideal for modern packaging'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO'
  },
  {
    id: 'pro_dpms',
    name: 'Pro + DPMS',
    price: '$49.99', 
    interval: 'month',
    description: 'Specialized algorithms for industrial codes',
    features: [
      'Everything in Pro',
      'Dot-peen marked codes',
      'Laser-etched difficult marks',
      'Custom scanning algorithms'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO_DPMS'
  }
]

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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
      
      const { data: allProfiles, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("clerk_user_id", user?.id)

      if (!error && allProfiles && allProfiles.length > 0) {
        setUserProfile(allProfiles[0])
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = (plan: typeof PLANS[0]) => {
    if (!user) {
      alert('Please sign in to upgrade')
      return
    }

    if (plan.id === 'basic') {
      alert('You are already on the Basic plan')
      return
    }

    const variantId = process.env[plan.variantEnv as keyof typeof process.env]
    if (!variantId) {
      alert('Checkout not configured for this plan')
      return
    }

    const checkoutUrl = `https://app.lemonsqueezy.com/checkout/buy/${variantId}?` + 
      new URLSearchParams({
        'checkout[email]': user.emailAddresses[0].emailAddress,
        'checkout[custom][clerk_user_id]': user.id,
        'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }).toString()

    window.open(checkoutUrl, '_blank')
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
          <p>Loading subscription...</p>
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
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              Subscription
            </span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/dashboard" className="link">
              ← Back to Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="container section">
        
        {/* Current Plan Status */}
        {userProfile && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Current Plan
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {getSubscriptionDisplayName(userProfile.subscription_status)}
                </h3>
                <p className="muted" style={{ marginBottom: '0.5rem' }}>
                  Status: <span style={{ textTransform: 'capitalize' }}>{userProfile.subscription_status}</span>
                </p>
                {userProfile.subscription_expires_at && (
                  <p className="muted">
                    {userProfile.subscription_status === 'cancelled' ? 'Expires' : 'Renews'}: {' '}
                    {new Date(userProfile.subscription_expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              {userProfile.subscription_status !== 'basic' && (
                <div style={{ textAlign: 'right' }}>
                  <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Manage your subscription directly with Lemon Squeezy
                  </p>
                  <a
                    href="https://app.lemonsqueezy.com/my-orders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: '#ffd700', color: '#000' }}
                  >
                    Manage Subscription
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Plans */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            Choose Your Plan
          </h2>
          <div className="grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="card"
                style={{
                  position: 'relative',
                  border: plan.popular 
                    ? '2px solid var(--brand0)' 
                    : userProfile?.subscription_status === plan.id
                    ? '2px solid #10b981'
                    : '1px solid var(--line)',
                  background: 'var(--card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--brand0)',
                    color: '#fff',
                    padding: '4px 16px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Most Popular
                  </div>
                )}
                
                {userProfile?.subscription_status === plan.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '16px',
                    background: '#10b981',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Current
                  </div>
                )}
                
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {plan.name}
                  </h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                      {plan.price}
                    </span>
                    {plan.interval !== 'forever' && (
                      <span className="muted">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  <p className="muted" style={{ marginBottom: '1.5rem' }}>
                    {plan.description}
                  </p>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <span style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }}>✓</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {userProfile?.subscription_status === plan.id ? (
                  <button
                    disabled
                    className="btn block"
                    style={{ 
                      opacity: 0.5,
                      cursor: 'not-allowed',
                      background: 'var(--muted)',
                      color: 'var(--bg)'
                    }}
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan)}
                    className="btn block"
                    style={{
                      background: plan.popular 
                        ? 'var(--brand-grad)' 
                        : 'var(--card)',
                      border: plan.popular 
                        ? 'none' 
                        : '1px solid var(--line)',
                      color: plan.popular 
                        ? '#fff' 
                        : 'var(--fg)'
                    }}
                  >
                    {plan.id === 'basic' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid var(--brand0)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--brand0)' }}>
            Need Help?
          </h3>
          <p className="muted" style={{ marginBottom: '1rem' }}>
            Have questions about which plan is right for you? Contact our sales team for personalized recommendations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="mailto:hello@scansnap.io"
              className="btn"
              style={{ background: 'var(--brand0)', color: '#fff' }}
            >
              Contact Sales
            </a>
            <Link
              href="/purchases"
              className="btn primary"
            >
              View Purchase History
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