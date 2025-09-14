"use client";
import { useEffect, useRef, useState } from "react";
import type { PlanInfo } from "@/lib/lemon";

export default function PlanGrid({ plans }: { plans: PlanInfo[] }) {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // @ts-ignore
    window.createLemonSqueezy && window.createLemonSqueezy();
  }, [checkoutUrl]);

  async function startCheckout(plan: PlanInfo["slug"]) {
    const r = await fetch("/api/ls/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await r.json();
    if (!r.ok || !data?.url) { alert(data?.error || "Failed to start checkout"); return; }
    setCheckoutUrl(data.url);

    setTimeout(() => {
      // @ts-ignore
      if (window.createLemonSqueezy && anchorRef.current) {
        // @ts-ignore
        window.createLemonSqueezy();
        anchorRef.current.click();
      } else {
        window.location.href = data.url;
      }
    }, 40);
  }

  return (
    <>
      <script src="https://app.lemonsqueezy.com/js/lemon.js" async></script>
      <div className="container" style={{ display:"grid", gap:16, gridTemplateColumns:"repeat(4, minmax(0, 1fr))", marginTop:16 }}>
        {plans.map((p) => (
          <div key={p.slug} className="card" style={{ textAlign:"center" }}>
            <button className="btn primary" onClick={() => startCheckout(p.slug)}>
              Start subscription
            </button>
          </div>
        ))}
      </div>

      {checkoutUrl && (
        <a ref={anchorRef} href={checkoutUrl} className="lemonsqueezy-button" style={{ display:"none" }}>
          Open
        </a>
      )}
    </>
  );
}
