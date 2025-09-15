"use client";

import { useEffect, useRef, useState } from "react";

type Plan = {
  slug: "basic" | "plus" | "pro" | "pro_dpms";
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
};

const PLANS: Plan[] = [
  { slug:"basic", name: "Basic", price: "$0", period: "", features: [
      "Core scanning",
      "Single user",
      "Community support"
    ], cta: "Start free"
  },
  { slug:"plus", name: "Plus", price: "$9.99", period: "/month", features: [
      "Everything in Basic",
      "AI enhancements",
      "Priority support"
    ], cta: "Choose Plus"
  },
  { slug:"pro", name: "Pro", price: "$14.99", period: "/month", features: [
      "Everything in Plus",
      "Advanced workspaces",
      "Team sharing"
    ], cta: "Choose Pro"
  },
  { slug:"pro_dpms", name: "Pro + DPMs", price: "$49.99", period: "/month", features: [
      "Everything in Pro",
      "DPMs add-on",
      "Best for businesses"
    ], cta: "Choose Pro + DPMs"
  },
];

export default function PricingGrid({ portalUrl = "https://portal.scansnap.io" }: { portalUrl?: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // initialize Lemon Squeezy overlay if the script is already loaded
    // @ts-ignore
    window.createLemonSqueezy && window.createLemonSqueezy();
  }, []);

  async function buy(slug: Plan["slug"]) {
    if (slug === "basic") {
      window.location.href = `${portalUrl}/login`;
      return;
    }
    try {
      setBusy(slug);
      const res = await fetch(`/api/ls/checkout`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ plan: slug })
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Failed to create checkout");

      // open overlay if possible, else redirect
      // @ts-ignore
      if (window.createLemonSqueezy && anchorRef.current) {
        // @ts-ignore
        window.createLemonSqueezy();
        anchorRef.current.setAttribute("href", data.url);
        anchorRef.current.click();
      } else {
        window.location.href = data.url;
      }
    } catch (e:any) {
      alert(e.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {/* Lemon Squeezy overlay script + hidden anchor */}
      <script async src="https://app.lemonsqueezy.com/js/lemon.js" />
      <a ref={anchorRef} className="lemonsqueezy-button" style={{ display:"none" }} href="#" />

      <div className="grid cols-3">
        {PLANS.map(p => (
          <div key={p.slug} className="card">
            <div className="tag">{p.name}</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, margin:"10px 0 6px" }}>
              <div style={{ fontSize:32, fontWeight:800 }}>{p.price}</div>
              {p.period && <div className="muted">{p.period}</div>}
            </div>
            <ul className="feature" style={{ paddingLeft:18, margin:"8px 0 16px" }}>
              {p.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="btn primary block" onClick={() => buy(p.slug)} disabled={busy === p.slug}>
              {busy === p.slug ? "Loading..." : p.cta}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
