// app/page.tsx
import SiteHeader from "@/components/SiteHeader";
import HeroPreview from "@/components/HeroPreview";

export const metadata = {
  title: "ScanSnap — Fast, accurate barcode & matrix code scanning",
  description:
    "ScanSnap scans barcodes, QR & DataMatrix locally. Nothing leaves your device. Team-ready with per-seat pricing."
};

const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.scansnap.io";
const appUrl    = process.env.NEXT_PUBLIC_APP_URL    || "https://app.scansnap.io";

// Optional direct buy links (fill these in Netlify env for one-click checkout)
const LS = {
  basic: process.env.NEXT_PUBLIC_LS_BUY_BASIC || "#pricing",
  plus:  process.env.NEXT_PUBLIC_LS_BUY_PLUS  || "#pricing",
  pro:   process.env.NEXT_PUBLIC_LS_BUY_PRO   || "#pricing",
  dpms:  process.env.NEXT_PUBLIC_LS_BUY_PRO_DPMS || "#pricing",
};

export default function Page() {
  return (
    <>
      <SiteHeader />

      {/* ===== HERO ===== */}
      <section className="hero section">
        <div className="bg-gradient" />
        <div className="container hero-grid">
          <div>
            <h1>
              Most affordable, fast, and accurate{" "}
              <span className="accent">barcode &amp; matrix code</span> scanner.
            </h1>
            <p className="lede">
              OCR &amp; cleanup run locally—<strong>no customer data is uploaded</strong>.
              Invite teammates, manage seats, and keep your workflow precise.
            </p>
            <div className="actions">
              <a className="btn primary" href={`${portalUrl}/login`}>Get started</a>
              <a className="btn" href="#features">See features</a>
            </div>
            <div style={{ height: 12 }} />
            <div className="note">Works on modern browsers. Ideal for teams and businesses.</div>
          </div>

          <div>
            <div className="device">
              <div className="device-top" />
              {/* App-in-action GIF placeholder (client component handles image error/fallback) */}
              <HeroPreview src="/assets/app-preview.gif" alt="ScanSnap in action" />
              <div className="bar">
                <button className="pill">Preview</button>
                <button className="pill">Local-only</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="section">
        <div className="container grid cols-3">
          <div className="card">
            <span className="tag">Local &amp; Private</span>
            <h3>Nothing leaves your device</h3>
            <ul className="feature">
              <li>On-device processing (no cloud upload)</li>
              <li>Fast OCR + cleanup pipeline</li>
              <li>Works offline after initial load</li>
            </ul>
          </div>

          <div className="card">
            <span className="tag">Barcode Pro</span>
            <h3>Accurate scanning</h3>
            <ul className="feature">
              <li>UPC, EAN, Code-128, Code-39, and more</li>
              <li>QR &amp; DataMatrix (Pro tier)</li>
              <li>Laser mark &amp; Dot-Peen matrix (DPMS tier)</li>
            </ul>
          </div>

          <div className="card">
            <span className="tag">Team-ready</span>
            <h3>Seats &amp; roles</h3>
            <ul className="feature">
              <li>Per-seat licensing</li>
              <li>Invite/Remove users anytime</li>
              <li>Use your company email domain</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="grid cols-4" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
            {/* BASIC */}
            <div className="card">
              <span className="tag">BASIC</span>
              <h3>Free</h3>
              <p className="muted">Scan barcodes and export to PDF, CSV, or Excel.</p>
              <ul className="feature">
                <li>Core barcode scanning</li>
                <li>Export: PDF / CSV / XLSX</li>
                <li>Personal use</li>
              </ul>
              <div style={{ height: 8 }} />
              <a className="btn block" href={`${portalUrl}/login`}>Start free</a>
            </div>

            {/* PLUS */}
            <div className="card">
              <span className="tag">PLUS</span>
              <h3>$9.99 <span className="muted">/ user / mo</span></h3>
              <p className="muted">
                Everything in Basic + import your catalog CSV and run two modes.
              </p>
              <ul className="feature">
                <li><strong>Verify</strong>: track scans against uploaded file</li>
                <li><strong>Order Builder</strong>: create vendor/in-house orders</li>
                <li>Reduce manual errors</li>
              </ul>
              <div style={{ height: 8 }} />
              <a className="btn primary block" href={LS.plus}>Choose Plus</a>
            </div>

            {/* PRO */}
            <div className="card">
              <span className="tag">PRO</span>
              <h3>$14.99 <span className="muted">/ user / mo</span></h3>
              <p className="muted">Everything in Plus + QR &amp; DataMatrix support.</p>
              <ul className="feature">
                <li>All Plus features</li>
                <li>QR code reading</li>
                <li>DataMatrix reading</li>
              </ul>
              <div style={{ height: 8 }} />
              <a className="btn primary block" href={LS.pro}>Choose Pro</a>
            </div>

            {/* PRO + DPMS */}
            <div className="card">
              <span className="tag">PRO + DPMS</span>
              <h3>$49.99 <span className="muted">/ user / mo</span></h3>
              <p className="muted">
                Pro + specialized reader for laser-mark &amp; Dot-Peen matrix codes.
              </p>
              <ul className="feature">
                <li>All Pro features</li>
                <li>Custom scanning pipeline</li>
                <li>Designed for tough marks</li>
              </ul>
              <div style={{ height: 8 }} />
              <a className="btn primary block" href={LS.dpms}>Choose Pro + DPMS</a>
            </div>
          </div>

          <div style={{ height: 12 }} />
          <p className="fine">
            Prices in USD. Per-seat licensing. You can add/remove users anytime from your portal.
            Data stays on your device—no customer data is uploaded to our servers.
          </p>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section">
        <div className="container grid cols-2">
          <div className="card">
            <h3>Contact us</h3>
            <p className="muted">Questions about pricing, teams, or a custom rollout?</p>
            <div style={{ height: 8 }} />
            <a className="btn" href="mailto:hello@scansnap.io">hello@scansnap.io</a>
          </div>

          <div className="card">
            <h3>Already a customer?</h3>
            <p className="muted">Manage your subscription, seats, and billing in the portal.</p>
            <div style={{ height: 8 }} />
            <div className="actions">
              <a className="btn" href={appUrl}>Go to App</a>
              <a className="btn primary" href={`${portalUrl}/login`}>Open Portal</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site">
  <div className="container foot-grid">
    <div className="brand-row">
      <div className="brand footer-brand" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
        <img className="mark mark-dark"  src="/assets/favicon_1024_dark.png"  alt="" />
        <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
        <img className="word word-dark"  src="/assets/text_1024_dark.png"  alt="ScanSnap" />
      </div>
      {/* ... */}

          <div>
            <h4>Product</h4>
            <div className="grid">
              <a className="link" href="#features">Features</a>
              <a className="link" href="#pricing">Pricing</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div className="grid">
              <a className="link" href="#contact">Contact</a>
              <a className="link" href={appUrl}>App</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
