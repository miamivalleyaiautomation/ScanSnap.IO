"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Link from "next/link"
import SiteHeader from "@/components/SiteHeader"

interface Purchase {
  id: string
  user_id: string
  lemon_squeezy_order_id: string
  product_name: string
  variant_name?: string
  amount: number
  currency: string
  status: string
  purchase_date: string
}

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

export default function PurchasesPage() {
  const { user, isLoaded } = useUser()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchData()
    }
  }, [isLoaded, user])

  const fetchData = async () => {
  try {
    // First, get the user profile via API
    const profileResponse = await fetch('/api/user/profile')
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch profile')
    }
    
    const { profile } = await profileResponse.json()
    
    if (profile) {
      setUserProfile(profile)
      
      // Now fetch purchases using the profile ID
      const { createClient } = await import("@supabase/supabase-js")
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", profile.id)
        .order("purchase_date", { ascending: false })

      if (!purchaseError) {
        setPurchases(purchaseData || [])
        console.log('Purchases loaded:', purchaseData?.length || 0)
      } else {
        console.error('Error fetching purchases:', purchaseError)
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    setLoading(false)
  }
}
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return { bg: '#dcfce7', color: '#166534' }
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e' }
      case 'refunded':
        return { bg: '#fee2e2', color: '#991b1b' }
      case 'cancelled':
        return { bg: '#f3f4f6', color: '#374151' }
      default:
        return { bg: '#f3f4f6', color: '#374151' }
    }
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
            <p>Loading purchases...</p>
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <SiteHeader />

      <main className="container section">
        
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Purchase History</h1>
          <p className="muted">
            View all your ScanSnap subscription purchases and transactions
          </p>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/subscription" className="btn primary">
              Manage Subscription
            </Link>
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ background: '#ffd700', color: '#000' }}
            >
              Lemon Squeezy Portal
            </a>
            <Link href="/#pricing" className="btn">
              View Plans
            </Link>
          </div>
        </div>

        {/* Purchases Table */}
        <div className="card">
          <div style={{ 
            padding: '1.5rem 1.5rem 1rem 1.5rem',
            borderBottom: '1px solid var(--line)'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              All Purchases ({purchases.length})
            </h2>
          </div>
          
          {purchases.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                margin: '0 auto 1rem',
                color: 'var(--muted)',
                fontSize: '2rem'
              }}>
                📄
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No purchases yet</h3>
              <p className="muted" style={{ marginBottom: '1.5rem' }}>
                When you upgrade your plan, your purchases will appear here.
              </p>
              <Link href="/subscription" className="btn primary">
                Choose a Plan
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--card)', borderBottom: '1px solid var(--line)' }}>
                  <tr>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Product
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Amount
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Date
                    </th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Order ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((purchase) => {
                    const statusStyles = getStatusColor(purchase.status)
                    return (
                      <tr key={purchase.id} style={{ borderBottom: '1px solid var(--line)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px' }}>
                              {purchase.product_name}
                            </div>
                            {purchase.variant_name && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                {purchase.variant_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>
                          {formatAmount(purchase.amount, purchase.currency)}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: statusStyles.bg,
                            color: statusStyles.color
                          }}>
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                          {formatDate(purchase.purchase_date)}
                        </td>
                        <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--muted)' }}>
                          #{purchase.lemon_squeezy_order_id.slice(-8)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid var(--brand0)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--brand0)' }}>
            Need Help with a Purchase?
          </h3>
          <p className="muted" style={{ marginBottom: '1rem' }}>
            If you have questions about a specific purchase or need to request a refund, please contact our support team or access your Lemon Squeezy account directly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="mailto:hello@scansnap.io?subject=Purchase Support"
              className="btn"
              style={{ background: 'var(--brand0)', color: '#fff' }}
            >
              Contact Support
            </a>
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="btn primary"
            >
              Lemon Squeezy Account
            </a>
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