// app/page.tsx
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="section hero" style={{ paddingTop: "40px" }}>
        <div className="container">
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: "24px", alignItems: "center" }}>
            {/* Left copy */}
            <div>
              <div className="tag">Scan • Verify • Build orders</div>
              <h1 style={{ margin: "10px 0 6px" }}>
                Lightning-fast barcode & parts scanning
              </h1>
              <p className="lede">
                Capture barcodes and codes instantly, export to <strong>PDF / CSV / Excel</strong>, verify stock against your catalog, and build error-free orders.
                <br/> <strong>All processing stays on your device—no uploads.</strong>
              </p>

              <div className="actions" style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                <Link href="/login" className="btn primary">Sign in</Link>
                <a href="#pricing" className="btn">View pricing</a>
                <a href="https://app.scansnap.io" className="btn">Open App</a>
              </div>
            </div>

            {/* Right: demo frame */}
            <div>
              <div className="card device" style={{ overflow: "hidden" }}>
                {/* If you add a real GIF later, place it at /public/assets/app-demo.gif */}
                <div className="device-top" />
                <div style={{ position: "relative" }}>
                  {/* Placeholder image block */}
                  <div
                    className="demo-skeleton"
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 10",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid var(--line)",
                      borderRadius: 12,
                      background:
                        "repeating-linear-gradient(135deg, rgba(148,163,184,.06), rgba(148,163,184,.06) 12px, transparent 12px, transparent 24px)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo GIF placeholder</div>
                      <div className="muted" style={{ fontSize: 14 }}>
                        Drop <code>/public/assets/app-demo.gif</code> to replace this.
                      </div>
                    </div>
                  </div>

                  {/* If you already have a GIF, uncomment this block: */}
                  {/*
                  <Image
                    src="/assets/app-demo.gif"
                    alt="ScanSnap app in action"
                    width={1280}
                    height={800}
                    style={{ width: "100%", height: "auto", display: "block", borderRadius: 12, border: "1px solid var(--line)" }}
                  />
                  */}
                </div>

                {/* quick pills */}
                <div className="bar" style={{ display: "flex", gap: 8, position: "absolute", inset: "auto 12px 12px auto" }}>
                  <span className="pill">Fast</span>
                  <span className="pill">Secure</span>
                  <span className="pill">Team-ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy callout */}
          <div className="card" style={{ marginTop: 16 }}>
            <strong>Privacy first.</strong> Nothing is uploaded—processing runs locally in your browser. Your catalogs, scans and orders stay on your device.
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="section">
        <div className="container">
          <Features />
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section">
        <div className="container">
          <Pricing />
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section">
        <div className="container">
          <div className="card">
            <h2>Contact us</h2>
            <p className="muted">Questions or a custom workflow? We’d love to help.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
              <a className="btn" href="mailto:support@scansnap.io">Email support@scansnap.io</a>
              <a className="btn" href="/#pricing">See plans</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
