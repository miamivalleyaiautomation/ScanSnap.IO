import { getAllPlans, formatMoney, PlanInfo } from "@/lib/lemon";
import PlanGrid from "./plan-grid";

export const revalidate = 300;

export default async function PricingPage() {
  const plans = await getAllPlans();
  return (
    <section className="section">
      <div className="container" style={{ display:"grid", gap:16, gridTemplateColumns:"repeat(4, minmax(0, 1fr))" }}>
        {plans.map((p) => (
          <div key={p.slug} className="card" style={{ textAlign:"center" }}>
            <h3>{labelFor(p.slug)}</h3>
            <p className="muted">{p.name}</p>
            <div style={{ margin:"12px 0 16px" }}>
              <div style={{ fontSize:36, fontWeight:800 }}>{formatMoney(p.priceCents, p.currency)}</div>
              <div className="muted">per user / {p.interval}</div>
            </div>
            {/* Button is rendered by PlanGrid to open LS overlay */}
          </div>
        ))}
      </div>

      {/* Buttons & lemon.js (client) */}
      <PlanGrid plans={plans} />
    </section>
  );
}

function labelFor(slug: PlanInfo["slug"]) {
  switch (slug) {
    case "basic": return "BASIC";
    case "plus": return "PLUS";
    case "pro": return "PRO";
    case "pro-dpms": return "PRO + DPMs";
  }
}
