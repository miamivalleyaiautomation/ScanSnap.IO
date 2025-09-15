"use client";

import { useEffect } from "react";

type Plan = {
  sku: "BASIC" | "PLUS" | "PRO" | "PRO_DPMS";
  name: string;
  price: string;   // display only
  blurb: string;
  bullets: string[];
  variantEnv: string; // env var name that stores the LS variant id
};

const LS_BASE =
  process.env.NEXT_PUBLIC_LS_CHECKOUT_BASE || "https://app.lemonsqueezy.com/buy";

/**
 * You set these in Netlify env:
 *  - NEXT_PUBLIC_LS_CHECKOUT_BASE = https://pay.scansnap.io/buy (your LS custom domain)
 *  - NEXT_PUBLIC_LS_VARIANT_BASIC
 *  - NEXT_PUBLIC_LS_VARIANT_PLUS
 *  - NEXT_PUBLIC_LS_VARIANT_PRO
 *  - NEXT_PUBLIC_LS_VARIANT_PRO_DPMS
 */
const PLANS: Plan[] = [
  {
    sku: "BASIC",
    name: "Basic",
    price: "$0",
    blurb: "Simple scanning & exports.",
    bullets: [
      "Scan barcodes",
      "Export to PDF / CSV / Excel",
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

function buyHref(variantId: string | undefined) {
  // Lemon Squeezy overlay links—works with your custom domain when provided.
  // Example result: https://pay.scansnap.io/buy/VARIANT_ID?embed=1&media=0
  if (!variantId) return "#";
  return `${LS_BASE}/${variantId}?embed=1&media=0`;
}

export default function Pricing() {
  // Ensure overlay attaches to links with class="lemonsqueezy-button"
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && window.createLemonSqueezy) {
      // @ts-ignore
      window.createLemonSqueezy();
    }
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 6 }}>Simple, seat-based pricing</h2>
      <p className="muted" style={{ marginBottom: 18 }}>
        Start on Basic, upgrade anytime. Seat count is managed by your team admin.
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

              {/* CTA */}
              {p.sku === "BASIC" ? (
                <div style={{ display: "grid", gap: 10 }}>
                  <a className="btn primary" href="/login">Start free</a>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  <a
                    className={`btn primary ${variantId ? "lemonsqueezy-button" : ""}`}
                    href={buyHref(variantId)}
                    {...(!variantId ? { "aria-disabled": true } : {})}
                  >
                    Start subscription
                  </a>
                  {!variantId && (
                    <div className="note">
                      <em>Set {p.variantEnv} in Netlify env to enable checkout.</em>
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
    </div>
  );
}
