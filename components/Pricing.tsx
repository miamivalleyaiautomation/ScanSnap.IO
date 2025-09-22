"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import LoginButton from "./LoginButton";

type Plan = {
  sku: "BASIC" | "PLUS" | "PRO" | "PRO_DPMS";
  name: string;
  price: string;
  blurb: string;
  bullets: string[];
  variantEnv: string;
};

const PLANS: Plan[] = [
  {
    sku: "BASIC",
    name: "Basic",
    price: "$0",
    blurb: "Simple scanning & exports.",
    bullets: [
      "Scan barcodes",
      "Export to PDF / CSV / Excel",
      "Single user",
    ],
    variantEnv: "NEXT_PUBLIC_LS_VARIANT_BASIC",
  },
  {
    sku: "PLUS",
    name: "Plus",
    price: "$9.99 / month",
    blurb: "Everything in Basic + catalog import & workflows.",
    bullets: [
      "Import CSV/XLS catalog",
      "Verify mode: live matching & counts",
      "Order Builder: vendor/internal orders",
    ],
    variantEnv: "NEXT_PUBLIC_LS_VARIANT_PLUS",
  },
  {
    sku: "PRO",
    name: "Pro",
    price: "$14.99 / month",
    blurb: "Advanced code support for complex ops.",
    bullets: [
      "Everything in Plus",
      "QR Code & DataMatrix scanning",
    ],
    variantEnv: "NEXT_PUBLIC_LS_VARIANT_PRO",
  },
  {
    sku: "PRO_DPMS",
    name: "Pro + DPMS",
    price: "$49.99 / month",
    blurb: "Specialized readers for tough marks.",
    bullets: [
      "Everything in Pro",
      "Laser-mark & Dot-Peen decoding",
    ],
    variantEnv: "NEXT_PUBLIC_LS_VARIANT_PRO_DPMS",
  },
];

export default function Pricing() {
  const { user, isSignedIn } = useUser();

  const handlePlanSelect = (plan: Plan) => {
    console.log("Plan selected:", plan.name);
    console.log("User signed in:", isSignedIn);
    console.log("User:", user);

    if (!isSignedIn) {
      alert('Please sign in first to purchase a subscription');
      return;
    }
    
    if (plan.sku === 'BASIC') {
      // Basic is free - redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }
    
    // Get the variant ID from environment variables
    const variantId = process.env[plan.variantEnv as keyof typeof process.env] as string | undefined;
    
    console.log("Variant ID for", plan.name, ":", variantId);
    
    if (!variantId) {
      alert(`Checkout not configured for ${plan.name} plan. Please set ${plan.variantEnv} environment variable.`);
      return;
    }

    // Construct the checkout URL with your custom domain
    const baseUrl = `https://pay.scansnap.io/buy/${variantId}`;
    
    // Add user data as URL parameters
    const params = new URLSearchParams({
      'checkout[email]': user.emailAddresses[0].emailAddress,
      'checkout[custom][clerk_user_id]': user.id,
      'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
    });
    
    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    
    console.log("Opening checkout URL:", checkoutUrl);
    
    // Open Lemon Squeezy checkout
    window.open(checkoutUrl, '_blank');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>Simple, seat-based pricing</h2>
      <p className="muted" style={{ marginBottom: 18 }}>
        Start on Basic, upgrade anytime. {!isSignedIn && 'Sign in to purchase subscriptions.'}
      </p>

      <div className="grid cols-4" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        {PLANS.map((p) => {
          const variantId = process.env[p.variantEnv as keyof typeof process.env] as string | undefined;

          return (
            <div className="card" key={p.sku} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="tag">{p.name}</div>
                <div style={{ fontSize: 28, fontWeight: 800, margin: "8px 0 2px" }}>{p.price}</div>
                <p className="muted" style={{ margin: "0 0 10px" }}>{p.blurb}</p>
                <ul className="feature" style={{ paddingLeft: 18 }}>
                  {p.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>

              {/* CTA */}
              {p.sku === "BASIC" ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {isSignedIn ? (
                    <button 
                      className="btn primary"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      Go to Dashboard
                    </button>
                  ) : (
                    <LoginButton />
                  )}
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {isSignedIn ? (
                    <button
                      className="btn primary"
                      onClick={() => handlePlanSelect(p)}
                      style={{ 
                        opacity: variantId ? 1 : 0.5,
                        cursor: variantId ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {variantId ? 'Start subscription' : 'Coming soon'}
                    </button>
                  ) : (
                    <div>
                      <LoginButton />
                      <p className="note" style={{ marginTop: 8, textAlign: 'center' }}>
                        Sign in required
                      </p>
                    </div>
                  )}
                  {!variantId && (
                    <div className="note">
                      <em>Variant ID not set</em>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="note" style={{ marginTop: 14 }}>
        Need a quote, PO, or have volume requirements? <a href="#contact" className="link">Contact us</a>.
      </div>
      
      {/* Debug info - remove in production */}
      {isSignedIn && (
        <div style={{ marginTop: 20, padding: 10, backgroundColor: '#f5f5f5', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br/>
          User ID: {user?.id}<br/>
          Email: {user?.emailAddresses[0]?.emailAddress}<br/>
          Plus Variant: {process.env.NEXT_PUBLIC_LS_VARIANT_PLUS || 'Not set'}<br/>
          Pro Variant: {process.env.NEXT_PUBLIC_LS_VARIANT_PRO || 'Not set'}<br/>
          Pro DPMS Variant: {process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS || 'Not set'}
        </div>
      )}
    </div>
  );
}