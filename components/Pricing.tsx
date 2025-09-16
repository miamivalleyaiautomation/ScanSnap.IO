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

function getBuyHref(plan: Plan, user: any) {
  const variantId = process.env[plan.variantEnv as keyof typeof process.env] as string | undefined;
  if (!variantId) return "#";
  
  const baseUrl = `https://app.lemonsqueezy.com/checkout/buy/${variantId}`;
  
  if (user) {
    // Add user data to checkout URL
    const params = new URLSearchParams({
      'checkout[email]': user.emailAddresses[0].emailAddress,
      'checkout[custom][clerk_user_id]': user.id,
      'checkout[custom][user_name]': `${user.firstName || ''} ${user.lastName || ''}`.trim()
    });
    return `${baseUrl}?${params.toString()}`;
  }
  
  return baseUrl;
}

export default function Pricing() {
  const { user, isSignedIn } = useUser();

  // Ensure overlay attaches to links with class="lemonsqueezy-button"
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.createLemonSqueezy) {
      // @ts-ignore
      window.createLemonSqueezy();
    }
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    if (!isSignedIn) {
      alert('Please sign in first to purchase a subscription');
      return;
    }
    
    if (plan.sku === 'BASIC') {
      // Basic is free - redirect to app
      window.location.href = '/dashboard';
      return;
    }
    
    // Open Lemon Squeezy checkout
    const checkoutUrl = getBuyHref(plan, user);
    window.open(checkoutUrl, '_blank');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>Simple, seat-based pricing</h2>
      <p className="muted" style={{ marginBottom: 18 }}>
        Start on Basic, upgrade anytime. {!isSignedIn && 'Sign in to purchase subscriptions.'}
      </p>

      {/* Overlay script once on the page */}
      <script src="https://app.lemonsqueezy.com/js/lemon.js" defer />

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

              {/* C