// app/test-checkout/page.tsx
"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import SiteHeader from "@/components/SiteHeader"

export default function TestCheckoutPage() {
  const { user, isLoaded } = useUser()
  const [checkoutUrl, setCheckoutUrl] = useState<string>("")

  const plans = [
    {
      name: 'Plus',
      price: '$9.99/month',
      variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PLUS',
      variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PLUS,
      color: '#10b981'
    },
    {
      name: 'Pro',
      price: '$14.99/month',
      variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO',
      variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO,
      color: '#3b82f6'
    },
    {
      name: 'Pro + DPMS',
      price: '$49.99/month',
      variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO_DPMS',
      variantId: process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS,
      color: '#8b5cf6'
    }
  ]

  const generateCheckoutUrl = (variantId: string, planName: string) => {
    if (!user) {
      alert('Please sign in first')
      return
    }

    if (!variantId) {
      alert(`Variant ID not configured for ${planName}`)
      return
    }

    // Generate checkout URL with user data
    const baseUrl = `https://pay.scansnap.io/buy/${variantId}`
    const params = new URLSearchParams({
      'checkout[email]': user.emailAddresses[0].emailAddress,
      'checkout[custom][clerk_user_id]': user.id,
      'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
    })
    
    const fullUrl = `${baseUrl}?${params.toString()}`
    setCheckoutUrl(fullUrl)
    
    return fullUrl
  }

  const handleTestCheckout = (plan: typeof plans[0]) => {
    const url = generateCheckoutUrl(plan.variantId || '', plan.name)
    if (url) {
      console.log('Opening checkout:', url)
      window.open(url, '_blank')
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
        <h1 style={{ marginBottom: '2rem' }}>Lemon Squeezy Checkout Test</h1>
        
        {/* User Info */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Current User</h2>
          {user ? (
            <div>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p>Not signed in</p>
          )}
        </div>

        {/* Environment Variables Status */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Lemon Squeezy Configuration</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{ 
                padding: '0.75rem', 
                marginBottom: '0.5rem',
                background: 'var(--bg)',
                borderRadius: '8px',
                border: `1px solid ${plan.variantId ? 'var(--brand0)' : '#ef4444'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: plan.color }}>{plan.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                      {plan.variantEnv}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {plan.variantId ? (
                      <span style={{ color: 'var(--brand0)' }}>
                        ✅ {plan.variantId}
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>
                        ❌ Not configured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Checkout Buttons */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Test Checkout</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--muted)' }}>
            Click a plan to test the checkout process. This will open Lemon Squeezy in a new tab.
          </p>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1rem',
                background: 'var(--bg)',
                borderRadius: '8px',
                border: '1px solid var(--line)'
              }}>
                <div>
                  <strong style={{ fontSize: '1.125rem' }}>{plan.name}</strong>
                  <div style={{ color: 'var(--muted)' }}>{plan.price}</div>
                </div>
                <button
                  onClick={() => handleTestCheckout(plan)}
                  disabled={!plan.variantId || !user}
                  className="btn primary"
                  style={{
                    background: plan.variantId ? plan.color : 'var(--muted)',
                    opacity: plan.variantId && user ? 1 : 0.5,
                    cursor: plan.variantId && user ? 'pointer' : 'not-allowed'
                  }}
                >
                  {plan.variantId ? 'Test Checkout' : 'Not Configured'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Generated URL Display */}
        {checkoutUrl && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Last Generated URL</h2>
            <div style={{ 
              padding: '1rem',
              background: 'var(--bg)',
              borderRadius: '8px',
              fontSize: '0.75rem',
              wordBreak: 'break-all',
              fontFamily: 'monospace'
            }}>
              {checkoutUrl}
            </div>
          </div>
        )}

        {/* Webhook Info */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Webhook Setup</h2>
          <p style={{ marginBottom: '1rem' }}>
            After testing checkout, make sure your webhook is configured in Lemon Squeezy:
          </p>
          <div style={{
            padding: '1rem',
            background: 'var(--bg)',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>
            <p><strong>Webhook URL:</strong></p>
            <p style={{ color: 'var(--brand0)' }}>https://scansnap.io/api/webhooks/lemonsqueezy</p>
            <br />
            <p><strong>Events to subscribe:</strong></p>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>subscription_created</li>
              <li>subscription_updated</li>
              <li>subscription_cancelled</li>
              <li>subscription_resumed</li>
              <li>subscription_expired</li>
              <li>subscription_payment_success</li>
              <li>order_created</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}