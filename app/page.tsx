// app/page.tsx
import SiteHeader from "@/components/SiteHeader";
import HeroPreview from "@/components/HeroPreview";
import PricingSection from "@/components/PricingSection";
// And in the pricing section of your page:
{/* ===== PRICING ===== */}
<section id="pricing" className="section">
  <div className="container">
    <div className="section-heading">
      <h2>Pricing</h2>
      <p>Choose the plan that fits your scanning needs</p>
    </div>
    <PricingSection />  {/* This should be using the fixed component */}
  </div>
</section>






import LoginButton from "@/components/LoginButton";

export const metadata = {
  title: "ScanSnap — Professional barcode scanning and verification tool",
  description:
    "Scan, verify, and build orders with barcodes. Import your catalogs, verify deliveries, and streamline warehouse operations. Nothing leaves your device.",
};

export default function Page() {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.scansnap.io";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.scansnap.io";

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
              <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Basic barcode scanning</h3>
              <ul className="feature">
                <li>Scan barcodes with your camera or device</li>
                <li>Manual barcode entry when needed</li>
                <li>Export to PDF, CSV, or Excel</li>
                <li>Works completely offline</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag">Verify Mode</span>
              <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Delivery & order verification</h3>
              <ul className="feature">
                <li>Import your order summaries or delivery lists</li>
                <li>Scan items to verify against imported data</li>
                <li>Track counts and catch missing items</li>
                <li>Perfect for delivery verification and inventory counts</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag">Order Builder</span>
              <h3 style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>Build orders from your catalog</h3>
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
          <PricingSection />
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
              <h3>Retail & Small Business</h3>
              <ul className="feature">
                <li><strong>Vendor Orders</strong>: Replace handwritten orders with barcode scanning</li>
                <li><strong>Delivery Verification</strong>: Scan incoming shipments against order lists</li>
                <li><strong>Inventory Counts</strong>: Quick cycle counts and stock verification</li>
              </ul>
            </div>

            <div className="card">
              <h3>Warehouses & Distribution</h3>
              <ul className="feature">
                <li><strong>Pick Verification</strong>: Verify picks against order summaries</li>
                <li><strong>Receiving</strong>: Check incoming inventory against purchase orders</li>
                <li><strong>Shipping Verification</strong>: Ensure correct items before dispatch</li>
              </ul>
            </div>

            <div className="card">
              <h3>Manufacturing & Production</h3>
              <ul className="feature">
                <li><strong>Parts Sorting</strong>: Sort components using imported parts lists</li>
                <li><strong>Work Order Verification</strong>: Scan parts against production requirements</li>
                <li><strong>Quality Control</strong>: Track and verify component usage</li>
              </ul>
            </div>

            <div className="card">
              <h3>Field Service & Maintenance</h3>
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
              <a className="btn" href="mailto:support@scansnap.io">support@scansnap.io</a>
            </div>

            <div className="card">
              <h3>Existing Customer</h3>
              <p className="muted">Manage your account, subscription, and billing settings.</p>
              <div style={{ height: 8 }} />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 'auto', minWidth: '120px', maxWidth: '180px' }}>
                  <LoginButton />
                </div>
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
}