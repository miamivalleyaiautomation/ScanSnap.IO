// components/PricingSection.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    interval: '',
    description: 'Essential barcode scanning for small-scale operations.',
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
    interval: '/ user / mo',
    description: 'Verification and order building for professional workflows.',
    features: [
      'Everything in Basic',
      'Verify Mode: Import and verify against delivery lists',
      'Order Builder: Upload catalogs, build orders by scanning',
      'Track quantities and catch discrepancies'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PLUS',
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro', 
    price: '$14.99',
    interval: '/ user / mo',
    description: 'Advanced code support for complex operations.',
    features: [
      'Everything in Plus',
      'QR code scanning',
      'DataMatrix code scanning',
      'Ideal for modern packaging and parts'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO'
  },
  {
    id: 'pro_dpms',
    name: 'Pro + DPMS',
    price: '$49.99', 
    interval: '/ user / mo',
    description: 'Specialized algorithms for hard-to-read industrial codes.',
    features: [
      'Everything in Pro',
      'Dot-peen marked codes',
      'Laser-etched difficult marks',
      'Custom scanning algorithms'
    ],
    variantEnv: 'NEXT_PUBLIC_LS_VARIANT_PRO_DPMS'
  }
];

export default function PricingSection() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handlePlanClick = (plan: typeof PLANS[0]) => {
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

    const variantId = process.env[plan.variantEnv as keyof typeof process.env];
    if (!variantId) {
      alert('This plan is not available for purchase yet. Please contact support.');
      return;
    }

    const checkoutUrl = `https://pay.scansnap.io/checkout/buy/${variantId}?` + 
      new URLSearchParams({
        'checkout[email]': user.emailAddresses[0].emailAddress,
        'checkout[custom][clerk_user_id]': user.id,
        'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }).toString();

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
            background: 'var(--card)'
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
          
          <ul className="feature">
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          <div className="cta">
            <button
              className="btn primary block"
              onClick={() => handlePlanClick(plan)}
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