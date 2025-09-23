// app/debug-env/page.tsx
"use client"

import { useEffect, useState } from "react"
import SiteHeader from "@/components/SiteHeader"

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Collect all NEXT_PUBLIC environment variables
    const publicEnvVars: Record<string, string> = {}
    
    // Explicitly check for our Lemon Squeezy variables
    const lsVars = {
      'NEXT_PUBLIC_LS_VARIANT_BASIC': process.env.NEXT_PUBLIC_LS_VARIANT_BASIC,
      'NEXT_PUBLIC_LS_VARIANT_PLUS': process.env.NEXT_PUBLIC_LS_VARIANT_PLUS,
      'NEXT_PUBLIC_LS_VARIANT_PRO': process.env.NEXT_PUBLIC_LS_VARIANT_PRO,
      'NEXT_PUBLIC_LS_VARIANT_PRO_DPMS': process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS,
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
      'NEXT_PUBLIC_PORTAL_URL': process.env.NEXT_PUBLIC_PORTAL_URL,
    }
    
    Object.entries(lsVars).forEach(([key, value]) => {
      publicEnvVars[key] = value || 'NOT SET'
    })
    
    setEnvVars(publicEnvVars)
  }, [])

  const testCheckout = (planName: string, variantEnv: string) => {
    const variantId = process.env[variantEnv as keyof typeof process.env]
    
    if (!variantId) {
      alert(`No variant ID found for ${planName}\nEnvironment variable ${variantEnv} is not set or not accessible`)
      return
    }
    
    alert(`${planName} variant ID found: ${variantId}\nWould open checkout URL: https://pay.scansnap.io/buy/${variantId}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <SiteHeader />
      
      <main className="container section">
        <h1 style={{ marginBottom: '2rem' }}>Environment Variables Debug</h1>
        
        {/* Environment Variables Status */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Client-Side Environment Variables</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--line)' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Variable Name</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Value</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(envVars).map(([key, value]) => (
                  <tr key={key} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '8px' }}>{key}</td>
                    <td style={{ 
                      padding: '8px',
                      color: value === 'NOT SET' ? '#ef4444' : 'var(--brand0)',
                      wordBreak: 'break-all',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {value === 'NOT SET' ? 'NOT SET' : value.substring(0, 20) + '...'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {value === 'NOT SET' ? '❌' : '✅'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Test Checkout Access</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button 
              onClick={() => testCheckout('Plus', 'NEXT_PUBLIC_LS_VARIANT_PLUS')}
              className="btn primary"
            >
              Test Plus Variant
            </button>
            <button 
              onClick={() => testCheckout('Pro', 'NEXT_PUBLIC_LS_VARIANT_PRO')}
              className="btn primary"
            >
              Test Pro Variant
            </button>
            <button 
              onClick={() => testCheckout('Pro + DPMS', 'NEXT_PUBLIC_LS_VARIANT_PRO_DPMS')}
              className="btn primary"
            >
              Test Pro + DPMS Variant
            </button>
          </div>
        </div>

        {/* Netlify-Specific Info */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Netlify Configuration</h2>
          <div style={{ padding: '1rem', background: 'var(--card)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Required Steps:</h3>
            <ol style={{ marginLeft: '1.5rem' }}>
              <li>Go to Netlify Dashboard → Site Settings → Environment Variables</li>
              <li>Ensure all variables are prefixed with <code>NEXT_PUBLIC_</code></li>
              <li>After adding/updating variables, trigger a new deploy</li>
              <li>Variables must be available at build time for Next.js</li>
            </ol>
            
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Common Issues:</h3>
            <ul style={{ marginLeft: '1.5rem' }}>
              <li>Variables added after deployment won't work until redeployed</li>
              <li>Variables without <code>NEXT_PUBLIC_</code> prefix won't be available client-side</li>
              <li>Check the "Deploy settings" tab to verify variables are set for production</li>
            </ul>
          </div>
        </div>

        {/* Direct Process.env Test */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand0)' }}>Direct Access Test</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px' }}>
            <p>NEXT_PUBLIC_LS_VARIANT_PLUS = {process.env.NEXT_PUBLIC_LS_VARIANT_PLUS || 'undefined'}</p>
            <p>NEXT_PUBLIC_LS_VARIANT_PRO = {process.env.NEXT_PUBLIC_LS_VARIANT_PRO || 'undefined'}</p>
            <p>NEXT_PUBLIC_LS_VARIANT_PRO_DPMS = {process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS || 'undefined'}</p>
          </div>
        </div>
      </main>
    </div>
  )
}