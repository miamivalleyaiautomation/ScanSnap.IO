// components/PricingSection.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// CRITICAL: Static mapping of variant IDs - REQUIRED FOR PRODUCTION
// These must match your Netlify environment variables exactly
const VARIANT_IDS = {
  basic: undefined, // Basic is free, no variant
  plus: process.env.NEXT_PUBLIC_LS_VARIANT_PLUS,
  pro: process.env.NEXT_PUBLIC_LS_VARIANT_PRO,
  pro_dpms: process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS,
} as const

// Verify on mount that IDs are loaded (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('PricingSection - Variant IDs loaded:', {
    plus: VARIANT_IDS.plus || 'NOT SET',
    pro: VARIANT_IDS.pro || 'NOT SET', 
    pro_dpms: VARIANT_IDS.pro_dpms || 'NOT SET',
  });
}

const PLANS = [
  {
    id: 'basic' as const,
    name: 'Basic',
    price: 'Free',
    interval: '',
    description: 'Essential barcode scanning for small-scale operations.',
    features: [
      'Scan standard barcodes',
      'Manual barcode entry', 
      'Export to PDF, CSV, Excel',
      'Single user'
    ]
  },
  {
    id: 'plus' as const,
    name: 'Plus',
    price: '$9.99',
    interval: '/ user / mo',
    description: 'Verification and order building for professional workflows.',
    features: [
      'Everything in Basic',
      'Verify Mode: Import and verify against delivery lists',
      'Order Builder: Upload catalogs, build orders by scanning',
      'Track quantities and catch discrepancies'
    ],
    popular: true
  },
  {
    id: 'pro' as const,
    name: 'Pro', 
    price: '$14.99',
    interval: '/ user / mo',
    description: 'Advanced code support for complex operations.',
    features: [
      'Everything in Plus',
      'QR code scanning',
      'DataMatrix code scanning',
      'Ideal for modern packaging and parts'
    ]
  },
  {
    id: 'pro_dpms' as const,
    name: 'Pro + DPMS',
    price: '$49.99', 
    interval: '/ user / mo',
    description: 'Specialized algorithms for hard-to-read industrial codes.',
    features: [
      'Everything in Pro',
      'Dot-peen marked codes',
      'Laser-etched difficult marks',
      'Custom scanning algorithms'
    ]
  }
];

export default function PricingSection() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handlePlanClick = (plan: typeof PLANS[0]) => {
    console.log('Plan clicked:', plan.name);
    console.log('Plan ID:', plan.id);
    
    if (!isSignedIn) {
      // Redirect to login with the plan information
      router.push(`/login?redirect_url=/dashboard&plan=${plan.id}`);
      return;
    }

    if (plan.id === 'basic') {
      // Redirect to dashboard for free plan
      window.location.href = '/dashboard';
      return;
    }

    // CRITICAL: Use static mapping, NOT dynamic env variable access
    const variantId = VARIANT_IDS[plan.id];
    
    console.log('Variant ID for', plan.name, ':', variantId);
    
    if (!variantId) {
      console.error('No variant ID found for plan:', plan.id);
      alert(`This plan is not available for purchase yet. Please contact support.`);
      return;
    }

    // Build the Lemon Squeezy checkout URL
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
    <div className="pricing-grid">
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
            <div className="price">
              {plan.price}
              {plan.interval && <span className="muted" style={{ fontSize: '1rem', fontWeight: '400' }}>{plan.interval}</span>}
            </div>
            <p className="muted">{plan.description}</p>
          </div>
          
          <ul className="feature" style={{ flexGrow: 1 }}>
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          <div className="cta">
            <button
              className="btn primary block"
              onClick={() => handlePlanClick(plan)}
              style={{ width: '100%' }}
            >
              {plan.id === 'basic' 
                ? (isSignedIn ? 'Go to Dashboard' : 'Start Free')
                : `Get ${plan.name}`
              }
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}