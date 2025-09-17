"use client";

import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import LoginButton from "./LoginButton";

export default function PricingSection() {
  const { user, isSignedIn } = useUser();

  const handlePurchase = (planName: string, variantEnv: string) => {
    console.log("Purchase clicked for:", planName);
    
    if (!isSignedIn) {
      alert('Please sign in first to purchase a subscription');
      return;
    }

    // Get the variant ID from environment variables
    const variantId = process.env[variantEnv as keyof typeof process.env] as string | undefined;
    
    console.log("Variant ID:", variantId);
    
    if (!variantId) {
      alert(`Checkout not configured for ${planName} plan. Please contact support.`);
      return;
    }

    // Construct checkout URL with custom domain
    const baseUrl = `https://pay.scansnap.io/checkout/buy/${variantId}`;
    
    const params = new URLSearchParams({
      'checkout[email]': user!.emailAddresses[0].emailAddress,
      'checkout[custom][clerk_user_id]': user!.id,
      'checkout[custom][user_name]': `${user!.firstName || ''} ${user!.lastName || ''}`.trim()
    });
    
    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    
    console.log("Opening checkout URL:", checkoutUrl);
    
    // Open Lemon Squeezy checkout
    window.open(checkoutUrl, '_blank');
  };

  return (
    <div className="pricing-grid">
      {/* BASIC */}
      <div className="card">
        <div>
          <span className="tag">BASIC</span>
          <h3>Free</h3>
          <p className="muted">Essential barcode scanning for small-scale operations.</p>
          <ul className="feature">
            <li>Scan standard barcodes</li>
            <li>Manual barcode entry</li>
            <li>Export to PDF, CSV, Excel</li>
            <li>Single user</li>
          </ul>
        </div>
        <div style={{ height: 8 }} />
        <SignedOut>
          <LoginButton />
        </SignedOut>
        <SignedIn>
          <a className="btn block" href="/dashboard">Go to Dashboard</a>
        </SignedIn>
      </div>

      {/* PLUS */}
      <div className="card">
        <div>
          <span className="tag">PLUS</span>
          <h3>$9.99 <span className="muted">/ user / mo</span></h3>
          <p className="muted">
            Verification and order building for professional workflows.
          </p>
          <ul className="feature">
            <li>Everything in Basic</li>
            <li><strong>Verify Mode</strong>: Import and verify against delivery lists</li>
            <li><strong>Order Builder</strong>: Upload catalogs, build orders by scanning</li>
            <li>Track quantities and catch discrepancies</li>
          </ul>
        </div>
        <div style={{ height: 8 }} />
        <SignedOut>
          <div>
            <LoginButton />
            <p className="note" style={{ marginTop: 8, textAlign: 'center' }}>
              Sign in required
            </p>
          </div>
        </SignedOut>
        <SignedIn>
          <button 
            className="btn primary block" 
            onClick={() => handlePurchase("Plus", "NEXT_PUBLIC_LS_VARIANT_PLUS")}
          >
            Choose Plus
          </button>
        </SignedIn>
      </div>

      {/* PRO */}
      <div className="card">
        <div>
          <span className="tag">PRO</span>
          <h3>$14.99 <span className="muted">/ user / mo</span></h3>
          <p className="muted">Advanced code support for complex operations.</p>
          <ul className="feature">
            <li>Everything in Plus</li>
            <li>QR code scanning</li>
            <li>DataMatrix code scanning</li>
            <li>Ideal for modern packaging and parts</li>
          </ul>
        </div>
        <div style={{ height: 8 }} />
        <SignedOut>
          <div>
            <LoginButton />
            <p className="note" style={{ marginTop: 8, textAlign: 'center' }}>
              Sign in required
            </p>
          </div>
        </SignedOut>
        <SignedIn>
          <button 
            className="btn primary block" 
            onClick={() => handlePurchase("Pro", "NEXT_PUBLIC_LS_VARIANT_PRO")}
          >
            Choose Pro
          </button>
        </SignedIn>
      </div>

      {/* PRO + DPMS */}
      <div className="card">
        <div>
          <span className="tag">PRO + DPMS</span>
          <h3>$49.99 <span className="muted">/ user / mo</span></h3>
          <p className="muted">
            Specialized algorithms for hard-to-read industrial codes.
          </p>
          <ul className="feature">
            <li>Everything in Pro</li>
            <li>Dot-peen marked codes</li>
            <li>Laser-etched difficult marks</li>
            <li>Custom scanning algorithms</li>
          </ul>
        </div>
        <div style={{ height: 8 }} />
        <SignedOut>
          <div>
            <LoginButton />
            <p className="note" style={{ marginTop: 8, textAlign: 'center' }}>
              Sign in required
            </p>
          </div>
        </SignedOut>
        <SignedIn>
          <button 
            className="btn primary block" 
            onClick={() => handlePurchase("Pro + DPMS", "NEXT_PUBLIC_LS_VARIANT_PRO_DPMS")}
          >
            Choose Pro + DPMS
          </button>
        </SignedIn>
      </div>
      
      {/* Debug info for testing - remove in production */}
      {isSignedIn && (
        <div style={{ 
          gridColumn: '1 / -1', 
          marginTop: 20, 
          padding: 10, 
          backgroundColor: '#f5f5f5', 
          fontSize: '12px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <strong>Debug Info (remove in production):</strong><br/>
          User ID: {user?.id}<br/>
          Email: {user?.emailAddresses[0]?.emailAddress}<br/>
          Plus Variant: {process.env.NEXT_PUBLIC_LS_VARIANT_PLUS || 'NOT SET'}<br/>
          Pro Variant: {process.env.NEXT_PUBLIC_LS_VARIANT_PRO || 'NOT SET'}<br/>
          Pro DPMS Variant: {process.env.NEXT_PUBLIC_LS_VARIANT_PRO_DPMS || 'NOT SET'}
        </div>
      )}
    </div>
  );
}