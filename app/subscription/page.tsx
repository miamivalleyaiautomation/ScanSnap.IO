// app/subscription/page.tsx - COMPLETE FILE WITH CANCELLED COLUMN
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
  subscription_expires_at?: string
  subscription_cancelled_at?: string  // NEW FIELD
  created_at: string
}

// Static mapping of variant IDs - REQUIRED FOR PRODUCTION
const VARIANT_IDS = {
  basic: undefined,
  plus: process.env.NEXT_PUBLIC_LS_VARIANT_PLUS,
  pro: process.env.NEXT_PUBLIC_LS_VARIANT_PRO,
  pro_dpms: process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS,
} as const

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
    ]
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
    ]
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
    ]
  }
]

export default function SubscriptionPage() {
  const { user, isLoaded } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper function to get display name
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

  // Check if subscription is cancelled using the new column
  const isSubscriptionCancelled = (profile: UserProfile | null): boolean => {
    if (!profile) return false;
    
    // Check if cancelled_at is set and subscription hasn't expired yet
    return !!profile.subscription_cancelled_at && 
           profile.subscription_status !== 'basic' &&
           profile.subscription_status !== 'expired';
  }

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
      
      // Fetch profiles as array
      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("clerk_user_id", user?.id)

      if (!error && profiles && profiles.length > 0) {
        setUserProfile(profiles[0])
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
      // Basic is free - no checkout needed
      alert('Basic is our free plan. To downgrade to Basic, please cancel your current subscription through the Lemon Squeezy portal.')
      return
    }

    // Use static mapping instead of dynamic env access
    const variantId = VARIANT_IDS[plan.id as keyof typeof VARIANT_IDS]
    
    if (!variantId) {
      alert(`Checkout not configured for ${plan.name} plan. Please contact support.`)
      return
    }

    // Use the custom domain format
    const checkoutUrl = `https://pay.scansnap.io/buy/${variantId}?` + 
      new URLSearchParams({
        'checkout[email]': user.emailAddresses[0].emailAddress,
        'checkout[custom][clerk_user_id]': user.id,
        'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }).toString()

    console.log('Opening checkout for:', plan.name)
    console.log('Variant ID:', variantId)
    console.log('Checkout URL:', checkoutUrl)
    
    window.open(checkoutUrl, '_blank')
  }

  if (!isLoaded || loading) {
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
            <p>Loading subscription...</p>
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

  // Get actual status
  const currentStatus = userProfile?.subscription_status || 'basic'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <SiteHeader />

      <main className="container section">
        
        {/* Current Plan Status */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Current Plan
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {getSubscriptionDisplayName(currentStatus)}
                {isSubscriptionCancelled(userProfile) && (
                  <span style={{ 
                    marginLeft: '1rem', 
                    fontSize: '0.875rem', 
                    color: '#ef4444',
                    fontWeight: '500'
                  }}>
                    (Cancelled)
                  </span>
                )}
              </h3>
              <p className="muted" style={{ marginBottom: '0.5rem' }}>
                Status: <span style={{ 
                  textTransform: 'capitalize',
                  color: isSubscriptionCancelled(userProfile) ? '#ef4444' : 'inherit'
                }}>
                  {isSubscriptionCancelled(userProfile) ? 'Cancelled - Active until expiry' : currentStatus}
                </span>
              </p>
              {userProfile?.subscription_expires_at && currentStatus !== 'basic' && (
                <p className="muted">
                  {isSubscriptionCancelled(userProfile) ? 'Expires' : 'Renews'}: {' '}
                  {new Date(userProfile.subscription_expires_at).toLocaleDateString()}
                </p>
              )}
              {userProfile?.subscription_cancelled_at && (
                <p className="muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Cancelled on: {new Date(userProfile.subscription_cancelled_at).toLocaleDateString()}
                </p>
              )}
            </div>
            {currentStatus !== 'basic' && (
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
          {isSubscriptionCancelled(userProfile) && userProfile?.subscription_expires_at && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '0.5rem' }}>
                ⚠️ Your subscription has been cancelled
              </p>
              <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                You will continue to have access to {getSubscriptionDisplayName(currentStatus)} features until {new Date(userProfile.subscription_expires_at).toLocaleDateString()}. 
                After this date, your account will revert to the Basic plan.
              </p>
            </div>
          )}
        </div>

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
                    : currentStatus === plan.id
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
                
                {currentStatus === plan.id && !isSubscriptionCancelled(userProfile) && (
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
                
                {currentStatus === plan.id && isSubscriptionCancelled(userProfile) && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '16px',
                    background: '#ef4444',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Cancelled
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
                
                {currentStatus === plan.id ? (
                  <button
                    disabled
                    className="btn block"
                    style={{ 
                      opacity: 0.5,
                      cursor: 'not-allowed',
                      background: isSubscriptionCancelled(userProfile) ? '#ef4444' : 'var(--muted)',
                      color: isSubscriptionCancelled(userProfile) ? '#fff' : 'var(--bg)'
                    }}
                  >
                    {isSubscriptionCancelled(userProfile) ? 'Cancelled - Expires Soon' : 'Current Plan'}
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
                    {plan.id === 'basic' 
                      ? 'Cancel Subscription' 
                      : currentStatus === 'basic'
                        ? 'Upgrade' 
                        : Number(plan.price.replace(/[^0-9.]/g, '')) > Number(PLANS.find(p => p.id === currentStatus)?.price.replace(/[^0-9.]/g, '') || 0)
                          ? 'Upgrade'
                          : 'Change Plan'
                    }
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