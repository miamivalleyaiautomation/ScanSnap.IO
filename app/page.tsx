// app/page.tsx
import SiteHeader from "@/components/SiteHeader";
import HeroPreview from "@/components/HeroPreview";

export const metadata = {
  title: "ScanSnap — Professional barcode scanning and verification tool",
  description:
    "Scan, verify, and build orders with barcodes. Import your catalogs, verify deliveries, and streamline warehouse operations. Nothing leaves your device.",
};

export default function Page() {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.scansnap.io";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";

  const LS_BASIC = process.env.NEXT_PUBLIC_LS_BUY_BASIC ?? "#pricing";
  const LS_PLUS  = process.env.NEXT_PUBLIC_LS_BUY_PLUS  ?? "#pricing";
  const LS_PRO   = process.env.NEXT_PUBLIC_LS_BUY_PRO   ?? "#pricing";
  const LS_DPMS  = process.env.NEXT_PUBLIC_LS_BUY_PRO_DPMS ?? "#pricing";

  return (
    <>
      <SiteHeader />

      {/* ===== HERO ===== */}
      <section className="hero section">
        <div className="bg-gradient" />
        <div className="container hero-grid">
          <div>
            <h1>
              Professional <span className="accent">barcode scanning</span> for businesses that need accuracy.
            </h1>
            <p className="lede">
              Scan, verify deliveries, and build orders with confidence. Import your catalogs, verify against shipments, and streamline warehouse operations—<strong>all data stays on your device</strong>.
            </p>
            <div className="actions">
              <a className="btn primary" href={`${portalUrl}/login`}>Start scanning</a>
              <a className="btn" href="#features">See what it does</a>
            </div>
            <div style={{ height: 12 }} />
            <div className="note">Perfect for retail, warehouses, and production environments.</div>
          </div>

          <div>
            <div className="device">
              <div className="device-top" />
              <HeroPreview src="/assets/app-preview.gif" alt="ScanSnap in action" />
              <div className="bar">
                <button className="pill" type="button">Live Demo</button>
                <button className="pill" type="button">Offline-Ready</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Three powerful modes for every workflow</h2>
            <p>From simple scanning to complex order building and delivery verification</p>
          </div>
          <div className="grid cols-3">
            <div className="card">
              <span className="tag">Scan Mode</span>
              <h3>Basic barcode scanning</h3>
              <ul className="feature">
                <li>Scan barcodes with your camera or device</li>
                <li>Manual barcode entry when needed</li>
                <li>Export to PDF, CSV, or Excel</li>
                <li>Works completely offline</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag">Verify Mode</span>
              <h3>Delivery &amp; order verification</h3>
              <ul className="feature">
                <li>Import your order summaries or delivery lists</li>
                <li>Scan items to verify against imported data</li>
                <li>Track counts and catch missing items</li>
                <li>Perfect for delivery verification and inventory counts</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag">Order Builder</span>
              <h3>Build orders from your catalog</h3>
              <ul className="feature">
                <li>Upload CSV with barcodes and descriptions</li>
                <li>Scan to add items with automatic lookup</li>
                <li>Track quantities from repeated scans</li>
                <li>Replace paper-based vendor ordering</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Pricing</h2>
            <p>Choose the plan that fits your scanning needs</p>
          </div>
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
              <a className="btn block" href={`${portalUrl}/login`}>Start free</a>
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
              <a className="btn primary block" href={LS_PLUS}>Choose Plus</a>
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
              <a className="btn primary block" href={LS_PRO}>Choose Pro</a>
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
              <a className="btn primary block" href={LS_DPMS}>Coming Soon</a>
            </div>
          </div>

          <div style={{ height: 12 }} />
          <p className="fine">
            Prices in USD. Per-seat licensing for teams. Add or remove users anytime from your portal.
            All data processing happens locally—nothing is uploaded to our servers.
          </p>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section id="use-cases" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Built for real business workflows</h2>
            <p>See how teams use ScanSnap to streamline their operations</p>
          </div>
          <div className="grid cols-2">
            <div className="card">
              <h3>Retail &amp; Small Business</h3>
              <ul className="feature">
                <li><strong>Vendor Orders</strong>: Replace handwritten orders with barcode scanning</li>
                <li><strong>Delivery Verification</strong>: Scan incoming shipments against order lists</li>
                <li><strong>Inventory Counts</strong>: Quick cycle counts and stock verification</li>
              </ul>
            </div>

            <div className="card">
              <h3>Warehouses &amp; Distribution</h3>
              <ul className="feature">
                <li><strong>Pick Verification</strong>: Verify picks against order summaries</li>
                <li><strong>Receiving</strong>: Check incoming inventory against purchase orders</li>
                <li><strong>Shipping Verification</strong>: Ensure correct items before dispatch</li>
              </ul>
            </div>

            <div className="card">
              <h3>Manufacturing &amp; Production</h3>
              <ul className="feature">
                <li><strong>Parts Sorting</strong>: Sort components using imported parts lists</li>
                <li><strong>Work Order Verification</strong>: Scan parts against production requirements</li>
                <li><strong>Quality Control</strong>: Track and verify component usage</li>
              </ul>
            </div>

            <div className="card">
              <h3>Field Service &amp; Maintenance</h3>
              <ul className="feature">
                <li><strong>Parts Ordering</strong>: Build service orders by scanning needed parts</li>
                <li><strong>Delivery Verification</strong>: Verify parts deliveries at job sites</li>
                <li><strong>Inventory Management</strong>: Track van stock and supplies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Get Started Today</h2>
            <p>Questions about implementation or need a custom solution?</p>
          </div>
          <div className="grid cols-2">
            <div className="card">
              <h3>Contact Sales</h3>
              <p className="muted">Questions about team licensing, custom workflows, or bulk deployments?</p>
              <div style={{ height: 8 }} />
              <a className="btn" href="mailto:hello@scansnap.io">hello@scansnap.io</a>
            </div>

            <div className="card">
              <h3>Existing Customer</h3>
              <p className="muted">Manage your subscription, team members, and billing settings.</p>
              <div style={{ height: 8 }} />
              <div className="actions">
                <a className="btn" href={appUrl}>Open App</a>
                <a className="btn primary" href={`${portalUrl}/login`}>Billing Portal</a>
              </div>
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
            <p className="muted">© {new Date().getFullYear()} ScanSnap. All rights reserved.</p>
          </div>
          <div>
            <h4>Product</h4>
            <div className="grid">
              <a className="link" href="#features">Features</a>
              <a className="link" href="#pricing">Pricing</a>
              <a className="link" href="#use-cases">Use Cases</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div className="grid">
              <a className="link" href="#contact">Contact</a>
              <a className="link" href={appUrl}>Open App</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}// app/page.tsx
import SiteHeader from "@/components/SiteHeader";
import HeroPreview from "@/components/HeroPreview";

export const metadata = {
  title: "ScanSnap — Fast, accurate barcode & matrix code scanning",
  description:
    "Scan barcodes, QR & DataMatrix locally. Nothing leaves your device. Team-ready with per-seat pricing.",
};

export default function Page() {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.scansnap.io";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";

  const LS_BASIC = process.env.NEXT_PUBLIC_LS_BUY_BASIC ?? "#pricing";
  const LS_PLUS  = process.env.NEXT_PUBLIC_LS_BUY_PLUS  ?? "#pricing";
  const LS_PRO   = process.env.NEXT_PUBLIC_LS_BUY_PRO   ?? "#pricing";
  const LS_DPMS  = process.env.NEXT_PUBLIC_LS_BUY_PRO_DPMS ?? "#pricing";

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
              <HeroPreview src="/assets/app-preview.gif" alt="ScanSnap in action" />
              <div className="bar">
                <button className="pill" type="button">Preview</button>
                <button className="pill" type="button">Local-only</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Features</h2>
            <p>Everything you need for professional barcode scanning</p>
          </div>
          <div className="grid cols-3">
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
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Pricing</h2>
            <p>Simple, transparent pricing that scales with your team</p>
          </div>
          <div className="pricing-grid">
            {/* BASIC */}
            <div className="card">
              <div>
                <span className="tag">BASIC</span>
                <h3>Free</h3>
                <p className="muted">Scan barcodes and export to PDF, CSV, or Excel.</p>
                <ul className="feature">
                  <li>Core barcode scanning</li>
                  <li>Export: PDF / CSV / XLSX</li>
                  <li>Personal use</li>
                </ul>
              </div>
              <div style={{ height: 8 }} />
              <a className="btn block" href={`${portalUrl}/login`}>Start free</a>
            </div>

            {/* PLUS */}
            <div className="card">
              <div>
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
              </div>
              <div style={{ height: 8 }} />
              <a className="btn primary block" href={LS_PLUS}>Choose Plus</a>
            </div>

            {/* PRO */}
            <div className="card">
              <div>
                <span className="tag">PRO</span>
                <h3>$14.99 <span className="muted">/ user / mo</span></h3>
                <p className="muted">Everything in Plus + QR &amp; DataMatrix support.</p>
                <ul className="feature">
                  <li>All Plus features</li>
                  <li>QR code reading</li>
                  <li>DataMatrix reading</li>
                </ul>
              </div>
              <div style={{ height: 8 }} />
              <a className="btn primary block" href={LS_PRO}>Choose Pro</a>
            </div>

            {/* PRO + DPMS */}
            <div className="card">
              <div>
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
              </div>
              <div style={{ height: 8 }} />
              <a className="btn primary block" href={LS_DPMS}>Choose Pro + DPMS</a>
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
        <div className="container">
          <div className="section-heading">
            <h2>Contact</h2>
            <p>Get in touch with our team</p>
          </div>
          <div className="grid cols-2">
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
            <p className="muted">© {new Date().getFullYear()} ScanSnap. All rights reserved.</p>
          </div>
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
