// components/PricingSection.tsx - Simplified version
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// CRITICAL: Static mapping of variant IDs
const VARIANT_IDS = {
  basic: undefined, // Basic is free, no variant
  plus: process.env.NEXT_PUBLIC_LS_VARIANT_PLUS,
  pro: process.env.NEXT_PUBLIC_LS_VARIANT_PRO,
} as const

const PLANS = [
  {
    id: 'basic' as const,
    name: 'Basic',
    price: 'Free',
    interval: '',
    description: 'Get started with essential scanning.',
    features: [
      'Scan standard barcodes',
      'Manual barcode entry', 
      'Export to PDF, CSV, Excel',
      'Works offline'
    ]
  },
  {
    id: 'plus' as const,
    name: 'Plus',
    price: '$9.99',
    interval: '/ month',
    description: 'Add verification and order building.',
    features: [
      'Everything in Basic',
      'Verify Mode - Check against lists',
      'Order Builder - Build from catalogs',
      'Upload CSV/Excel files'
    ],
    popular: true
  },
  {
    id: 'pro' as const,
    name: 'Pro', 
    price: '$14.99',
    interval: '/ month',
    description: 'Advanced code support.',
    features: [
      'Everything in Plus',
      'QR code scanning',
      'DataMatrix scanning',
      'Priority support'
    ]
  }
];

export default function PricingSection() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handlePlanClick = (plan: typeof PLANS[0]) => {
    console.log('Plan clicked:', plan.name);
    
    if (!isSignedIn) {
      // Redirect to login
      router.push(`/login?redirect_url=/dashboard&plan=${plan.id}`);
      return;
    }

    if (plan.id === 'basic') {
      // Redirect to dashboard for free plan
      window.location.href = '/dashboard';
      return;
    }

    // Use static mapping
    const variantId = VARIANT_IDS[plan.id];
    
    if (!variantId) {
      console.error('No variant ID found for plan:', plan.id);
      alert(`This plan is not available for purchase yet. Please contact support.`);
      return;
    }

    // Build checkout URL
    const checkoutUrl = `https://pay.scansnap.io/buy/${variantId}?` + 
      new URLSearchParams({
        'checkout[email]': user.emailAddresses[0].emailAddress,
        'checkout[custom][clerk_user_id]': user.id,
        'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }).toString();

    console.log('Opening checkout URL:', checkoutUrl);
    window.open(checkoutUrl, '_blank');
  };

  if (!isLoaded) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading pricing...</div>
      </div>
    );
  }

  return (
    <>
      <div className="pricing-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', 
        gap: '1.5rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="card plan"
            style={{
              position: 'relative',
              border: plan.popular ? '2px solid var(--brand0)' : '1px solid var(--line)',
              background: 'var(--card)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
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
            
            <div className="plan-head">
              <div className="tag">{plan.name}</div>
              <div className="price" style={{ margin: '1rem 0' }}>
                {plan.price}
                {plan.interval && <span className="muted" style={{ fontSize: '1rem', fontWeight: '400' }}>{plan.interval}</span>}
              </div>
              <p className="muted" style={{ marginBottom: '1rem' }}>{plan.description}</p>
            </div>
            
            <ul className="feature" style={{ flexGrow: 1, listStyle: 'none', padding: 0 }}>
              {plan.features.map((feature, index) => (
                <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="cta" style={{ marginTop: '1.5rem' }}>
              <button
                className="btn primary block"
                onClick={() => handlePlanClick(plan)}
                style={{ width: '100%' }}
              >
                {plan.id === 'basic' 
                  ? (isSignedIn ? 'Use Free Plan' : 'Start Free')
                  : `Get ${plan.name}`
                }
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Coming Soon Card for Pro + DPMS */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(74, 144, 226, 0.1))',
        border: '1px solid var(--brand0)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: 'var(--brand0)', marginBottom: '0.5rem' }}>
          🚀 Pro + DPMS Coming Soon
        </h3>
        <p className="muted">
          Need to scan laser-etched or dot-peen marks? Our specialized DPMS algorithms are coming soon.
        </p>
        <p className="note" style={{ marginTop: '0.5rem' }}>
          <a href="mailto:hello@scansnap.io" style={{ color: 'var(--brand0)' }}>
            Contact us for early access →
          </a>
        </p>
      </div>
    </>
  );
}