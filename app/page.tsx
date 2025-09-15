import Header from "@/components/Header";

export default function Page() {
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.scansnap.io";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.scansnap.io";

  return (
    <>
      <Header />

      <section className="section hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Most affordable, fast, and accurate <span className="accent">barcode & matrix code</span> scanner.</h1>
            <p className="lede">
              OCR & cleanup run locally—<strong>no customer data uploaded</strong>.
              Invite teammates and manage seats with role-based controls.
            </p>
            <div className="actions">
              <a className="btn primary" href={`${portalUrl}/login`}>Get Started</a>
              <a className="btn" href="#features">See features</a>
            </div>
            <div className="badges">
              <span className="tag">Fast</span><span className="tag">Secure</span><span className="tag">Team-ready</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="device">
              <div className="device-top" />
              <img
                src="/assets/app-preview.gif"
                alt="ScanSnap in action"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml;utf8," +
                    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
                      <rect width='100%' height='100%' fill='#0f141a'/>
                      <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle'
                        fill='#9aa3b2' font-family='system-ui,-apple-system,Segoe UI' font-size='18'>
                        App preview GIF placeholder
                      </text></svg>`);
                }}
              />
              <div className="bar"><button className="pill">Preview</button><button className="pill">Local-only</button></div>
            </div>
          </div>
        </div>
        <div className="bg-gradient" />
      </section>

      <section id="features" className="section">
        <div className="container">
          <h2>Everything you need to move fast</h2>
          <p className="note">No data leaves your device. Export results anywhere.</p>

          <div className="grid cols-3">
            <article className="card"><h3>Lightning scans ⚡</h3><ul className="feature"><li>Crystal-clear PDFs</li><li>Auto-straighten & crop</li><li>Smart file names</li></ul></article>
            <article className="card"><h3>Organize & share 📁</h3><ul className="feature"><li>Folders, tags & quick links</li><li>Searchable text</li><li>One-click export</li></ul></article>
            <article className="card"><h3>Verify mode ✅</h3><p className="muted">Upload your catalog/CSV and track codes against the uploaded file with immediate feedback.</p></article>
            <article className="card"><h3>Order Builder 🧾</h3><p className="muted">Build accurate order lists for vendors/suppliers—minimize errors and manual entry.</p></article>
            <article className="card"><h3>Advanced codes 📷</h3><p className="muted">Adds QR and DataMatrix scanning for Pro.</p></article>
            <article className="card"><h3>Industrial DPMS 🏭</h3><p className="muted">Read laser-mark & dot-peened codes with custom scanning (Pro + DPMS).</p></article>
          </div>
        </div>
      </section>

      <section id="pricing" className="section">
        <div className="container">
          <h2>Pricing that scales with you</h2>
          <div className="grid pricing-grid">
            <article className="card plan">
              <header className="plan-head">
                <h3>Basic</h3><div className="price">$0</div>
                <div className="muted">Scan barcodes & export to PDF/CSV/Excel.</div>
              </header>
              <ul className="feature"><li>Local processing</li><li>Fast exports</li></ul>
              <a className="btn primary block" href={`${portalUrl}/login?plan=basic`}>Start free</a>
            </article>

            <article className="card plan">
              <header className="plan-head"><h3>Plus</h3><div className="price">$9.99</div>
                <div className="muted">Everything in Basic + CSV import, Verify & Order Builder.</div>
              </header>
              <ul className="feature"><li>Catalog/CSV import</li><li>Verify mode</li><li>Order Builder</li></ul>
              <a className="btn primary block" href={`${portalUrl}/login?plan=plus`}>Choose Plus</a>
            </article>

            <article className="card plan">
              <header className="plan-head"><h3>Pro</h3><div className="price">$14.99</div>
                <div className="muted">Plus + QR & DataMatrix scanning.</div>
              </header>
              <ul className="feature"><li>QR & DataMatrix</li><li>All Plus features</li></ul>
              <a className="btn primary block" href={`${portalUrl}/login?plan=pro`}>Choose Pro</a>
            </article>

            <article className="card plan">
              <header className="plan-head"><h3>Pro + DPMS</h3><div className="price">$49.99</div>
                <div className="muted">Everything in Pro + industrial DPMS.</div>
              </header>
              <ul className="feature"><li>Laser-mark & dot-peened reading</li><li>All Pro features</li></ul>
              <a className="btn primary block" href={`${portalUrl}/login?plan=pro-dpms`}>Choose Pro + DPMS</a>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <h2>Contact</h2>
          <div className="grid cols-2">
            <div className="card">
              <p className="muted">Questions or need a tailored workflow? We’re happy to help.</p>
              <a className="btn" href="mailto:support@scansnap.io">support@scansnap.io</a>
            </div>
            <form className="card inputs" onSubmit={(e) => e.preventDefault()}>
              <label>Name<input className="input" placeholder="Your name" /></label>
              <label>Email<input className="input" placeholder="you@company.com" type="email" /></label>
              <label>Message<textarea placeholder="How can we help?" /></label>
              <button className="btn primary" type="submit" disabled>Send (placeholder)</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site">
        <div className="container foot-grid">
          <div className="brand-row">
            <div className="brand-badge">
              <img className="mark mark-light" src="/assets/favicon_1024_light.png" alt="" />
              <img className="mark mark-dark" src="/assets/favicon_1024_dark.png" alt="" />
              <span className="brand-text">
                <img className="word word-light" src="/assets/text_1024_light.png" alt="ScanSnap" />
                <img className="word word-dark" src="/assets/text_1024_dark.png" alt="ScanSnap" />
              </span>
            </div>
            <small className="muted">© {new Date().getFullYear()} ScanSnap</small>
          </div>
          <div><div className="muted">Product</div><div><a href="#features">Features</a></div><div><a href="#pricing">Pricing</a></div></div>
          <div><div className="muted">Company</div><div><a href="#contact">Contact</a></div><div><a href={`${portalUrl}/login`}>Login</a></div></div>
        </div>
      </footer>
    </>
  );
}
