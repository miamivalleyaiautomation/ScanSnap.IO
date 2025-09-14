"use client";
import { useEffect, useState } from "react";

type Summary = { status?: string; quantity?: number; renewsAt?: string | null; portalUrl?: string | null; error?: string };

export default function PortalHome() {
  const [s, setS] = useState<Summary>({});
  useEffect(() => { (async () => {
    const r = await fetch("/api/billing/summary", { cache:"no-store" });
    setS(await r.json());
  })(); }, []);

  return (
    <section className="section">
      <div className="container grid-3">
        <div className="card">
          <h3>User management</h3>
          <p className="muted">Update your profile and manage your team.</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:10 }}>
            <a className="btn" href="/account">Account</a>
            <a className="btn" href="/org">Team & Seats</a>
          </div>
        </div>

        <div className="card">
          <h3>Subscription</h3>
          {s.error ? (
            <p className="muted" style={{ color:"tomato" }}>{s.error}</p>
          ) : (
            <>
              <p className="muted">Status: <b>{s.status ?? "—"}</b></p>
              <p className="muted">Seats: <b>{s.quantity ?? "—"}</b></p>
              <p className="muted">Next renewal: <b>{s.renewsAt ?? "—"}</b></p>
            </>
          )}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:10 }}>
            <a className="btn primary" href="/pricing">Change / Buy plan</a>
            <button className="btn" disabled={!s.portalUrl} onClick={() => s.portalUrl && (window.location.href = s.portalUrl!)}>
              Open Payment Portal
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Open the App</h3>
          <p className="muted">Jump back into scanning.</p>
          <a className="btn primary" href="https://app.scansnap.io/app">Go to App</a>
        </div>
      </div>
    </section>
  );
}
